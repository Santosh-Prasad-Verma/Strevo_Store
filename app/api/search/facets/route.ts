import { NextRequest, NextResponse } from 'next/server';
import { getProductsIndex } from '@/lib/search/meiliClient';
import { buildMeiliOptions } from '@/lib/search/buildMeiliOptions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  
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
  
  try {
    const index = getProductsIndex();
    const searchOptions = buildMeiliOptions(filters, 1, 1);
    
    const result = await index.search('', searchOptions);
    
    const facets = {
      brands: result.facetDistribution?.brand || {},
      categories: result.facetDistribution?.category || {},
      subcategories: result.facetDistribution?.subcategories || {},
      colors: result.facetDistribution?.colors || {},
      sizes: result.facetDistribution?.sizes || {},
      materials: result.facetDistribution?.materials || {},
      total: result.estimatedTotalHits || 0,
    };
    
    return NextResponse.json(facets, {
      headers: { 'X-Cache-Status': 'MISS' },
    });
  } catch (error) {
    console.error('Facets API error:', error);
    return NextResponse.json({ error: 'Failed to fetch facets' }, { status: 500 });
  }
}
