import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis.prod"
import { categoryKey, CacheTTL } from "@/lib/cache/keyBuilder.prod"
import { setCacheHeaders, CacheHeaders } from "@/lib/cache/headers.prod"

export const revalidate = 300

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "20", 10)

  const filters = { page, limit }
  const cacheKey = await categoryKey(slug, filters)

  try {
    const cached = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json({ ...cached, cached: true })
      setCacheHeaders(response.headers, CacheHeaders.CATEGORY)
      return response
    }

    const supabase = await createClient()
    const { data: products, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("category", slug.toUpperCase())
      .eq("is_active", true)
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
    }

    const result = {
      products: products || [],
      total: count || 0,
      page,
      limit,
      category: slug,
    }

    await setCache(cacheKey, result, CacheTTL.CATEGORY)

    const response = NextResponse.json({ ...result, cached: false })
    setCacheHeaders(response.headers, CacheHeaders.CATEGORY)
    return response
  } catch (error) {
    console.error("[CATEGORY] Error:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}
