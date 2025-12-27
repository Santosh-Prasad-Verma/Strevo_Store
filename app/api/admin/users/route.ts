import { NextRequest, NextResponse } from "next/server"
import { getUsers } from "@/lib/actions/admin/users"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const search = searchParams.get("search") || undefined

    const result = await getUsers({ page, pageSize, search })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
