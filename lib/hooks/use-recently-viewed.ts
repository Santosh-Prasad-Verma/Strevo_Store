import { useEffect } from "react"
import type { Product } from "@/lib/types/database"

export function useRecentlyViewed(product: Product) {
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    const filtered = viewed.filter((p: Product) => p.id !== product.id)
    const updated = [product, ...filtered].slice(0, 10)
    localStorage.setItem("recentlyViewed", JSON.stringify(updated))
  }, [product])
}
