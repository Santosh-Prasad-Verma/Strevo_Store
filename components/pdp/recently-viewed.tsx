"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types/database"

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    const filtered = viewed.filter((p: Product) => p.id !== currentProductId).slice(0, 4)
    setProducts(filtered)
  }, [currentProductId])

  if (!products.length) return null

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Recently Viewed</h2>
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {products.map((product) => (
          <div key={product.id} className="min-w-[45%] md:min-w-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
