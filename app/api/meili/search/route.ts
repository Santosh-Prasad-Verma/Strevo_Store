import { NextRequest, NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

let meili: MeiliSearch | null = null;

try {
  if (process.env.MEILI_HOST && process.env.MEILI_ADMIN_KEY) {
    meili = new MeiliSearch({
      host: process.env.MEILI_HOST,
      apiKey: process.env.MEILI_ADMIN_KEY
    });
  }
} catch (error) {
  console.warn('[Meili Search API] Meilisearch not available');
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!meili) {
    return NextResponse.json({ 
      error: 'Search service unavailable',
      hits: [],
      totalHits: 0
    }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  
  const q = searchParams.get('q') || '';
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const filters = [];
    if (brand) filters.push(`brand = "${brand}"`);
    if (category) filters.push(`category = "${category}"`);
    if (minPrice) filters.push(`price >= ${minPrice}`);
    if (maxPrice) filters.push(`price <= ${maxPrice}`);
    filters.push('is_active = true');

    const sortOptions = {
      'price_asc': ['price:asc'],
      'price_desc': ['price:desc'],
      'newest': ['created_at:desc'],
      'relevance': []
    };

    const results = await meili.index('products').search(q, {
      filter: filters.length > 0 ? filters : undefined,
      sort: sortOptions[sort as keyof typeof sortOptions] || [],
      limit,
      offset: (page - 1) * limit,
      attributesToHighlight: ['name'],
      attributesToRetrieve: ['id', 'name', 'price', 'image_url', 'brand', 'category'],
      facets: ['brand', 'category']
    });

    const response = NextResponse.json({
      hits: results.hits,
      query: q,
      totalHits: results.estimatedTotalHits,
      totalPages: Math.ceil((results.estimatedTotalHits || 0) / limit),
      page,
      limit,
      processingTimeMs: results.processingTimeMs,
      facets: results.facetDistribution
    });
    
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: 'Search failed',
      hits: [],
      totalHits: 0
    }, { status: 500 });
  }
}
