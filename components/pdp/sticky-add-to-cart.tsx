"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyAddToCartProps {
  productName: string
  price: number
  onAddToCart: () => void
}

export function StickyAddToCart({ productName, price, onAddToCart }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transition-transform duration-300 md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{productName}</p>
          <p className="text-lg font-bold">₹{price.toFixed(2)}</p>
        </div>
        <Button onClick={onAddToCart} className="rounded-none flex-shrink-0">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Bag
        </Button>
      </div>
    </div>
  )
}
