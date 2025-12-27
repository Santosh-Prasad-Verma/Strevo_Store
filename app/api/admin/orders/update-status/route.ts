import { NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/actions/admin"

export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json()

    const result = await updateOrderStatus(orderId, status)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in update order status API:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
