import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  // Use aggregation to get actual best sellers based on order_items
  const { data } = await supabase
    .from("order_items")
    .select("product_id, product_name, product_image_url, quantity")
    .order("created_at", { ascending: false })
    .limit(100)

  // Aggregate by product_id
  const productSales = new Map<number, { name: string; image: string; count: number }>()
  data?.forEach(item => {
    const existing = productSales.get(item.product_id)
    if (existing) {
      existing.count += item.quantity
    } else {
      productSales.set(item.product_id, {
        name: item.product_name,
        image: item.product_image_url,
        count: item.quantity
      })
    }
  })

  const bestSellers = Array.from(productSales.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([id, data]) => ({ id, ...data }))

  return NextResponse.json({ products: bestSellers })
}
