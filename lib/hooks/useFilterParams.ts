'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { ProductFilters } from '@/lib/types/filters'

export function useFilterParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo((): ProductFilters => {
    return {
      category: searchParams.get('category') || undefined,
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
    }
  }, [searchParams])

  const updateFilters = useCallback((updates: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key)
      
      if (value === undefined || value === null || value === '') {
        return
      }
      
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)))
      } else {
        params.set(key, String(value))
      }
    })
    
    params.set('page', '1')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  const removeFilter = useCallback((key: keyof ProductFilters, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && (key === 'subcategories' || key === 'brands' || key === 'colors' || key === 'sizes' || key === 'materials')) {
      const values = params.getAll(key.slice(0, -1))
      params.delete(key.slice(0, -1))
      values.filter(v => v !== value).forEach(v => params.append(key.slice(0, -1), v))
    } else if (key === 'minPrice' || key === 'maxPrice') {
      params.delete('minPrice')
      params.delete('maxPrice')
    } else {
      params.delete(key as string)
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  return {
    filters,
    updateFilters,
    clearFilters,
    removeFilter,
  }
}
