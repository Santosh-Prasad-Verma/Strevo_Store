"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Product {
  id: string
  name: string
  image_url: string
  size?: string
  color?: string
}

export function ExchangeSystem({ orderId, product }: { orderId: string; product: Product }) {
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = ["Black", "White", "Blue", "Red", "Green"]

  const handleSubmit = async () => {
    await fetch("/api/exchanges", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        productId: product.id,
        newSize,
        newColor
      })
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-bold mb-2">Exchange Request Submitted</h3>
        <p className="text-neutral-600">We'll ship your new item within 2-3 days</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Exchange Item</h3>
      
      <div className="flex gap-4 border rounded-lg p-4">
        <Image src={product.image_url} alt={product.name} width={80} height={80} className="rounded" />
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm text-neutral-600">Current: {product.size} / {product.color}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">New Size</p>
        <div className="flex gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setNewSize(size)}
              className={`border rounded px-4 py-2 ${newSize === size ? "border-black bg-neutral-50" : "border-neutral-200"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">New Color</p>
        <div className="flex gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setNewColor(color)}
              className={`border rounded px-4 py-2 ${newColor === color ? "border-black bg-neutral-50" : "border-neutral-200"}`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!newSize && !newColor} className="w-full">
        Request Exchange
      </Button>
    </div>
  )
}
