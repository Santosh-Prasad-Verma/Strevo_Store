import { NextResponse } from "next/server"
import { getReviews } from "@/lib/actions/reviews"

export async function GET() {
  try {
    const reviews = await getReviews()
    return NextResponse.json({ reviews })
  } catch (error) {
    return NextResponse.json({ reviews: [] })
  }
}
