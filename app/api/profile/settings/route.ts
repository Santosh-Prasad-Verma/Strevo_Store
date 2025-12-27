import { NextResponse } from "next/server"
import { getUserSettings } from "@/lib/actions/profile"

export async function GET() {
  try {
    const settings = await getUserSettings()
    if (!settings) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}
