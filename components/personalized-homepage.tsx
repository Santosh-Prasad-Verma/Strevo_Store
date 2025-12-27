"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

export function PersonalizedHomepage({ userId }: { userId?: string }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!userId) return
    
    fetch(`/api/personalized?userId=${userId}`)
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
  }, [userId])

  if (!products.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition" />
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-lg font-bold">₹{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
