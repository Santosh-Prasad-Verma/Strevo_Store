"use client"

import { useState } from "react"
import { ProductVariant } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductVariantsProps {
  variants: ProductVariant[]
  onVariantSelect: (variant: ProductVariant | null) => void
  selectedVariant?: ProductVariant | null
}

export function ProductVariants({ variants, onVariantSelect, selectedVariant }: ProductVariantsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Get unique sizes and colors
  const sizes = [...new Set(variants.map(v => v.size).filter((s): s is string => Boolean(s)))]
  const colors = [...new Set(variants.map(v => v.color).filter((c): c is string => Boolean(c)))]

  // Find matching variant based on selected size and color
  const findVariant = (size: string | null, color: string | null) => {
    return variants.find(v => v.size === size && v.color === color && v.is_active)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    const variant = findVariant(size, selectedColor)
    onVariantSelect(variant || null)
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    const variant = findVariant(selectedSize, color)
    onVariantSelect(variant || null)
  }

  // Get available colors for selected size
  const availableColors = selectedSize 
    ? colors.filter(color => color && variants.some(v => v.size === selectedSize && v.color === color && v.is_active && v.stock_quantity > 0))
    : colors.filter(color => color && variants.some(v => v.color === color && v.is_active && v.stock_quantity > 0))

  // Get available sizes for selected color
  const availableSizes = selectedColor
    ? sizes.filter(size => size && variants.some(v => v.color === selectedColor && v.size === size && v.is_active && v.stock_quantity > 0))
    : sizes.filter(size => size && variants.some(v => v.size === size && v.is_active && v.stock_quantity > 0))

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = availableSizes.includes(size)
              const isSelected = selectedSize === size
              
              return (
                <Button
                  key={size}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => handleSizeSelect(size)}
                  className={cn(
                    "min-w-[3rem] h-10",
                    !isAvailable && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {size}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isAvailable = availableColors.includes(color)
              const isSelected = selectedColor === color
              const variant = variants.find(v => v.color === color)
              
              return (
                <Button
                  key={color}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "min-w-[4rem] h-10 capitalize",
                    !isAvailable && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {variant?.color_hex && (
                    <div 
                      className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                      style={{ backgroundColor: variant.color_hex }}
                    />
                  )}
                  {color}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Info */}
      {selectedVariant && (
        <div className="text-sm text-gray-600">
          {selectedVariant.stock_quantity > 0 ? (
            <span className="text-green-600">
              {selectedVariant.stock_quantity} in stock
            </span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </div>
      )}
    </div>
  )
}