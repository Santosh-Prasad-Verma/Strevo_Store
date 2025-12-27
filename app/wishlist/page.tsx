"use client"

import { useEffect, useState } from "react"
import { Heart, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types/database"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWishlist()
  }, [])

  async function loadWishlist() {
    try {
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function removeItem(productId: string) {
    try {
      const response = await fetch("/api/wishlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">Wishlist</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 aspect-[3/4] w-full mb-4" />
                <div className="h-4 bg-neutral-200 w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mt-2">Save your favorite items here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <Button
                  onClick={() => removeItem(product.id)}
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 z-10 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
