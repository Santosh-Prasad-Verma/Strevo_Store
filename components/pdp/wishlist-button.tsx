"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  initialWishlisted?: boolean
}

export function WishlistButton({ productId, initialWishlisted = false }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = async () => {
    setIsAnimating(true)
    setIsWishlisted(!isWishlisted)
    
    setTimeout(() => setIsAnimating(false), 600)

    try {
      if (isWishlisted) {
        await fetch("/api/wishlist/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
      } else {
        await fetch("/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
      }
    } catch (error) {
      setIsWishlisted(isWishlisted)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-3 border rounded-full transition-all hover:scale-110",
        isWishlisted ? "bg-red-50 border-red-500" : "border-neutral-300 hover:border-black"
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-600",
          isAnimating && "animate-ping"
        )}
      />
    </button>
  )
}
