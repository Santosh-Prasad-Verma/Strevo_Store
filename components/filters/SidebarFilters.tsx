'use client'

import { X } from 'lucide-react'
import { FilterAccordion } from './FilterAccordion'
import { PriceSlider } from './PriceSlider'
import { ColorSwatch } from './ColorSwatch'
import type { FilterFacets, ProductFilters } from '@/lib/types/filters'

interface SidebarFiltersProps {
  facets: FilterFacets
  filters: ProductFilters
  onChange: (updates: Partial<ProductFilters>) => void
  onClose?: () => void
}

export function SidebarFilters({ facets, filters, onChange, onClose }: SidebarFiltersProps) {
  const toggleArrayFilter = (key: 'subcategories' | 'brands' | 'colors' | 'sizes' | 'materials', value: string) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ [key]: updated })
  }

  return (
    <div className="w-full lg:w-64 bg-white border-r border-neutral-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-wider">Filter & Refine</h2>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-0">
        {/* Subcategories */}
        {Object.keys(facets.subcategories).length > 0 && (
          <FilterAccordion title="Category">
            <div className="space-y-2">
              {Object.entries(facets.subcategories).map(([sub, count]) => (
                <label key={sub} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.subcategories?.includes(sub)}
                    onChange={() => toggleArrayFilter('subcategories', sub)}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm group-hover:text-black transition-colors flex-1">
                    {sub}
                  </span>
                  <span className="text-xs text-neutral-400">({count})</span>
                </label>
              ))}
            </div>
          </FilterAccordion>
        )}

        {/* Brands */}
        {Object.keys(facets.brands).length > 0 && (
          <FilterAccordion title="Brands">
            <div className="space-y-2">
              {Object.entries(facets.brands).map(([brand, count]) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(brand)}
                    onChange={() => toggleArrayFilter('brands', brand)}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="text-sm group-hover:text-black transition-colors flex-1">
                    {brand}
                  </span>
                  <span className="text-xs text-neutral-400">({count})</span>
                </label>
              ))}
            </div>
          </FilterAccordion>
        )}

        {/* Colors */}
        {Object.keys(facets.colors).length > 0 && (
          <FilterAccordion title="Colors">
            <div className="flex flex-wrap gap-3">
              {Object.entries(facets.colors).map(([color, count]) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  selected={filters.colors?.includes(color) || false}
                  onClick={() => toggleArrayFilter('colors', color)}
                  count={count}
                />
              ))}
            </div>
          </FilterAccordion>
        )}

        {/* Sizes */}
        {Object.keys(facets.sizes).length > 0 && (
          <FilterAccordion title="Select Size">
            <div className="flex flex-wrap gap-2">
              {Object.entries(facets.sizes).map(([size, count]) => (
                <button
                  key={size}
                  onClick={() => toggleArrayFilter('sizes', size)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                    filters.sizes?.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-neutral-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterAccordion>
        )}

        {/* Price Range */}
        <FilterAccordion title="Price Range">
          <PriceSlider
            min={facets.priceRange.min}
            max={facets.priceRange.max}
            value={[filters.minPrice || facets.priceRange.min, filters.maxPrice || facets.priceRange.max]}
            onChange={([min, max]) => onChange({ minPrice: min, maxPrice: max })}
          />
        </FilterAccordion>

        {/* In Stock */}
        <FilterAccordion title="Availability">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => onChange({ inStock: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
        </FilterAccordion>
      </div>
    </div>
  )
}
