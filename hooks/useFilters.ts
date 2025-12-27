"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import useSWR from "swr"
import { 
  type ProductFilters, 
  type FilterResponse, 
  type PrefetchResult,
  normalizeFilters,
  createCacheKey 
} from "@/lib/filters/types"
import { trackFilterApply, trackFilterClear, trackFilterChange } from "@/lib/analytics/track"
import { getPrefetchedResult } from "@/components/navigation/category-link"

// SWR fetcher with timing
const fetcher = async (url: string): Promise<FilterResponse> => {
  const startTime = performance.now()
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  
  const data = await response.json()
  const timing = performance.now() - startTime
  
  return {
    ...data,
    timing: {
      ...data.timing,
      total: timing,
    },
  }
}

// Build URL from filters
function buildApiUrl(filters: ProductFilters): string {
  const params = new URLSearchParams()
  
  if (filters.category) params.set('category', filters.category)
  
  // Handle subcategories - remove duplicates and use either subcategories array or single subcategory
  const subcats = filters.subcategories?.length 
    ? [...new Set(filters.subcategories)]
    : filters.subcategory 
      ? [filters.subcategory]
      : []
  
  subcats.forEach(s => params.append('subcategory', s))
  
  if (filters.brands?.length) {
    filters.brands.forEach(b => params.append('brand', b))
  }
  if (filters.colors?.length) {
    filters.colors.forEach(c => params.append('color', c))
  }
  if (filters.sizes?.length) {
    filters.sizes.forEach(s => params.append('size', s))
  }
  if (filters.materials?.length) {
    filters.materials.forEach(m => params.append('material', m))
  }
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.inStock) params.set('inStock', 'true')
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.collection) params.set('collection', filters.collection)
  if (filters.sale) params.set('sale', 'true')
  
  return `/api/products/filter?${params.toString()}`
}

// Parse filters from URL search params
function parseFiltersFromUrl(searchParams: URLSearchParams): ProductFilters {
  const subcategories = [...new Set(searchParams.getAll('subcategory'))] // Remove duplicates
  
  return {
    category: searchParams.get('category') || undefined,
    subcategory: subcategories[0] || undefined,
    subcategories: subcategories,
    brands: searchParams.getAll('brand'),
    colors: searchParams.getAll('color'),
    sizes: searchParams.getAll('size'),
    materials: searchParams.getAll('material'),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as ProductFilters['sort']) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    collection: searchParams.get('collection') || undefined,
    sale: searchParams.get('sale') === 'true',
  }
}

// Build URL search params from filters
function buildUrlParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams()
  
  if (filters.category) params.set('category', filters.category)
  if (filters.subcategory) params.set('subcategory', filters.subcategory)
  if (filters.subcategories?.length) {
    filters.subcategories.forEach(s => params.append('subcategory', s))
  }
  if (filters.brands?.length) {
    filters.brands.forEach(b => params.append('brand', b))
  }
  if (filters.colors?.length) {
    filters.colors.forEach(c => params.append('color', c))
  }
  if (filters.sizes?.length) {
    filters.sizes.forEach(s => params.append('size', s))
  }
  if (filters.materials?.length) {
    filters.materials.forEach(m => params.append('material', m))
  }
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.inStock) params.set('inStock', 'true')
  if (filters.search) params.set('search', filters.search)
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  if (filters.collection) params.set('collection', filters.collection)
  if (filters.sale) params.set('sale', 'true')
  
  return params
}

export interface UseFiltersOptions {
  /** Initial filters (from server) */
  initialFilters?: ProductFilters
  /** Initial data (from server/prefetch) */
  initialData?: FilterResponse
  /** Items per page */
  limit?: number
  /** Revalidate on focus */
  revalidateOnFocus?: boolean
}

export interface UseFiltersReturn {
  /** Current filters */
  filters: ProductFilters
  /** Filter response data */
  data: FilterResponse | undefined
  /** Loading state */
  isLoading: boolean
  /** Validating (background refresh) */
  isValidating: boolean
  /** Error state */
  error: Error | undefined
  /** Update filters (partial) */
  setFilters: (updates: Partial<ProductFilters>) => void
  /** Apply filters and navigate */
  applyFilters: (newFilters: ProductFilters) => void
  /** Clear all filters */
  clearFilters: () => void
  /** Remove a specific filter */
  removeFilter: (key: keyof ProductFilters, value?: string) => void
  /** Parse filters from URL */
  fromUrl: () => ProductFilters
  /** Refresh data */
  refresh: () => void
}

