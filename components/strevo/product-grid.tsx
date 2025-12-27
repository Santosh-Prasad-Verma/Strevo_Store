"use client"

import { motion } from "framer-motion"
import type { Product } from "@/lib/types/database"
import { StrevoProductCard } from "./product-card"
import { staggerContainer } from "@/lib/animations/variants"

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  columns?: 2 | 3 | 4
}

export function StrevoProductGrid({ 
  products, 
  isLoading = false,
  columns = 4 
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4 md:gap-8`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-strevo-muted font-ui text-sm uppercase tracking-widest">
          No products available
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={`grid ${gridCols[columns]} gap-4 md:gap-8`}
    >
      {products.map((product, index) => (
        <StrevoProductCard 
          key={product.id} 
          product={product} 
          index={index}
        />
      ))}
    </motion.div>
  )
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-strevo-surface aspect-[3/4] w-full mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-strevo-surface w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-strevo-surface w-1/4" />
          <div className="h-4 bg-strevo-surface w-1/4" />
        </div>
      </div>
    </div>
  )
}
