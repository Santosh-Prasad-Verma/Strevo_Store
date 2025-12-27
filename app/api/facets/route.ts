import { NextRequest, NextResponse } from "next/server"
import { MeiliSearch } from "meilisearch"
import { getCache, setCache } from "@/lib/cache/redis.prod"
import { CacheTTL } from "@/lib/cache/keyBuilder.prod"
import { setCacheHeaders, CacheHeaders } from "@/lib/cache/headers.prod"

let meili: MeiliSearch | null = null

try {
  if (process.env.MEILI_HOST && process.env.MEILI_SEARCH_KEY) {
    meili = new MeiliSearch({
      host: process.env.MEILI_HOST,
      apiKey: process.env.MEILI_SEARCH_KEY,
    })
  }
} catch (error) {
  console.warn('[Facets API] Meilisearch not available')
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const cacheKey = category ? `facets:${category}` : 'facets'

  try {
    if (!meili) {
      return NextResponse.json({ 
        facets: {}, 
        category,
        error: 'Search service unavailable' 
      }, { status: 503 })
    }

    const cached = await getCache<any>(cacheKey)
    if (cached) {
      const response = NextResponse.json({ ...cached, cached: true })
      setCacheHeaders(response.headers, CacheHeaders.FACETS)
      return response
    }

    const filter = category ? [`category = "${category}"`] : undefined

    const facetResults = await meili.index("products").search("", {
      filter,
      facets: ["category", "price"],
      limit: 0,
    })

    const result = {
      facets: facetResults.facetDistribution,
      category,
    }

    await setCache(cacheKey, result, CacheTTL.FACETS)

    const response = NextResponse.json({ ...result, cached: false })
    setCacheHeaders(response.headers, CacheHeaders.FACETS)
    return response
  } catch (error) {
    console.error("[FACETS] Error:", error)
    return NextResponse.json({ error: "Failed to fetch facets" }, { status: 500 })
  }
}
