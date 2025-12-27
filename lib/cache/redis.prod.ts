// Redis disabled - all cache functions are no-ops

export const redis = null

export async function getCache<T>(_key: string): Promise<T | null> {
  return null
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

export async function getVersion(_key: string): Promise<number> {
  return 1
}
