"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ProductRowProps {
  product: Product
}

export function ProductRow({ product }: ProductRowProps) {
  const [isActive, setIsActive] = useState(product.is_active)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleToggleActive = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          updates: { is_active: !isActive },
        }),
      })

      if (response.ok) {
        setIsActive(!isActive)
        router.refresh()
      } else {
        const data = await response.json()
        console.error("Failed to update:", data)
        alert("Failed to update product: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("[v0] Error updating product:", error)
      alert("Error updating product")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 border border-gray-200">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="48px"
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-sm font-medium">{product.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">{product.category}</td>
      <td className="px-6 py-4 text-sm font-medium">{formatCurrency(product.price)}</td>
      <td className="px-6 py-4 text-sm">{product.stock_quantity}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${
            isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4">
        <Button
          onClick={handleToggleActive}
          disabled={isUpdating}
          variant="outline"
          size="sm"
          className="border-black text-black hover:bg-black hover:text-white text-xs font-medium tracking-widest uppercase bg-transparent"
        >
          {isUpdating ? "..." : isActive ? "Deactivate" : "Activate"}
        </Button>
      </td>
    </tr>
  )
}
