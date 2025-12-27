// Cache key prefixes
export const CacheKeys = {
  SEARCH: "search",
  PRODUCT: "product",
  CATEGORY: "category",
  FACETS: "facets",
  TRENDING: "trending",
  INVENTORY: "inventory",
  VERSION: "version",
} as const

// Cache TTLs (seconds)
export const CacheTTL = {
  SEARCH: 30,
  PRODUCT: 60,
  CATEGORY: 300,
  FACETS: 600,
  TRENDING: 900,
  INVENTORY: 10,
} as const

/**
 * Generate cache key with version and hash
 * @param prefix - Cache key prefix (e.g., "search", "product")
 * @param obj - Object to hash (query params, filters, etc.)
 * @param version - Optional version override
 */
export function keyBuilder(prefix: string, obj: any, version?: string): string {
  const str = JSON.stringify(obj)
  // Simple hash for edge runtime
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  const hashStr = Math.abs(hash).toString(36).substring(0, 12)
  const v = version || "1"
  return `${prefix}:${hashStr}:v${v}`
}

/**
 * Generate product cache key
 */
export function productKey(id: string): string {
  return `${CacheKeys.PRODUCT}:${id}`
}

/**
 * Generate category cache key
 */
export function categoryKey(slug: string, filters?: any): string {
  if (filters) {
    return keyBuilder(CacheKeys.CATEGORY, { slug, ...filters })
  }
  return `${CacheKeys.CATEGORY}:${slug}`
}

/**
 * Generate search cache key with query hash
 */
export function searchKey(query: string, filters?: any): string {
  return keyBuilder(CacheKeys.SEARCH, { query, ...filters })
}

/**
 * Generate facets cache key
 */
export function facetsKey(category?: string): string {
  return category ? `${CacheKeys.FACETS}:${category}` : CacheKeys.FACETS
}

/**
 * Generate version key for global invalidation
 */
export function versionKey(resource: string): string {
  return `${CacheKeys.VERSION}:${resource}`
}
