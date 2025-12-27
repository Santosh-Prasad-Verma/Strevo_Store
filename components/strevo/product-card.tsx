"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/types/database"
import { ImageWithLoading } from "@/components/image-with-loading"
import { Button } from "@/components/ui/button"
import { formatINR } from "@/lib/utils/currency"
import { productCardHover, productImageHover, heartBounce, buttonTap } from "@/lib/animations/variants"

interface ProductCardProps {
  product: Product
  showAIGenerated?: boolean
  generatedImageUrl?: string
  index?: number
}

export function StrevoProductCard({ 
  product, 
  showAIGenerated = false, 
  generatedImageUrl,
  index = 0 
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Time-limited offer
  const offerStartDate = new Date('2025-01-22T00:00:00')
  const offerEndDate = new Date('2025-01-31T23:59:59')
  const now = new Date()
  const isOfferActive = now >= offerStartDate && now <= offerEndDate
  const discountPercent = 10

  const imageUrl = showAIGenerated && generatedImageUrl
    ? generatedImageUrl
    : product.image_url || "/placeholder.svg?height=600&width=450"

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
        console.error("Error adding to cart:", error)
        setIsAddingToCart(false)
      }
    })
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
      console.error("Error toggling wishlist:", error)
      setIsFavorited(!newState)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.19, 1, 0.22, 1],
        delay: index * 0.04 
      }}
    >
      <Link href={`/products/${product.id}`} className="group block" prefetch={true}>
        <motion.div
          variants={productCardHover}
          initial="rest"
          whileHover="hover"
          className="relative aspect-[3/4] w-full overflow-hidden bg-strevo-surface mb-4"
        >
          {/* Product Image */}
          <motion.div
            variants={productImageHover}
            className="h-full w-full"
          >
            <ImageWithLoading
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-premium">
            <motion.div whileTap={buttonTap}>
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock_quantity === 0}
                className="w-full bg-strevo-highlight/95 backdrop-blur text-strevo-bg hover:bg-strevo-highlight rounded-none text-xs font-bold tracking-widest uppercase h-11 transition-colors duration-micro"
              >
                {product.stock_quantity === 0 
                  ? "Out of Stock" 
                  : isAddingToCart 
                    ? "Adding..." 
                    : "Quick Add"
                }
              </Button>
            </motion.div>
          </div>

          {/* Wishlist Button */}
          <motion.button
            variants={heartBounce}
            initial="rest"
            whileTap="tap"
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full transition-colors duration-micro"
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-micro ${
                isFavorited 
                  ? "fill-strevo-gold text-strevo-gold" 
                  : "text-gray-300 hover:text-strevo-gold"
              }`}
            />
          </motion.button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOfferActive && (
              <span className="bg-strevo-bg text-strevo-highlight text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                {discountPercent}% OFF
              </span>
            )}
            {product.stock_quantity > 0 && product.stock_quantity < 10 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                Low Stock
              </span>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-ui text-sm font-medium uppercase tracking-wider text-strevo-highlight group-hover:text-strevo-muted transition-colors duration-micro">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-strevo-muted font-ui uppercase tracking-widest">
              {product.category}
            </p>
            {isOfferActive ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide text-strevo-highlight">
                  {formatINR(product.price * (1 - discountPercent / 100))}
                </span>
                <span className="text-xs text-strevo-muted line-through">
                  {formatINR(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold tracking-wide text-strevo-highlight">
                {formatINR(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
