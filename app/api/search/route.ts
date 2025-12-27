import { NextRequest, NextResponse } from 'next/server';
import { getProductsIndex } from '@/lib/search/meiliClient';
import { normalizeQuery } from '@/lib/search/normalizeQuery';
import { buildMeiliOptions, buildSortParam } from '@/lib/search/buildMeiliOptions';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const searchParams = req.nextUrl.searchParams;
  
  try {
    // Parse query parameters
    const rawQuery = searchParams.get('q') || '';
    const query = normalizeQuery(rawQuery);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 24;
    const sort = searchParams.get('sort') || 'newest';
    
    // Parse filters
    const filters = {
      category: searchParams.get('category') || undefined,
      subcategories: searchParams.getAll('subcategory'),
      brands: searchParams.getAll('brand'),
      colors: searchParams.getAll('color'),
      sizes: searchParams.getAll('size'),
      materials: searchParams.getAll('material'),
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    };
    
    // Query Meilisearch
    const meiliStartTime = Date.now();
    let result: { hits: unknown[]; estimatedTotalHits?: number; facetDistribution?: Record<string, Record<string, number>> };
    
    try {
      const index = getProductsIndex();
      const searchOptions = buildMeiliOptions(filters, page, limit);
      const sortParam = buildSortParam(sort);
      
      if (sortParam) {
        searchOptions.sort = sortParam;
      }
      
      result = await index.search(query, searchOptions);
    } catch (meiliError) {
      console.error('Meilisearch error, falling back to Supabase:', meiliError);
      
      // Fallback to Supabase
      const supabase = await createClient();
      let dbQuery = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`);
      }
      
      if (filters.category) {
        dbQuery = dbQuery.eq('category', filters.category);
      }
      
      if (filters.minPrice) {
        dbQuery = dbQuery.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        dbQuery = dbQuery.lte('price', filters.maxPrice);
      }
      
      const { data, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      result = {
        hits: data || [],
        estimatedTotalHits: data?.length || 0,
        facetDistribution: {},
      };
    }
    
    const meiliTime = Date.now() - meiliStartTime;
    const total = result.estimatedTotalHits || 0;
    
    // Format response
    const payload = {
      hits: result.hits,
      total,
      facets: result.facetDistribution || {},
      page,
      pages: Math.ceil(total / limit),
      query: rawQuery,
    };
    
    const totalTime = Date.now() - startTime;
    
    return NextResponse.json(payload, {
      headers: {
        'X-Cache-Status': 'MISS',
        'Server-Timing': `meili;dur=${meiliTime}, total;dur=${totalTime}`,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
