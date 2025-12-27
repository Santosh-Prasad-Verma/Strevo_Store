// Redis disabled - all cache functions are no-ops

export const redis = null

export async function getCache<T>(_key: string): Promise<{ data: T | null; hit: boolean }> {
  return { data: null, hit: false }
}

export async function setCache(_key: string, _value: unknown, _ttl: number): Promise<void> {
  // No-op
}

export async function delCache(_key: string): Promise<void> {
  // No-op
}

export async function delPattern(_pattern: string): Promise<void> {
  // No-op
}

export async function incrVersion(_key: string): Promise<number> {
  return 1
}

export async function getCacheStats(): Promise<{ hits: number; misses: number; hitRate: number }> {
  return { hits: 0, misses: 0, hitRate: 0 }
}
