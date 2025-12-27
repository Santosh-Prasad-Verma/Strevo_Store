import { type NextRequest, NextResponse } from "next/server"
import { addToCart } from "@/lib/actions/cart"
import { createClient } from "@/lib/supabase/server"
import { invalidateCart } from "@/lib/cache/invalidate"

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const result = await addToCart(productId, quantity || 1)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await invalidateCart(user.id)
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("[v0] Error in add to cart API:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
