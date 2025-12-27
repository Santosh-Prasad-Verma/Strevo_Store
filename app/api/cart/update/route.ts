import { type NextRequest, NextResponse } from "next/server"
import { updateCartItemQuantity } from "@/lib/actions/cart"
import { createClient } from "@/lib/supabase/server"
import { invalidateCart } from "@/lib/cache/invalidate"

export async function POST(request: NextRequest) {
  try {
    const { cartItemId, quantity } = await request.json()

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "Cart item ID and quantity are required" }, { status: 400 })
    }

    const result = await updateCartItemQuantity(cartItemId, quantity)

    if ('error' in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await invalidateCart(user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in update cart API:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
