import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis.prod"
import { CacheKeys, CacheTTL } from "@/lib/cache/keyBuilder.prod"
import { setCacheHeaders, CacheHeaders } from "@/lib/cache/headers.prod"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const cacheKey = `${CacheKeys.INVENTORY}:${id}`

  try {
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json({ ...cached, cached: true })
      setCacheHeaders(response.headers, CacheHeaders.INVENTORY)
      return response
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const result = { stock: data.stock_quantity, productId: id }

    await setCache(cacheKey, result, CacheTTL.INVENTORY)

    const response = NextResponse.json({ ...result, cached: false })
    setCacheHeaders(response.headers, CacheHeaders.INVENTORY)
    return response
  } catch (error) {
    console.error("[INVENTORY] Error:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}
