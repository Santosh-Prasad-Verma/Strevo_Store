import { NextRequest, NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/actions/admin/logs"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "50")
    const entityType = searchParams.get("entityType") || undefined

    const result = await getAuditLogs({ page, pageSize, entityType })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
