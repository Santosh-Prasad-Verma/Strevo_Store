// Simple in-memory cache for development
// In production, use Redis or Vercel KV

const memoryCache = new Map<string, { data: unknown; expires: number }>()

export const redis = null

export async function getCache<T>(key: string): Promise<{ data: T | null; hit: boolean }> {
  const cached = memoryCache.get(key)
  
  if (cached && cached.expires > Date.now()) {
    return { data: cached.data as T, hit: true }
  }
  
  // Clean up expired entry
  if (cached) {
    memoryCache.delete(key)
  }
  
  return { data: null, hit: false }
}

export async function setCache(key: string, value: unknown, ttl: number): Promise<void> {
  memoryCache.set(key, {
    data: value,
    expires: Date.now() + (ttl * 1000)
  })
}

export async function delCache(key: string): Promise<void> {
  memoryCache.delete(key)
}

export async function delPattern(pattern: string): Promise<void> {
  const regex = new RegExp(pattern.replace('*', '.*'))
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key)
    }
  }
}

export async function incrVersion(_key: string): Promise<number> {
  return 1
}

export async function getCacheStats(): Promise<{ hits: number; misses: number; hitRate: number }> {
  return { hits: 0, misses: 0, hitRate: 0 }
}
