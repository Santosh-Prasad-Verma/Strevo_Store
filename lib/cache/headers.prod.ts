/**
 * CDN Cache Control Headers for Production
 */

export interface CacheConfig {
  sMaxage: number // CDN cache duration
  staleWhileRevalidate: number // Serve stale while fetching fresh
  staleIfError?: number // Serve stale on error
}

export const CacheHeaders = {
  SEARCH: {
    sMaxage: 30,
    staleWhileRevalidate: 60,
    staleIfError: 300,
  },
  PRODUCT: {
    sMaxage: 60,
    staleWhileRevalidate: 120,
    staleIfError: 600,
  },
  CATEGORY: {
    sMaxage: 300,
    staleWhileRevalidate: 600,
    staleIfError: 1800,
  },
  FACETS: {
    sMaxage: 600,
    staleWhileRevalidate: 1200,
    staleIfError: 3600,
  },
  TRENDING: {
    sMaxage: 900,
    staleWhileRevalidate: 1800,
    staleIfError: 3600,
  },
  INVENTORY: {
    sMaxage: 10,
    staleWhileRevalidate: 30,
    staleIfError: 60,
  },
} as const

/**
 * Generate Cache-Control header string
 */
export function getCacheHeader(config: CacheConfig): string {
  const parts = [
    "public",
    `s-maxage=${config.sMaxage}`,
    `stale-while-revalidate=${config.staleWhileRevalidate}`,
  ]

  if (config.staleIfError) {
    parts.push(`stale-if-error=${config.staleIfError}`)
  }

  return parts.join(", ")
}

/**
 * Set cache headers on Response
 */
export function setCacheHeaders(headers: Headers, config: CacheConfig): void {
  headers.set("Cache-Control", getCacheHeader(config))
  headers.set("CDN-Cache-Control", getCacheHeader(config))
  headers.set("Vercel-CDN-Cache-Control", getCacheHeader(config))
}

/**
 * No-cache headers for private/dynamic content
 */
export function setNoCacheHeaders(headers: Headers): void {
  headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate")
  headers.set("Pragma", "no-cache")
  headers.set("Expires", "0")
}
