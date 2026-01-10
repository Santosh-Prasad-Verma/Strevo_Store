'use client'

import { useState, useEffect, useRef } from 'react'
import { useFilters } from '@/hooks/useFilters'
import { SidebarFilters } from '@/components/filters/SidebarFilters'
import { MobileFilters, MobileFilterButton } from '@/components/filters/MobileFilters'
import { FilterPills } from '@/components/filters/FilterPills'
import { SortDropdown } from '@/components/filters/SortDropdown'
import { ProductCard } from '@/components/product-card'
import { OptimisticProductGrid, ProductGridSkeleton } from '@/components/products/product-grid-skeleton'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

export default function ProductsPage() {
  const { 
    filters, 
    data: response, 
    isLoading, 
    isValidating,
    setFilters: updateFilters, 
    clearFilters, 
    removeFilter 
  } = useFilters({ revalidateOnFocus: false })
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Local search state to prevent keyboard closing on mobile
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync local search with filters when filters change externally
  useEffect(() => {
    if (filters.search !== localSearch && filters.search !== undefined) {
      setLocalSearch(filters.search)
    }
  }, [filters.search])

  // Debounced search update
  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Set new timer for debounced update
    debounceTimerRef.current = setTimeout(() => {
      updateFilters({ search: value || undefined })
    }, 500)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleClearSearch = () => {
    setLocalSearch('')
    updateFilters({ search: undefined })
    searchInputRef.current?.focus()
  }

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
        {isSidebarOpen && (
          <aside className="hidden lg:block sticky top-0 h-screen">
            {response && (
              <SidebarFilters
                facets={response.facets}
                filters={filters}
                onChange={updateFilters}
                onClose={() => setIsSidebarOpen(false)}
              />
            )}
          </aside>
        )}

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 space-y-4">
            {/* Mobile Search Bar */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      // Immediately apply search on Enter
                      if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current)
                      }
                      updateFilters({ search: localSearch || undefined })
                      searchInputRef.current?.blur()
                    }
                  }}
                  className="w-full px-4 py-3 pl-10 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-base"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                {localSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">Show Filters</span>
              </button>
            )}

            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 
                  id="main-heading" 
                  tabIndex={-1}
                  className="text-2xl lg:text-3xl font-bold uppercase tracking-tight outline-none"
                >
                  {filters.category || filters.subcategory || 'All Products'}
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

          {/* Optimistic Product Grid with prefetch support */}
          <OptimisticProductGrid
            isLoading={isLoading && !response}
            products={response?.products}
            renderProduct={(product, index) => (
              <ProductCard key={product.id} product={product} />
            )}
            skeletonCount={8}
            columns={4}
          />
          
          {/* No products message */}
          {!isLoading && response && response.products.length === 0 && (
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
          
          {/* Loading indicator for background refresh */}
          {isValidating && response && (
            <div className="fixed bottom-24 right-4 bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
              Updating...
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
