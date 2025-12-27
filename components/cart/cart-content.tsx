"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CartHeader } from "./cart-header"
import { CartItemCard } from "./cart-item-card"
import { PriceDetails } from "./price-details"
import { EmptyCart } from "./empty-cart"
import type { CartItem, Product } from "@/lib/types/database"
import { toast } from "sonner"

interface CartContentProps {
  initialItems: (CartItem & { products: Product })[]
  initialTotal: number
}

export function CartContent({ initialItems, initialTotal }: CartContentProps) {
  const [cartItems, setCartItems] = useState(initialItems)
  const [savedItems, setSavedItems] = useState<(CartItem & { products: Product })[]>([])
  const router = useRouter()

  const refreshCart = () => {
    router.refresh()
  }

  if (cartItems.length === 0 && savedItems.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <CartHeader itemCount={cartItems.length} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Pincode */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Deliver to:</span>
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  className="border-b border-neutral-300 px-2 py-1 text-sm focus:outline-none focus:border-black w-32"
                  maxLength={6}
                  id="pincode-input"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('pincode-input') as HTMLInputElement
                    if (input.value.length === 6) {
                      toast.success("Delivery available to this pincode")
                    } else {
                      toast.error("Please enter a valid 6-digit pincode")
                    }
                  }}
                  className="text-sm text-black font-medium hover:text-neutral-600"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemCard 
                  key={item.id} 
                  item={item}
                  onRemove={() => {
                    refreshCart()
                  }}
                  onSaveForLater={() => {
                    setSavedItems([...savedItems, item])
                    setCartItems(cartItems.filter(i => i.id !== item.id))
                  }}
                />
              ))}
            </div>

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Saved for Later ({savedItems.length})</h2>
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <CartItemCard 
                      key={item.id} 
                      item={item}
                      isSaved
                      onMoveToBag={() => {
                        setCartItems([...cartItems, item])
                        setSavedItems(savedItems.filter(i => i.id !== item.id))
                      }}
                      onRemove={() => {
                        setSavedItems(savedItems.filter(i => i.id !== item.id))
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price Details */}
          <div className="lg:col-span-1">
            <PriceDetails items={cartItems} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-600">Total Amount</p>
            <p className="text-lg font-bold">₹{(initialTotal * 0.9 + 18).toFixed(0)}</p>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded font-medium hover:bg-neutral-800">
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  )
}
