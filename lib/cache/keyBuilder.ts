import crypto from "crypto"

export const CacheKeys = {
  SEARCH: "search",
  PRODUCT: "product",
  CATEGORY: "category",
  FACETS: "facets",
  TRENDING: "trending",
  INVENTORY: "inventory",
  VERSION: "version",
} as const

export const CacheTTL = {
  SEARCH: 30,
  PRODUCT: 60,
  CATEGORY: 300,
  FACETS: 600,
  TRENDING: 900,
  INVENTORY: 10,
} as const

export function keyBuilder(prefix: string, obj: any, version?: string): string {
  const str = JSON.stringify(obj)
  const hash = crypto.createHash("sha256").update(str).digest("hex").substring(0, 16)
  const v = version || process.env.MEILI_INDEX_VERSION || "1"
  return `${prefix}:${hash}:v${v}`
}

export function productKey(id: string): string {
  return `${CacheKeys.PRODUCT}:${id}`
}

export function categoryKey(slug: string, filters?: any): string {
  if (filters) return keyBuilder(CacheKeys.CATEGORY, { slug, ...filters })
  return `${CacheKeys.CATEGORY}:${slug}`
}

export function searchKey(query: string, filters?: any): string {
  return keyBuilder(CacheKeys.SEARCH, { query, ...filters })
}

export function facetsKey(category?: string): string {
  return category ? `${CacheKeys.FACETS}:${category}` : CacheKeys.FACETS
}

export function versionKey(resource: string): string {
  return `${CacheKeys.VERSION}:${resource}`
}
