import { type NextRequest, NextResponse } from "next/server"
import { addToWishlist } from "@/lib/actions/wishlist"

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const result = await addToWishlist(productId)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in add to wishlist API:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}
