"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProductGridSkeletonProps {
  count?: number
  columns?: 2 | 3 | 4
  className?: string
}

export function ProductGridSkeleton({ 
  count = 8, 
  columns = 4,
  className 
}: ProductGridSkeletonProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} index={i} />
      ))}
    </div>
  )
}

function ProductCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="animate-pulse"
    >
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-neutral-200 rounded-lg mb-4" />
      
      {/* Title skeleton */}
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
      
      {/* Price skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-3 bg-neutral-200 rounded w-1/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
      </div>
    </motion.div>
  )
}

interface OptimisticProductGridProps {
  /** Prefetched products to show immediately */
  prefetchedProducts?: any[]
  /** Whether we're loading fresh data */
  isLoading: boolean
  /** Fresh products from server */
  products?: any[]
  /** Render function for product card */
  renderProduct: (product: any, index: number) => React.ReactNode
  /** Number of skeleton items */
  skeletonCount?: number
  /** Grid columns */
  columns?: 2 | 3 | 4
  /** Additional class names */
  className?: string
}

export function OptimisticProductGrid({
  prefetchedProducts,
  isLoading,
  products,
  renderProduct,
  skeletonCount = 8,
  columns = 4,
  className,
}: OptimisticProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  // Show prefetched data immediately while loading fresh data
  const displayProducts = products || prefetchedProducts

  // Show skeleton only if no data at all
  if (!displayProducts && isLoading) {
    return <ProductGridSkeleton count={skeletonCount} columns={columns} className={className} />
  }

  // No products found
  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-neutral-600">No products found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className={cn(`grid ${gridCols[columns]} gap-4`, className)}
    >
      {displayProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.03, 
            duration: 0.2,
            ease: [0.19, 1, 0.22, 1]
          }}
        >
          {renderProduct(product, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}

// CSS for reduced motion
export const reducedMotionStyles = `
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
  
  [data-motion] {
    transition: none !important;
    animation: none !important;
  }
}
`
