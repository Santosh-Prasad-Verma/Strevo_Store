import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis"

export async function GET() {
  const cacheKey = 'admin:dashboard:stats'
  const cached = await getCache(cacheKey)
  
  if (cached) {
    const response = NextResponse.json(cached)
    response.headers.set('X-Cache-Status', 'HIT')
    return response
  }

  const supabase = await createClient()

  const [orders, profiles, activity] = await Promise.all([
    supabase.from("orders").select("total", { count: "exact" }),
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("user_activity").select("event_type").eq("event_type", "page_view").gte("created_at", new Date(Date.now() - 3600000).toISOString())
  ])

  const revenue = orders.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const orderCount = orders.count || 0
  const customers = profiles.count || 0
  const liveVisitors = Math.floor((activity.data?.length || 0) / 10)
  const conversionRate = orderCount > 0 ? ((orderCount / (customers || 1)) * 100).toFixed(1) : 0

  const stats = {
    revenue,
    orders: orderCount,
    customers,
    conversionRate: parseFloat(conversionRate as string),
    liveVisitors,
    activeCart: Math.floor(liveVisitors * 0.3)
  }
  
  await setCache(cacheKey, stats, 30)
  
  const response = NextResponse.json(stats)
  response.headers.set('X-Cache-Status', 'MISS')
  return response
}
