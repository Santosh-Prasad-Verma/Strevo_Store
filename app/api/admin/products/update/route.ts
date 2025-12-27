import { NextResponse } from "next/server"
import { updateProduct } from "@/lib/actions/admin"

export async function POST(request: Request) {
  try {
    const { productId, updates } = await request.json()

    const result = await updateProduct(productId, updates)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in update product API:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
