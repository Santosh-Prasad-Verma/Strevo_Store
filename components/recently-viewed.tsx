"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types/database"

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/recently-viewed")
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
  }, [])

  if (products.length === 0) return null

  return (
    <section className="py-12 px-4 md:px-8 container mx-auto">
      <h2 className="text-2xl font-bold uppercase mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.slice(0, 6).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// Track product view
export function trackProductView(productId: string) {
  fetch("/api/recently-viewed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId })
  }).catch(() => {})
}
