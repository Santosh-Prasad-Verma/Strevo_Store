"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Heart } from "lucide-react"
import { formatINR } from "@/lib/utils/currency"
import type { CartItem, Product } from "@/lib/types/database"
import { toast } from "sonner"

interface CartItemCardProps {
  item: CartItem & { products: Product }
  isSaved?: boolean
  onRemove?: () => void
  onSaveForLater?: () => void
  onMoveToBag?: () => void
}

export function CartItemCard({ item, isSaved, onRemove, onSaveForLater, onMoveToBag }: CartItemCardProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const product = item.products

  const handleQuantityChange = async (newQty: number) => {
    setQuantity(newQty)
    setIsUpdating(true)
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: item.id, quantity: newQty })
      })
      if (!res.ok) throw new Error()
    } catch {
      toast.error('Failed to update quantity')
      setQuantity(item.quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: item.id })
      })
      if (!res.ok) throw new Error()
      onRemove?.()
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const offerStartDate = new Date('2025-01-22T00:00:00')
  const offerEndDate = new Date('2025-01-31T23:59:59')
  const now = new Date()
  const isOfferActive = now >= offerStartDate && now <= offerEndDate
  const discountPercent = 10
  const discountedPrice = isOfferActive ? product.price * (1 - discountPercent / 100) : product.price

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-32 h-40 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">STREVO</h3>
              <p className="text-sm text-neutral-700 mb-2 line-clamp-2">{product.name}</p>
              
              <div className="flex items-center gap-4 text-xs text-neutral-600 mb-2">
                <span>Size: {item.variant?.size || 'M'}</span>
                <span>Color: {item.variant?.color || 'Black'}</span>
              </div>

              <p className="text-xs text-neutral-500 mb-3">Sold by: Strevo Retail Pvt. Ltd.</p>

              {/* Price */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-bold">{formatINR(discountedPrice)}</span>
                {isOfferActive && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">{formatINR(product.price)}</span>
                    <span className="text-sm text-green-600 font-medium">{discountPercent}% OFF</span>
                  </>
                )}
              </div>

              {isOfferActive && (
                <div className="bg-green-50 border border-green-200 px-2 py-1 rounded text-xs text-green-700 mb-3 inline-block">
                  {discountPercent}% Instant Discount Applied
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col items-end gap-2">
              {!isSaved && (
                <div className="flex items-center border border-neutral-300 rounded">
                  <button 
                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                    disabled={isUpdating}
                    className="px-3 py-1 hover:bg-neutral-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-neutral-300">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isUpdating}
                    className="px-3 py-1 hover:bg-neutral-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-200">
            {isSaved ? (
              <button 
                onClick={() => {
                  onMoveToBag?.()
                  toast.success("Moved to bag")
                }}
                className="flex items-center gap-2 text-sm font-medium hover:text-black transition-colors"
              >
                <Heart className="w-4 h-4" />
                MOVE TO BAG
              </button>
            ) : (
              <button 
                onClick={() => {
                  onSaveForLater?.()
                  toast.success("Saved for later")
                }}
                className="flex items-center gap-2 text-sm font-medium hover:text-black transition-colors"
              >
                <Heart className="w-4 h-4" />
                SAVE FOR LATER
              </button>
            )}
            <button 
              onClick={handleRemove}
              className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
