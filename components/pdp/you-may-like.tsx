"use client"

import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types/database"

interface YouMayLikeProps {
  products: Product[]
}

export function YouMayLike({ products }: YouMayLikeProps) {
  if (!products.length) return null

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">You May Also Like</h2>
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="min-w-[45%] md:min-w-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
