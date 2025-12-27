import { NextResponse } from "next/server"
import { getHomepageContent } from "@/lib/actions/homepage"

export const revalidate = 60

export async function GET() {
  try {
    const content = await getHomepageContent()
    return NextResponse.json(content || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
