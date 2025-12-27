import { NextResponse } from "next/server"
import { getCartCount } from "@/lib/actions/cart"

export async function GET() {
  try {
    const count = await getCartCount()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("[v0] Error in cart count API:", error)
    return NextResponse.json({ count: 0 })
  }
}
