import { createClient } from "@supabase/supabase-js"
import Redis from "ioredis"
import { CacheKeys, versionKey } from "../lib/cache/keyBuilder.prod"

const redis = new Redis(process.env.REDIS_URL!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function startRealtimeListener() {
  console.log("[CACHE INVALIDATION] Starting realtime listener...")

  supabase
    .channel("products_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      async (payload) => {
        console.log("[CACHE INVALIDATION] Product change detected:", payload.eventType)

        try {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const productId = payload.new.id
            await redis.del(`${CacheKeys.PRODUCT}:${productId}`)
            await redis.del(`${CacheKeys.INVENTORY}:${productId}`)
            console.log(`[CACHE INVALIDATION] Cleared cache for product: ${productId}`)
          }

          if (payload.eventType === "DELETE") {
            const productId = payload.old.id
            await redis.del(`${CacheKeys.PRODUCT}:${productId}`)
            await redis.del(`${CacheKeys.INVENTORY}:${productId}`)
            console.log(`[CACHE INVALIDATION] Cleared cache for deleted product: ${productId}`)
          }

          await redis.incr(versionKey(CacheKeys.SEARCH))
          await redis.del(`${CacheKeys.TRENDING}:products`)
          
          const keys = await redis.keys(`${CacheKeys.SEARCH}:*`)
          if (keys.length > 0) {
            await redis.del(...keys)
          }

          console.log("[CACHE INVALIDATION] Global search cache invalidated")
        } catch (error) {
          console.error("[CACHE INVALIDATION] Error:", error)
        }
      }
    )
    .subscribe()

  console.log("[CACHE INVALIDATION] Listener active")
}

startRealtimeListener()

process.on("SIGINT", async () => {
  console.log("[CACHE INVALIDATION] Shutting down...")
  await redis.quit()
  process.exit(0)
})
