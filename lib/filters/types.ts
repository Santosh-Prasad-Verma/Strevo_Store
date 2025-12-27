/**
 * Strevo Filter System Types
 * Comprehensive type definitions for the navbar-driven filtering flow
 */

export interface ProductFilters {
  category?: string
  subcategory?: string
  subcategories?: string[]
  brands?: string[]
  colors?: string[]
  sizes?: string[]
  materials?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  sort?: SortOption
  page?: number
  limit?: number
  collection?: string
  sale?: boolean
}

export type SortOption = 
  | 'newest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'popular' 
  | 'discount-desc'
  | 'name-asc'
  | 'name-desc'

export interface FilterFacets {
  categories: Record<string, number>
  subcategories: Record<string, number>
  brands: Record<string, number>
  colors: Record<string, number>
  sizes: Record<string, number>
  materials: Record<string, number>
  priceRange: { min: number; max: number }
}

export interface FilterResponse {
  products: any[]
  total: number
  pages: number
  facets: FilterFacets
  appliedFilters: ProductFilters
  cacheStatus?: 'hit' | 'miss' | 'stale'
  timing?: {
    db: number
    cache: number
    total: number
  }
}

export interface NavFilterTarget {
  category?: string
  subcategory?: string
  collection?: string
  sort?: SortOption
  sale?: boolean
  promo?: string
}

export interface PrefetchResult {
  products: any[]
  facets: FilterFacets
  total: number
  timestamp: number
}

export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  timestamp: number
  userId?: string
  sessionId?: string
}

// URL building helpers
export function buildFilterUrl(target: NavFilterTarget): string {
  const params = new URLSearchParams()
  
  if (target.category) params.set('category', target.category)
  if (target.subcategory) params.set('subcategory', target.subcategory)
  if (target.collection) params.set('collection', target.collection)
  if (target.sort) params.set('sort', target.sort)
  if (target.sale) params.set('sale', 'true')
  
  const queryString = params.toString()
  return `/products${queryString ? `?${queryString}` : ''}`
}

export function parseFilterUrl(url: string): ProductFilters {
  const urlObj = new URL(url, 'http://localhost')
  const params = urlObj.searchParams
  
  return {
    category: params.get('category') || undefined,
    subcategory: params.get('subcategory') || undefined,
    subcategories: params.getAll('subcategory'),
    brands: params.getAll('brand'),
    colors: params.getAll('color'),
    sizes: params.getAll('size'),
    materials: params.getAll('material'),
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    inStock: params.get('inStock') === 'true',
    search: params.get('search') || undefined,
    sort: (params.get('sort') as SortOption) || 'newest',
    page: Number(params.get('page')) || 1,
    collection: params.get('collection') || undefined,
    sale: params.get('sale') === 'true',
  }
}

export function normalizeFilters(filters: ProductFilters): ProductFilters {
  return {
    ...filters,
    category: filters.category?.toLowerCase().trim(),
    subcategory: filters.subcategory?.toLowerCase().trim(),
    subcategories: filters.subcategories?.map(s => s.toLowerCase().trim()),
    brands: filters.brands?.map(b => b.toLowerCase().trim()),
    colors: filters.colors?.map(c => c.toLowerCase().trim()),
    sizes: filters.sizes?.map(s => s.toUpperCase().trim()),
    search: filters.search?.trim(),
    page: Math.max(1, filters.page || 1),
    limit: Math.min(100, Math.max(1, filters.limit || 24)),
  }
}

export function createCacheKey(filters: ProductFilters): string {
  const normalized = normalizeFilters(filters)
  const parts = [
    'prod:list',
    normalized.category || 'all',
    normalized.subcategory || '',
    normalized.sort || 'newest',
    `p${normalized.page || 1}`,
  ]
  
  if (normalized.minPrice) parts.push(`min${normalized.minPrice}`)
  if (normalized.maxPrice) parts.push(`max${normalized.maxPrice}`)
  if (normalized.brands?.length) parts.push(`b${normalized.brands.sort().join(',')}`)
  if (normalized.colors?.length) parts.push(`c${normalized.colors.sort().join(',')}`)
  if (normalized.sizes?.length) parts.push(`s${normalized.sizes.sort().join(',')}`)
  if (normalized.search) parts.push(`q${normalized.search.slice(0, 20)}`)
  if (normalized.inStock) parts.push('stock')
  if (normalized.sale) parts.push('sale')
  
  return parts.join(':')
}
