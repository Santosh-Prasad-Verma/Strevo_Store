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
export async function keyBuilder(prefix: string, obj: any, version?: string): Promise<string> {
  const str = JSON.stringify(obj)
  // Use Web Crypto API for edge runtime compatibility
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 12)
  const v = version || process.env.MEILI_INDEX_VERSION || "1"
  return `${prefix}:${hash}:v${v}`
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
export async function categoryKey(slug: string, filters?: any): Promise<string> {
  if (filters) {
    return await keyBuilder(CacheKeys.CATEGORY, { slug, ...filters })
  }
  return `${CacheKeys.CATEGORY}:${slug}`
}

/**
 * Generate search cache key with query hash
 */
export async function searchKey(query: string, filters?: any): Promise<string> {
  return await keyBuilder(CacheKeys.SEARCH, { query, ...filters })
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
