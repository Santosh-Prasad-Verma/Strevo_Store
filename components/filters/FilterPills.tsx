'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ProductFilters } from '@/lib/types/filters'

interface FilterPillsProps {
  filters: ProductFilters
  onRemove: (key: keyof ProductFilters, value?: string) => void
  onClearAll: () => void
}

export function FilterPills({ filters, onRemove, onClearAll }: FilterPillsProps) {
  const pills: Array<{ key: keyof ProductFilters; label: string; value?: string }> = []

  if (filters.category) {
    pills.push({ key: 'category', label: filters.category })
  }

  filters.subcategories?.forEach(sub => {
    pills.push({ key: 'subcategories', label: sub, value: sub })
  })

  filters.brands?.forEach(brand => {
    pills.push({ key: 'brands', label: brand, value: brand })
  })

  filters.colors?.forEach(color => {
    pills.push({ key: 'colors', label: color, value: color })
  })

  filters.sizes?.forEach(size => {
    pills.push({ key: 'sizes', label: size, value: size })
  })

  if (filters.minPrice || filters.maxPrice) {
    pills.push({
      key: 'minPrice',
      label: `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '∞'}`,
    })
  }

  if (filters.inStock) {
    pills.push({ key: 'inStock', label: 'In Stock' })
  }

  if (pills.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-600">Applied Filters:</span>
      
      <AnimatePresence mode="popLayout">
        {pills.map((pill, index) => (
          <motion.button
            key={`${pill.key}-${pill.value || pill.label}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            onClick={() => onRemove(pill.key, pill.value)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-sm rounded-full hover:bg-neutral-800 transition-colors"
          >
            <span>{pill.label}</span>
            <X className="w-3 h-3" />
          </motion.button>
        ))}
      </AnimatePresence>

      {pills.length > 1 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={onClearAll}
          className="text-sm text-neutral-600 hover:text-black underline"
        >
          Clear All
        </motion.button>
      )}
    </div>
  )
}
