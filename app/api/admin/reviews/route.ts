import { NextResponse } from "next/server"
import { getPendingReviews } from "@/lib/actions/reviews"

export async function GET() {
  try {
    const reviews = await getPendingReviews()
    return NextResponse.json({ reviews })
  } catch (error) {
    return NextResponse.json({ reviews: [] })
  }
}