export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const {
    initialFilters,
    initialData,
    limit = 24,
    revalidateOnFocus = false,
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousFiltersRef = useRef<ProductFilters | null>(null)

  // Parse filters from URL
  const filters = useMemo((): ProductFilters => {
    const parsed = parseFiltersFromUrl(searchParams)
    return {
      ...parsed,
      limit,
    }
  }, [searchParams, limit])

  // Check for prefetched data on mount
  const [prefetchedData, setPrefetchedData] = useState<FilterResponse | null>(null)
  
  useEffect(() => {
    const prefetched = getPrefetchedResult({
      category: filters.category,
      subcategory: filters.subcategory,
      collection: filters.collection,
      sort: filters.sort,
      sale: filters.sale,
    })
    
    if (prefetched) {
      setPrefetchedData({
        products: prefetched.products,
        facets: prefetched.facets,
        total: prefetched.total,
        pages: Math.ceil(prefetched.total / limit),
        appliedFilters: filters,
        cacheStatus: 'hit',
      })
    }
  }, []) // Only on mount

  // Build API URL
  const apiUrl = useMemo(() => buildApiUrl(filters), [filters])

  // SWR for data fetching with caching
  const { data, error, isLoading, isValidating, mutate } = useSWR<FilterResponse>(
    apiUrl,
    fetcher,
    {
      fallbackData: prefetchedData || initialData,
      revalidateOnFocus,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      keepPreviousData: true,
    }
  )

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: ProductFilters, replace = false) => {
    const params = buildUrlParams(newFilters)
    const url = `${pathname}?${params.toString()}`
    
    if (replace) {
      router.replace(url, { scroll: false })
    } else {
      router.push(url, { scroll: false })
    }
  }, [pathname, router])

  // Set filters (partial update)
  const setFilters = useCallback((updates: Partial<ProductFilters>) => {
    const newFilters = { ...filters, ...updates, page: 1 }
    
    // Track filter changes
    Object.entries(updates).forEach(([key, value]) => {
      const oldValue = filters[key as keyof ProductFilters]
      if (oldValue !== value) {
        trackFilterChange(key, oldValue, value)
      }
    })
    
    updateUrl(newFilters, true)
  }, [filters, updateUrl])

  // Apply filters (full replace)
  const applyFilters = useCallback((newFilters: ProductFilters) => {
    trackFilterApply('all', JSON.stringify(newFilters), data?.total || 0)
    updateUrl(newFilters, false)
  }, [updateUrl, data?.total])

  // Clear all filters
  const clearFilters = useCallback(() => {
    trackFilterClear(filters)
    router.push(pathname, { scroll: false })
  }, [filters, pathname, router])

  // Remove a specific filter
  const removeFilter = useCallback((key: keyof ProductFilters, value?: string) => {
    const newFilters = { ...filters }
    
    if (value && Array.isArray(newFilters[key])) {
      const arr = newFilters[key] as string[]
      newFilters[key] = arr.filter(v => v !== value) as any
      if ((newFilters[key] as string[]).length === 0) {
        delete newFilters[key]
      }
    } else if (key === 'minPrice' || key === 'maxPrice') {
      delete newFilters.minPrice
      delete newFilters.maxPrice
    } else {
      delete newFilters[key]
    }
    
    newFilters.page = 1
    updateUrl(newFilters, true)
  }, [filters, updateUrl])

  // Parse filters from current URL
  const fromUrl = useCallback((): ProductFilters => {
    return parseFiltersFromUrl(searchParams)
  }, [searchParams])

  // Refresh data
  const refresh = useCallback(() => {
    mutate()
  }, [mutate])

  // Focus main heading on filter change for accessibility
  useEffect(() => {
    const currentKey = createCacheKey(filters)
    const previousKey = previousFiltersRef.current 
      ? createCacheKey(previousFiltersRef.current) 
      : null
    
    if (previousKey && currentKey !== previousKey) {
      // Focus main heading for screen readers
      const heading = document.getElementById('main-heading')
      if (heading) {
        heading.focus()
      }
    }
    
    previousFiltersRef.current = filters
  }, [filters])

  return {
    filters,
    data,
    isLoading,
    isValidating,
    error,
    setFilters,
    applyFilters,
    clearFilters,
    removeFilter,
    fromUrl,
    refresh,
  }
}

export default useFilters
