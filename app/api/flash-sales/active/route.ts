import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis"

export const revalidate = 60

export async function GET() {
  const cacheKey = "flash-sales:active"

  try {
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('X-Cache', 'HIT')
      return response
    }
  } catch (e) {}

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("flash_sales")
    .select("*")
    .eq("active", true)
    .gte("end_time", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const result = { sale: error ? null : data }
  
  setCache(cacheKey, result, 60).catch(() => {})

  const response = NextResponse.json(result)
  response.headers.set('X-Cache', 'MISS')
  return response
}
