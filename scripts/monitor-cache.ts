import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

async function monitorCache() {
  console.log("=== Redis Cache Monitoring ===\n")

  try {
    const info = await redis.info("stats")
    const memory = await redis.info("memory")
    
    const stats = {
      keyspace_hits: info.match(/keyspace_hits:(\d+)/)?.[1] || "0",
      keyspace_misses: info.match(/keyspace_misses:(\d+)/)?.[1] || "0",
      used_memory_human: memory.match(/used_memory_human:(.+)/)?.[1] || "0",
      used_memory_peak_human: memory.match(/used_memory_peak_human:(.+)/)?.[1] || "0",
    }

    const hits = parseInt(stats.keyspace_hits)
    const misses = parseInt(stats.keyspace_misses)
    const total = hits + misses
    const hitRate = total > 0 ? ((hits / total) * 100).toFixed(2) : "0"

    console.log(`Cache Hit Rate: ${hitRate}%`)
    console.log(`Total Hits: ${stats.keyspace_hits}`)
    console.log(`Total Misses: ${stats.keyspace_misses}`)
    console.log(`Memory Used: ${stats.used_memory_human}`)
    console.log(`Peak Memory: ${stats.used_memory_peak_human}`)
    
    console.log("\n=== Cache Keys by Prefix ===\n")
    
    const prefixes = ["search", "product", "category", "facets", "trending", "inventory"]
    for (const prefix of prefixes) {
      const keys = await redis.keys(`${prefix}:*`)
      console.log(`${prefix}: ${keys.length} keys`)
    }

  } catch (error) {
    console.error("Error monitoring cache:", error)
  } finally {
    await redis.quit()
  }
}

monitorCache()
