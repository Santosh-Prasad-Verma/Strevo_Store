'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'
import { SidebarFilters } from './SidebarFilters'
import type { FilterFacets, ProductFilters } from '@/lib/types/filters'

interface MobileFiltersProps {
  isOpen: boolean
  onClose: () => void
  facets: FilterFacets
  filters: ProductFilters
  onChange: (updates: Partial<ProductFilters>) => void
  onApply: () => void
  onReset: () => void
}

export function MobileFilters({ isOpen, onClose, facets, filters, onChange, onApply, onReset }: MobileFiltersProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-20 bg-white z-50 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold uppercase tracking-wider">Filter & Refine</h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <SidebarFilters facets={facets} filters={filters} onChange={onChange} />
            </div>

            <div className="p-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => {
                  onReset()
                  onClose()
                }}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  onApply()
                  onClose()
                }}
                className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function MobileFilterButton({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg z-30 flex items-center gap-2"
    >
      <SlidersHorizontal className="w-5 h-5" />
      {count > 0 && (
        <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  )
}
