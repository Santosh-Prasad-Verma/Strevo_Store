import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/actions/products"
import { getCache, setCache } from "@/lib/cache/redis-enhanced"
import { buildCacheKey, CacheKeys, CacheTTL } from "@/lib/cache/cache-keys-v2"

export const revalidate = 60

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort')
  
  const cacheKey = buildCacheKey(CacheKeys.PRODUCT, { 
    list: 'all', 
    limit: limit || 'all', 
    sort: sort || 'default' 
  })

  let cacheStatus = 'MISS'
  let dbDuration = 0
  let cacheDuration = 0

  try {
    // Try cache
    const cacheStart = Date.now()
    const { data: cached, hit } = await getCache<any>(cacheKey)
    cacheDuration = Date.now() - cacheStart
    
    if (hit && cached) {
      cacheStatus = 'HIT'
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
      response.headers.set('X-Cache-Status', cacheStatus)
      response.headers.set('Server-Timing', `cache;dur=${cacheDuration}, total;dur=${Date.now() - startTime}`)
      return response
    }

    // Fetch from DB
    const dbStart = Date.now()
    const products = await getProducts()
    dbDuration = Date.now() - dbStart
    
    let result = products
    if (sort === 'created_at:desc') {
      result = products.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    
    if (limit) {
      result = result.slice(0, parseInt(limit))
    }
    
    const data = { data: result }
    
    // Set cache async
    setCache(cacheKey, data, CacheTTL.PRODUCT).catch(err => 
      console.error('Cache set error:', err)
    )

    const totalDuration = Date.now() - startTime
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.headers.set('X-Cache-Status', cacheStatus)
    response.headers.set('Server-Timing', `db;dur=${dbDuration}, cache;dur=${cacheDuration}, total;dur=${totalDuration}`)
    response.headers.set('Surrogate-Key', 'products')
    return response
  } catch (error) {
    console.error("[API] Error in products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
