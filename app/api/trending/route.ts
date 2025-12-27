import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis.prod"
import { CacheKeys, CacheTTL } from "@/lib/cache/keyBuilder.prod"
import { setCacheHeaders, CacheHeaders } from "@/lib/cache/headers.prod"

export const revalidate = 900

export async function GET(request: NextRequest) {
  const cacheKey = `${CacheKeys.TRENDING}:products`

  try {
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json({ ...cached, cached: true })
      setCacheHeaders(response.headers, CacheHeaders.TRENDING)
      return response
    }

    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, category, image_url, stock_quantity")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 })
    }

    const result = { products: products || [] }

    await setCache(cacheKey, result, CacheTTL.TRENDING)

    const response = NextResponse.json({ ...result, cached: false })
    setCacheHeaders(response.headers, CacheHeaders.TRENDING)
    return response
  } catch (error) {
    console.error("[TRENDING] Error:", error)
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 })
  }
}
