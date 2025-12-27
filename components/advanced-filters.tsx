"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"

interface FiltersProps {
  onFilterChange: (filters: any) => void
}

export function AdvancedFilters({ onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = ["Black", "White", "Gray", "Blue", "Red", "Green"]
  const categories = ["T-Shirts", "Hoodies", "Pants", "Jackets", "Accessories"]

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      sizes: selectedSizes,
      colors: selectedColors,
      categories: selectedCategories
    })
    setIsOpen(false)
  }

  const clearFilters = () => {
    setPriceRange([0, 10000])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedCategories([])
    onFilterChange({})
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
        {(selectedSizes.length + selectedColors.length + selectedCategories.length) > 0 && (
          <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
            {selectedSizes.length + selectedColors.length + selectedCategories.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:relative md:bg-transparent">
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto md:relative md:w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setIsOpen(false)} className="md:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <Label className="mb-3 block">Price Range</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                step={100}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-neutral-600">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <Label className="mb-3 block">Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`p-2 border rounded text-sm ${
                      selectedSizes.includes(size)
                        ? "border-black bg-black text-white"
                        : "border-neutral-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <Label className="mb-3 block">Color</Label>
              <div className="space-y-2">
                {colors.map(color => (
                  <div key={color} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => toggleColor(color)}
                    />
                    <label className="text-sm">{color}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <Label className="mb-3 block">Category</Label>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label className="text-sm">{category}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
