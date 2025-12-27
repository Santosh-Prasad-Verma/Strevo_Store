import { NextResponse } from "next/server"
import { getProfileSummary } from "@/lib/actions/profile"

export async function GET() {
  try {
    const summary = await getProfileSummary()
    if (!summary) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 })
  }
}
