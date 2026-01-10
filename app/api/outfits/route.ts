import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const rateLimitResponse = rateLimit(req, 10, 60000)
  if (rateLimitResponse) return rateLimitResponse
  
  const { name, productIds, totalPrice } = await req.json()
  
  if (!name || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  
  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return NextResponse.json({ error: "Invalid total price" }, { status: 400 })
  }
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase.from("outfits").insert({
    user_id: user.id,
    name,
    product_ids: productIds,
    total_price: totalPrice
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ outfit: data })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ outfits: data })
}
