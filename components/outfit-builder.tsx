"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Share2, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
}

const categories = ["Tops", "Bottoms", "Shoes", "Accessories"]

export function OutfitBuilder() {
  const [outfit, setOutfit] = useState<Record<string, Product>>({})
  const [products] = useState<Product[]>([])

  const addToOutfit = (product: Product) => {
    setOutfit(prev => ({ ...prev, [product.category]: product }))
  }

  const removeFromOutfit = (category: string) => {
    setOutfit(prev => {
      const { [category]: _, ...rest } = prev
      return rest
    })
  }

  const total = Object.values(outfit).reduce((sum, p) => sum + p.price, 0)

  const addAllToCart = async () => {
    for (const product of Object.values(outfit)) {
      await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      })
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Outfit</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat} className="border rounded-lg p-4 min-h-[200px]">
              <h3 className="font-semibold mb-2">{cat}</h3>
              {outfit[cat] ? (
                <div className="relative">
                  <Image src={outfit[cat].image_url} alt={outfit[cat].name} width={150} height={150} className="rounded" />
                  <button onClick={() => removeFromOutfit(cat)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-sm mt-2">{outfit[cat].name}</p>
                  <p className="font-bold">₹{outfit[cat].price}</p>
                </div>
              ) : (
                <p className="text-neutral-400 text-sm">Add {cat.toLowerCase()}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xl font-bold">Total: ₹{total}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Share2 className="w-4 h-4" /></Button>
            <Button onClick={addAllToCart} disabled={!Object.keys(outfit).length}><ShoppingCart className="w-4 h-4 mr-2" />Add All</Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="border rounded-lg p-4 cursor-pointer hover:shadow-lg" onClick={() => addToOutfit(p)}>
              <Image src={p.image_url} alt={p.name} width={150} height={150} className="rounded" />
              <p className="text-sm mt-2">{p.name}</p>
              <p className="font-bold">₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
