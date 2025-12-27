import { NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/actions/admin/orders"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    await updateOrderStatus(params.id, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
