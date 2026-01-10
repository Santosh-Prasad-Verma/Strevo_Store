import { NextRequest, NextResponse } from "next/server"
import { MeiliSearch } from "meilisearch"
import { getCache, setCache } from "@/lib/cache/redis.prod"
import { searchKey, CacheTTL } from "@/lib/cache/keyBuilder.prod"
import { setCacheHeaders, CacheHeaders } from "@/lib/cache/headers.prod"

let meili: MeiliSearch | null = null

if (process.env.MEILI_HOST && process.env.MEILI_SEARCH_KEY) {
  try {
    meili = new MeiliSearch({
      host: process.env.MEILI_HOST,
      apiKey: process.env.MEILI_SEARCH_KEY,
    })
  } catch (error) {
    console.warn('[MeiliSearch] Initialization failed:', error)
  }
}

// export const runtime = "edge" // Disabled: use Node.js runtime for MeiliSearch compatibility
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "20", 10)

  const filters: any = { category, minPrice, maxPrice, page, limit }
  const cacheKey = searchKey(query, filters)

  try {
    if (!meili) {
      return NextResponse.json(
        { error: "Search service unavailable", hits: [], total: 0 },
        { status: 503 }
      )
    }

    const { data: cached } = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json({ ...cached, cached: true, cacheKey })
      setCacheHeaders(response.headers, CacheHeaders.SEARCH)
      return response
    }

    const filterArray: string[] = []
    if (category) filterArray.push(`category = "${category}"`)
    if (minPrice) filterArray.push(`price >= ${minPrice}`)
    if (maxPrice) filterArray.push(`price <= ${maxPrice}`)

    const searchResults = await meili.index("products").search(query, {
      filter: filterArray.length > 0 ? filterArray : undefined,
      limit,
      offset: (page - 1) * limit,
      attributesToRetrieve: ["id", "name", "price", "category", "image_url", "stock_quantity"],
      attributesToHighlight: ["name", "description"],
    })

    const result = {
      hits: searchResults.hits,
      total: searchResults.estimatedTotalHits,
      page,
      limit,
      query,
      processingTimeMs: searchResults.processingTimeMs,
    }

    await setCache(cacheKey, result, CacheTTL.SEARCH)

    const response = NextResponse.json({ ...result, cached: false, cacheKey })
    setCacheHeaders(response.headers, CacheHeaders.SEARCH)
    return response
  } catch (error) {
    console.error("[SEARCH] Error:", error)
    return NextResponse.json(
      { error: "Search failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
