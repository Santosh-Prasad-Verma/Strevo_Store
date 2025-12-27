"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Heart, ShoppingCart, X } from "lucide-react"
import type { Product } from "@/lib/types/database"

interface QuickViewProps {
  product: Product
  trigger?: React.ReactNode
}

export function QuickView({ product, trigger }: QuickViewProps) {
  const [open, setOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = ["Black", "White", "Gray"]

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Quick View
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
              <Image
                src={product.image_url || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-3xl font-bold">₹{product.price}</p>
              </div>

              <p className="text-neutral-600">{product.description}</p>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="link"
                onClick={() => {
                  setOpen(false)
                  window.location.href = `/products/${product.id}`
                }}
                className="w-full"
              >
                View Full Details →
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
