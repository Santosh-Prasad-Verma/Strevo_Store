import { NextRequest, NextResponse } from "next/server"
import { updateVendorStatus } from "@/lib/actions/admin/vendors"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    await updateVendorStatus(params.id, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vendor status" }, { status: 500 })
  }
}
