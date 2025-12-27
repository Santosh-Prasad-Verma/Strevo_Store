'use client'

import { useEffect, useState } from 'react'
import { useFilterParams } from '@/lib/hooks/useFilterParams'
import { SidebarFilters } from '@/components/filters/SidebarFilters'
import { MobileFilters, MobileFilterButton } from '@/components/filters/MobileFilters'
import { FilterPills } from '@/components/filters/FilterPills'
import { SortDropdown } from '@/components/filters/SortDropdown'
import { ProductCard } from '@/components/product-card'
import type { FilterResponse } from '@/lib/types/filters'
import { motion } from 'framer-motion'

export default function FilteredProductsPage() {
  const { filters, updateFilters, clearFilters, removeFilter } = useFilterParams()
  const [response, setResponse] = useState<FilterResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key.slice(0, -1), String(v)))
        } else {
          params.set(key, String(value))
        }
      })

      const res = await fetch(`/api/products/filter?${params.toString()}`)
      const data = await res.json()
      setResponse(data)
      setIsLoading(false)
    }

    fetchProducts()
  }, [filters])

  const activeFilterCount = [
    filters.category,
    ...(filters.subcategories || []),
    ...(filters.brands || []),
    ...(filters.colors || []),
    ...(filters.sizes || []),
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className="hidden lg:block sticky top-0 h-screen">
          {response && (
            <SidebarFilters
              facets={response.facets}
              filters={filters}
              onChange={updateFilters}
            />
          )}
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight">
                  {filters.category || 'All Products'}
                </h1>
                {response && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {response.total} {response.total === 1 ? 'product' : 'products'} found
                  </p>
                )}
              </div>
              
              <SortDropdown
                value={filters.sort || 'newest'}
                onChange={(sort) => updateFilters({ sort })}
              />
            </div>

            <FilterPills
              filters={filters}
              onRemove={removeFilter}
              onClearAll={clearFilters}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : response && response.products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {response.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600">No products found</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {response && response.pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {[...Array(response.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilters({ page: i + 1 })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filters.page === i + 1
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {response && (
        <>
          <MobileFilters
            isOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
            facets={response.facets}
            filters={filters}
            onChange={updateFilters}
            onApply={() => setIsMobileOpen(false)}
            onReset={clearFilters}
          />
          <MobileFilterButton
            onClick={() => setIsMobileOpen(true)}
            count={activeFilterCount}
          />
        </>
      )}
    </div>
  )
}
