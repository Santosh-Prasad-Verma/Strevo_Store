import { NextRequest, NextResponse } from "next/server"
import { submitReview } from "@/lib/actions/reviews"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await submitReview(formData)
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
