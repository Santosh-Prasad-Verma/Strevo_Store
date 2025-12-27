import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimit(request, 10, 60000)
  if (rateLimitResponse) return rateLimitResponse
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return NextResponse.json({
      isAuthenticated: !!user,
      user: user ? { id: user.id, email: user.email } : null,
    })
  } catch (error) {
    console.error("[v0] Error checking auth:", error)
    return NextResponse.json({ isAuthenticated: false, user: null })
  }
}
