#!/usr/bin/env node
/**
 * Cache Purge Script
 * Clears Redis cache keys for product listings
 * 
 * Usage:
 *   node scripts/purge-cache.js                    # Purge all product cache
 *   node scripts/purge-cache.js --pattern "men:*" # Purge specific pattern
 *   node scripts/purge-cache.js --key "prod:list:men:t-shirts"  # Purge specific key
 */

const Redis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

async function main() {
  const args = process.argv.slice(2)
  
  let pattern = 'prod:list:*'
  let specificKey = null
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pattern' && args[i + 1]) {
      pattern = args[i + 1]
      i++
    } else if (args[i] === '--key' && args[i + 1]) {
      specificKey = args[i + 1]
      i++
    } else if (args[i] === '--help') {
      console.log(`
Cache Purge Script

Usage:
  node scripts/purge-cache.js                    # Purge all product cache
  node scripts/purge-cache.js --pattern "men:*" # Purge specific pattern
  node scripts/purge-cache.js --key "prod:list:men:t-shirts"  # Purge specific key

Options:
  --pattern <pattern>  Redis key pattern to match (default: prod:list:*)
  --key <key>          Specific key to delete
  --help               Show this help message
      `)
      process.exit(0)
    }
  }

  console.log('Connecting to Redis...')
  
  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
  })

  try {
    await redis.ping()
    console.log('Connected to Redis')

    if (specificKey) {
      // Delete specific key
      const result = await redis.del(specificKey)
      console.log(`Deleted key "${specificKey}": ${result ? 'success' : 'not found'}`)
    } else {
      // Delete by pattern
      console.log(`Scanning for keys matching: ${pattern}`)
      
      let cursor = '0'
      let totalDeleted = 0
      
      do {
        const [newCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
        cursor = newCursor
        
        if (keys.length > 0) {
          await redis.del(...keys)
          totalDeleted += keys.length
          console.log(`Deleted ${keys.length} keys (total: ${totalDeleted})`)
        }
      } while (cursor !== '0')
      
      console.log(`\nPurge complete. Total keys deleted: ${totalDeleted}`)
    }

    // Also increment version key to invalidate any stale references
    const versionKey = 'prod:version'
    const newVersion = await redis.incr(versionKey)
    console.log(`Cache version incremented to: ${newVersion}`)

  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    await redis.quit()
  }
}

main()
