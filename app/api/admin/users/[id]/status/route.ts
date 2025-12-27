import { NextRequest, NextResponse } from "next/server"
import { toggleUserStatus } from "@/lib/actions/admin/users"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isActive } = await request.json()
    await toggleUserStatus(params.id, isActive)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
