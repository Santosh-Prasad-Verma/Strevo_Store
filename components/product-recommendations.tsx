"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types/database"

interface RecommendationsProps {
  productId?: string
  category?: string
  title?: string
}

export function ProductRecommendations({ productId, category, title = "You May Also Like" }: RecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const url = productId 
      ? `/api/recommendations/${productId}`
      : `/api/products?category=${category}&limit=4`
    
    fetch(url)
      .then(r => r.json())
      .then(data => setProducts(data.products || data.data || []))
  }, [productId, category])

  if (products.length === 0) return null

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold uppercase mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// Frequently Bought Together
export function FrequentlyBoughtTogether({ productId }: { productId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetch(`/api/frequently-bought/${productId}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || [])
        setTotalPrice(data.totalPrice || 0)
      })
  }, [productId])

  if (products.length === 0) return null

  return (
    <div className="bg-neutral-50 p-6 rounded-lg">
      <h3 className="font-bold mb-4">Frequently Bought Together</h3>
      <div className="flex gap-4 items-center mb-4">
        {products.map((product, i) => (
          <div key={product.id} className="flex items-center">
            <div className="w-20 h-20 bg-white rounded border relative">
              <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="object-cover w-full h-full" />
            </div>
            {i < products.length - 1 && <span className="mx-2 text-2xl">+</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Total Price</p>
          <p className="text-2xl font-bold">₹{totalPrice}</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-800">
          Add All to Cart
        </button>
      </div>
    </div>
  )
}
