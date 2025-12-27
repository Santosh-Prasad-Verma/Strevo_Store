"use client"

import type { CartItem, Product } from "@/lib/types/database"
import { ImageWithLoading } from "@/components/image-with-loading"
import { Minus, Plus, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatINR } from "@/lib/utils/currency"

interface CartItemProps {
  item: CartItem & { products: Product }
}

export function CartItemComponent({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const router = useRouter()

  const price =
    typeof item.products.price === "number" ? item.products.price : Number.parseFloat(String(item.products.price))

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItemId: item.id,
          quantity: newQuantity,
        }),
      })

      if (response.ok) {
        setQuantity(newQuantity)
        window.dispatchEvent(new Event("cartUpdated"))
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: item.id }),
      })

      if (response.ok) {
        window.dispatchEvent(new Event("cartUpdated"))
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error removing item:", error)
      setIsRemoving(false)
    }
  }

  return (
    <div className={`border-2 border-gray-200 p-4 transition-opacity ${isRemoving ? "opacity-50" : ""}`}>
      <div className="flex gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <ImageWithLoading
            src={item.products.image_url || "/placeholder.svg"}
            alt={item.products.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium tracking-wide">{item.products.name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{item.products.category}</p>
            </div>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 border border-gray-300">
              <button
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={isUpdating || quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={isUpdating || quantity >= item.products.stock_quantity}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <span className="text-lg font-medium">{formatINR(price * quantity)}</span>
          </div>

          {item.products.stock_quantity <= 5 && (
            <p className="text-xs text-orange-600 mt-2 font-mono">Only {item.products.stock_quantity} left in stock</p>
          )}
        </div>
      </div>
    </div>
  )
}
