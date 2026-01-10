import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ProductFilters, FilterResponse } from '@/lib/types/filters'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const filters: ProductFilters = {
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    subcategories: searchParams.getAll('subcategory'),
    brands: searchParams.getAll('brand'),
    colors: searchParams.getAll('color'),
    sizes: searchParams.getAll('size'),
    materials: searchParams.getAll('material'),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as any) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 24,
    collection: searchParams.get('collection') || undefined,
    sale: searchParams.get('sale') === 'true' ? true : undefined,
  }

  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)

    if (filters.category) {
      query = query.ilike('category', `%${filters.category}%`)
    }

    // Handle subcategory filter - support both single and array
    const subcategoryFilters = filters.subcategories && filters.subcategories.length > 0 
      ? [...new Set(filters.subcategories)] // Remove duplicates
      : filters.subcategory 
        ? [filters.subcategory] 
        : []
    
    if (subcategoryFilters.length > 0) {
      // Sanitize for logs
      const safeSubcategories = subcategoryFilters.map(s => String(s).replace(/[\r\n\t\0\f\v]/g, ' '));
      console.log('Filtering by subcategories:', JSON.stringify(safeSubcategories));

      // Use array overlap directly - more efficient than checking first
      query = query.overlaps('subcategories', subcategoryFilters)
    }

    if (filters.brands && filters.brands.length > 0) {
      query = query.in('brand', filters.brands)
    }

    if (filters.colors && filters.colors.length > 0) {
      query = query.overlaps('colors', filters.colors)
    }

    if (filters.sizes && filters.sizes.length > 0) {
      query = query.overlaps('sizes', filters.sizes)
    }

    if (filters.materials && filters.materials.length > 0) {
      query = query.in('material', filters.materials)
    }

    if (filters.minPrice !== undefined) {
      console.log('[FILTER] Applying minPrice:', Number(filters.minPrice))
      query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      console.log('[FILTER] Applying maxPrice:', Number(filters.maxPrice))
      query = query.lte('price', filters.maxPrice)
    }

    if (filters.inStock) {
      query = query.gt('stock_quantity', 0)
    }

    if (filters.search) {
      const safeSearch = filters.search.replace(/[\r\n\t\0\f\v]/g, ' ');
      const searchWords = safeSearch.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 3);
      console.log('[FILTER] Search query:', safeSearch.substring(0, 50), 'Words:', JSON.stringify(searchWords));
      if (searchWords.length > 0) {
        const conditions = searchWords.map(word => `name.ilike.%${word}%`).join(',');
        query = query.or(conditions);
      }
    }

    switch (filters.sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true })
        break
      case 'price-desc':
        query = query.order('price', { ascending: false })
        break
      case 'popular':
        query = query.order('created_at', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
    }

    const offset = (filters.page! - 1) * filters.limit!
    query = query.range(offset, offset + filters.limit! - 1)

    const { data: products, error, count } = await query

    if (error) {
      console.error('[FILTER] Query error:', error.message?.replace(/[\r\n]/g, ' '))
      throw error
    }
    
    // Sanitize filters for logging
    const safeFilters = JSON.stringify(filters, (key, value) => {
      if (typeof value === 'string') return value.replace(/[\r\n\t\0\f\v]/g, ' ');
      return value;
    }, 2).substring(0, 500);
    console.log(`[FILTER] Found ${count} products for filters:`, safeFilters);
    if (products && products.length > 0) {
      const safeProducts = products.map(p => ({
        name: typeof p.name === 'string' ? p.name.replace(/[\r\n\t\0\f\v]/g, ' ').substring(0, 50) : '',
        price: p.price,
        description: typeof p.description === 'string' ? p.description.replace(/[\r\n\t\0\f\v]/g, ' ').substring(0, 50) : ''
      }));
      console.log('[FILTER] Matched products:', JSON.stringify(safeProducts));
    }

    const facets = await getFacets(supabase, filters)

    const response: FilterResponse = {
      products: products || [],
      total: count || 0,
      pages: Math.ceil((count || 0) / filters.limit!),
      facets,
      appliedFilters: filters,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error: any) {
    console.error('Filter error:', error.message?.replace(/[\r\n]/g, ' '))
    return NextResponse.json({ error: 'Failed to filter products' }, { status: 500 })
  }
}

async function getFacets(supabase: any, filters: ProductFilters) {
  let baseQuery = supabase
    .from('products')
    .select('category, subcategories, brand, colors, sizes, material, price')
    .eq('is_active', true)

  if (filters.category) {
    baseQuery = baseQuery.ilike('category', `%${filters.category}%`)
  }

  const { data } = await baseQuery.limit(500)

  if (!data) {
    return {
      categories: {},
      subcategories: {},
      brands: {},
      colors: {},
      sizes: {},
      materials: {},
      priceRange: { min: 0, max: 5000 },
    }
  }

  const facets: any = {
    categories: {},
    subcategories: {},
    brands: {},
    colors: {},
    sizes: {},
    materials: {},
    priceRange: { min: Infinity, max: 0 },
  }

  data.forEach((product: any) => {
    if (product.category) {
      facets.categories[product.category] = (facets.categories[product.category] || 0) + 1
    }
    if (product.subcategories) {
      product.subcategories.forEach((sub: string) => {
        facets.subcategories[sub] = (facets.subcategories[sub] || 0) + 1
      })
    }
    if (product.brand) {
      facets.brands[product.brand] = (facets.brands[product.brand] || 0) + 1
    }
    if (product.colors) {
      product.colors.forEach((color: string) => {
        facets.colors[color] = (facets.colors[color] || 0) + 1
      })
    }
    if (product.sizes) {
      product.sizes.forEach((size: string) => {
        facets.sizes[size] = (facets.sizes[size] || 0) + 1
      })
    }
    if (product.material) {
      facets.materials[product.material] = (facets.materials[product.material] || 0) + 1
    }
    if (product.price) {
      facets.priceRange.min = Math.min(facets.priceRange.min, product.price)
      facets.priceRange.max = Math.max(facets.priceRange.max, product.price)
    }
  })

  if (facets.priceRange.min === Infinity) facets.priceRange.min = 0

  return facets
}
