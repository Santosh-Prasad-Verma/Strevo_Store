import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/actions/products"
import { getCache, setCache } from "@/lib/cache/redis"
import { CacheKeys, CacheTTL } from "@/lib/cache/keyBuilder"

export const revalidate = 60

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort')
  
  const cacheKey = `${CacheKeys.PRODUCT}:list:${limit || 'all'}:${sort || 'default'}`

  try {
    const cachePromise = getCache<any>(cacheKey)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Cache timeout')), 1000)
    )
    
    try {
      const result = await Promise.race([cachePromise, timeoutPromise]) as any
      if (result.hit && result.data) {
        const cacheDuration = Date.now() - startTime
        const response = NextResponse.json(result.data)
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
        response.headers.set('X-Cache-Status', 'HIT')
        response.headers.set('Server-Timing', `cache;dur=${cacheDuration}, total;dur=${cacheDuration}`)
        return response
      }
    } catch (cacheError) {
      console.log('Cache miss or timeout, fetching from DB')
    }

    const dbStart = Date.now()
    const limitNum = limit ? parseInt(limit) : undefined
    const products = await getProducts(limitNum)
    const dbDuration = Date.now() - dbStart
    
    let result = products
    if (sort === 'popular') {
      // Sort by stock_quantity as a proxy for popularity (lower stock = more popular)
      result = products.sort((a: any, b: any) => a.stock_quantity - b.stock_quantity)
    } else if (sort === 'created_at:desc') {
      result = products.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    
    const data = { data: result }
    
    setCache(cacheKey, data, CacheTTL.PRODUCT).catch(err => 
      console.error('Cache set error:', err)
    )

    const totalDuration = Date.now() - startTime
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.headers.set('X-Cache-Status', 'MISS')
    response.headers.set('Server-Timing', `db;dur=${dbDuration}, total;dur=${totalDuration}`)
    response.headers.set('Surrogate-Key', 'products')
    return response
  } catch (error) {
    console.error("[v0] Error in products API:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
