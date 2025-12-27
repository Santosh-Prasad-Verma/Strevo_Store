import { NextRequest, NextResponse } from "next/server"
import { voteReview } from "@/lib/actions/reviews"

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json()
    const result = await voteReview(reviewId)
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to vote" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}
