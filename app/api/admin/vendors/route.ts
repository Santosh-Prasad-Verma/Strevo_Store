import { NextRequest, NextResponse } from "next/server"
import { getVendors } from "@/lib/actions/admin/vendors"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const status = searchParams.get("status") || undefined

    const result = await getVendors({ page, pageSize, status })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}
