// Cache key versioning strategy
export const CACHE_VERSION = 'v2'

export const CacheKeys = {
  PRODUCT: `${CACHE_VERSION}:product`,
  SEARCH: `${CACHE_VERSION}:search`,
  CATEGORY: `${CACHE_VERSION}:category`,
  USER: `${CACHE_VERSION}:user`,
  CART: `${CACHE_VERSION}:cart`,
  ORDER: `${CACHE_VERSION}:order`,
  REVIEW: `${CACHE_VERSION}:review`,
  ANALYTICS: `${CACHE_VERSION}:analytics`
} as const

export const CacheTTL = {
  PRODUCT: 60,           // 1 minute
  PRODUCT_DETAIL: 120,   // 2 minutes
  SEARCH: 30,            // 30 seconds
  CATEGORY: 300,         // 5 minutes
  USER_PROFILE: 600,     // 10 minutes
  ANALYTICS: 3600,       // 1 hour
  STATIC: 86400          // 24 hours
} as const

// Build cache key with params
export function buildCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  return `${prefix}:${sortedParams}`
}

// Invalidation patterns
export function getInvalidationPattern(type: keyof typeof CacheKeys): string {
  return `${CacheKeys[type]}:*`
}
