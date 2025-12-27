import { NextRequest, NextResponse } from "next/server"
import { rejectReview } from "@/lib/actions/reviews"

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json()
    const result = await rejectReview(reviewId)
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to reject" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject review" }, { status: 500 })
  }
}
