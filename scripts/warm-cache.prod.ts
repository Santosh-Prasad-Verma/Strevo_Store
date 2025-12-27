import { MeiliSearch } from "meilisearch"

// Cache warming script for production
// Requires Redis and Meilisearch to be configured

const TOP_QUERIES = [
  "nike",
  "jordan",
  "shoes",
  "hoodie",
  "pants",
  "cap",
  "running",
  "tech",
  "fleece",
  "accessories",
]

async function warmCache() {
  const redisUrl = process.env.REDIS_URL
  const meiliHost = process.env.MEILI_HOST
  const meiliKey = process.env.MEILI_SEARCH_KEY
  
  if (!redisUrl || !meiliHost) {
    console.log("[CACHE WARMING] Skipped - Redis or Meilisearch not configured")
    return
  }
  
  // Dynamic imports to avoid errors when packages aren't installed
  let redis: any
  let meili: MeiliSearch
  
  try {
    const Redis = (await import("ioredis")).default
    redis = new Redis(redisUrl)
    meili = new MeiliSearch({
      host: meiliHost,
      apiKey: meiliKey,
    })
  } catch {
    console.log("[CACHE WARMING] Skipped - Required packages not installed")
    return
  }

  console.log("[CACHE WARMING] Starting...")

  for (const query of TOP_QUERIES) {
    try {
      const cacheKey = `search:${query}:{}:newest:p1:v3`
      
      const searchResults = await meili.index("products").search(query, {
        limit: 20,
        attributesToRetrieve: ["id", "name", "price", "category", "image_url", "stock_quantity"],
      })

      const result = {
        hits: searchResults.hits,
        total: searchResults.estimatedTotalHits,
        page: 1,
        limit: 20,
        query,
        processingTimeMs: searchResults.processingTimeMs,
      }

      await redis.setex(cacheKey, 300, JSON.stringify(result))
      console.log(`[CACHE WARMING] Cached query: "${query}" (${result.hits.length} results)`)
    } catch (error) {
      console.error(`[CACHE WARMING] Failed for query "${query}":`, error)
    }
  }

  console.log("[CACHE WARMING] Completed")
  await redis.quit()
}

warmCache()
