"use client"

import type React from "react"

import type { Product } from "@/lib/types/database"
import { ImageWithLoading } from "@/components/image-with-loading"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatINR } from "@/lib/utils/currency"

interface ProductCardProps {
  product: Product
  showAIGenerated?: boolean
  generatedImageUrl?: string
}

export function ProductCard({ product, showAIGenerated = false, generatedImageUrl }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Time-limited offer: Set your start and end dates here
  const offerStartDate = new Date('2025-01-22T00:00:00') // Start date
  const offerEndDate = new Date('2025-01-31T23:59:59')   // End date
  const now = new Date()
  const isOfferActive = now >= offerStartDate && now <= offerEndDate
  const discountPercent = 10

  const imageUrl =
    showAIGenerated && generatedImageUrl
      ? generatedImageUrl
      : product.image_url || "/placeholder.svg?height=600&width=450"

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAddingToCart(true)

    startTransition(async () => {
      try {
        const response = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })

        if (response.ok) {
          window.dispatchEvent(new Event("cartUpdated"))
          setTimeout(() => setIsAddingToCart(false), 300)
        } else {
          const data = await response.json()
          if (data.error?.includes("logged in")) {
            router.push(`/auth/login?redirect=/`)
          }
          setIsAddingToCart(false)
        }
      } catch (error) {
        console.error("[v0] Error adding to cart:", error)
        setIsAddingToCart(false)
      }
    })
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Optimistic update
    const newState = !isFavorited
    setIsFavorited(newState)
    
    try {
      if (!newState) {
        await fetch("/api/wishlist/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        })
      } else {
        const response = await fetch("/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        })
        
        if (!response.ok) {
          const data = await response.json()
          if (data.error?.includes("logged in")) {
            setIsFavorited(false)
            router.push(`/auth/login?redirect=/`)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error toggling wishlist:", error)
      setIsFavorited(!newState)
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="group block" prefetch={true}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-4">
        <ImageWithLoading
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock_quantity === 0}
            className="flex-1 bg-white/90 backdrop-blur text-black hover:bg-white rounded-none text-xs font-bold tracking-widest uppercase h-10"
          >
            {product.stock_quantity === 0 ? "Out of Stock" : isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>

        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-500"}`}
          />
        </button>

        {/* Offer Badge - Only show during offer period */}
        {isOfferActive && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
            {discountPercent}% OFF
          </div>
        )}

        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
          <div className="absolute top-12 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            Low Stock
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium uppercase tracking-wider group-hover:text-primary/70 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{product.category}</p>
          {isOfferActive ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wide">
                {formatINR(product.price * (1 - discountPercent / 100))}
              </span>
              <span className="text-xs text-neutral-400 line-through">
                {formatINR(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold tracking-wide">
              {formatINR(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
