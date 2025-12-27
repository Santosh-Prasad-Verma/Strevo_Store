"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types/database"

interface SimilarProductsCarouselProps {
  products: Product[]
}

export function SimilarProductsCarousel({ products }: SimilarProductsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("similar-products-scroll")
    if (!container) return

    const scrollAmount = 300
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: "smooth" })
    setScrollPosition(newPosition)
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Similar Products</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 border hover:bg-neutral-100 transition-colors disabled:opacity-50"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 border hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        id="similar-products-scroll"
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="flex-shrink-0 w-64 group/item"
          >
            <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-3">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
            <h3 className="font-medium text-sm mb-1 group-hover/item:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <p className="text-lg font-bold mt-1">₹{product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
