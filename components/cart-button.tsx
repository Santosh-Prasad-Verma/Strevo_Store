"use client"

import { ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function CartButton() {
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    loadCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => {
      console.log('Cart updated event received')
      loadCartCount()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    // Also check on focus
    window.addEventListener("focus", loadCartCount)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("focus", loadCartCount)
    }
  }, [])

  const loadCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count")
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.count)
      }
    } catch (error) {
      console.error("[v0] Error loading cart count:", error)
    }
  }

  const handleClick = () => {
    router.push("/cart")
  }

  return (
    <button onClick={handleClick} className="relative cursor-pointer hover:text-gray-500 transition-colors">
      <ShoppingBag className="w-4 h-4 text-black" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </button>
  )
}
