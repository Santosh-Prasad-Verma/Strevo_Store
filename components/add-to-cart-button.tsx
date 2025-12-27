"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ShoppingBag } from "lucide-react"
import { addToCart } from "@/lib/actions/cart"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  productId: string
  className?: string
}

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      console.log('Adding to cart:', productId)
      const result = await addToCart(productId, 1)
      console.log('Add to cart result:', result)
      
      if (result?.error) {
        console.error('Cart error:', result.error)
        alert(result.error)
      } else {
        console.log('Dispatching cartUpdated event')
        window.dispatchEvent(new Event("cartUpdated"))
        router.refresh()
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} size="lg" className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
