import { NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/lib/actions/admin/orders"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const status = searchParams.get("status") || undefined
    const search = searchParams.get("search") || undefined

    const result = await getOrders({ page, pageSize, status, search })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
