import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const [usersResult, ordersResult, subscribersResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true })
  ])

  const analytics = {
    totalUsers: usersResult.count || 0,
    pageViews: 0, // Requires analytics tracking implementation
    conversions: ordersResult.count || 0,
    subscribers: subscribersResult.count || 0
  }

  return NextResponse.json(analytics)
}