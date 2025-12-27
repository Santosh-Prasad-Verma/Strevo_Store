import { type NextRequest, NextResponse } from "next/server"
import { removeFromCart } from "@/lib/actions/cart"
import { createClient } from "@/lib/supabase/server"
import { invalidateCart } from "@/lib/cache/invalidate"

export async function POST(request: NextRequest) {
  try {
    const { cartItemId } = await request.json()

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    const result = await removeFromCart(cartItemId)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await invalidateCart(user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in remove from cart API:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
