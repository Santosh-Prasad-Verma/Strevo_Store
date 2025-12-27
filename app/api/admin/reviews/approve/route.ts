import { NextRequest, NextResponse } from "next/server"
import { approveReview } from "@/lib/actions/reviews"

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json()
    const result = await approveReview(reviewId)
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to approve" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to approve review" }, { status: 500 })
  }
}
