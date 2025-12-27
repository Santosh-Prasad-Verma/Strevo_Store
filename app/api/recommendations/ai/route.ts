import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId")
  const supabase = await createClient()

  let query = supabase.from("products").select("*").limit(8)

  if (productId) {
    const { data: product } = await supabase
      .from("products")
      .select("category, price")
      .eq("id", productId)
      .single()

    if (product) {
      query = query
        .eq("category", product.category)
        .gte("price", product.price * 0.7)
        .lte("price", product.price * 1.3)
        .neq("id", productId)
    }
  }

  const { data } = await query
  return NextResponse.json({ products: data || [] })
}
