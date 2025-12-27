"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buildFilterUrl, type NavFilterTarget, type PrefetchResult } from "@/lib/filters/types"
import { trackNavClick, trackNavHoverPrefetch } from "@/lib/analytics/track"

// In-memory prefetch cache
const prefetchCache = new Map<string, PrefetchResult>()
const PREFETCH_CACHE_TTL = 30000 // 30 seconds
const HOVER_DELAY = 150 // ms before triggering prefetch

interface CategoryLinkProps {
  /** Target filter configuration */
  target: NavFilterTarget
  /** Display label */
  children: React.ReactNode
  /** Additional class names */
  className?: string
  /** Source for analytics */
  source?: 'mega-menu' | 'mobile-drawer' | 'nav-link'
  /** Callback when clicked */
  onClick?: () => void
  /** Whether this link is currently active */
  isActive?: boolean
  /** Prefetch on hover (default: true on desktop) */
  prefetchOnHover?: boolean
}

export function CategoryLink({
  target,
  children,
  className,
  source = 'nav-link',
  onClick,
  isActive = false,
  prefetchOnHover = true,
}: CategoryLinkProps) {
  const router = useRouter()
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isPrefetching, setIsPrefetching] = useState(false)

  const url = buildFilterUrl(target)
  const cacheKey = JSON.stringify(target)

  // Prefetch products on hover
  const handlePrefetch = useCallback(async () => {
    // Check cache first
    const cached = prefetchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < PREFETCH_CACHE_TTL) {
      return // Already cached and fresh
    }

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setIsPrefetching(true)

    const startTime = performance.now()

    try {
      const params = new URLSearchParams()
      params.set('prefetch', '1')
      params.set('limit', '12')
      if (target.category) params.set('category', target.category)
      if (target.subcategory) params.set('subcategory', target.subcategory)
      if (target.collection) params.set('collection', target.collection)
      if (target.sort) params.set('sort', target.sort)
      if (target.sale) params.set('sale', 'true')

      const response = await fetch(`/api/products/filter?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          'X-Prefetch': '1',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const result: PrefetchResult = {
          products: data.products,
          facets: data.facets,
          total: data.total,
          timestamp: Date.now(),
        }
        prefetchCache.set(cacheKey, result)

        const responseTime = performance.now() - startTime
        trackNavHoverPrefetch(
          target.category || 'all',
          target.subcategory,
          true,
          responseTime
        )
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        trackNavHoverPrefetch(
          target.category || 'all',
          target.subcategory,
          false
        )
      }
    } finally {
      setIsPrefetching(false)
    }
  }, [cacheKey, target])

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback(() => {
    if (!prefetchOnHover) return

    // Also prefetch the route
    router.prefetch(url)

    // Delay prefetch to avoid spamming on quick mouse movements
    hoverTimeoutRef.current = setTimeout(() => {
      handlePrefetch()
    }, HOVER_DELAY)
  }, [prefetchOnHover, router, url, handlePrefetch])

  // Handle mouse leave - cancel pending prefetch
  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Handle click
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Track analytics
    trackNavClick(
      target.category || 'all',
      target.subcategory,
      source
    )

    // Call custom onClick handler
    onClick?.()

    // Store prefetched data in sessionStorage for instant display
    const cached = prefetchCache.get(cacheKey)
    if (cached) {
      try {
        sessionStorage.setItem('prefetch_result', JSON.stringify(cached))
      } catch {
        // Ignore storage errors
      }
    }
  }, [target, source, onClick, cacheKey])

  return (
    <Link
      href={url}
      className={cn(
        "transition-colors duration-150",
        isActive && "font-semibold",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      prefetch={false} // We handle prefetch manually
    >
      {children}
    </Link>
  )
}

// Export cache utilities for use in product listing
export function getPrefetchedResult(target: NavFilterTarget): PrefetchResult | null {
  const cacheKey = JSON.stringify(target)
  const cached = prefetchCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < PREFETCH_CACHE_TTL) {
    return cached
  }
  
  // Also check sessionStorage
  try {
    const stored = sessionStorage.getItem('prefetch_result')
    if (stored) {
      sessionStorage.removeItem('prefetch_result')
      return JSON.parse(stored)
    }
  } catch {
    // Ignore storage errors
  }
  
  return null
}

export function clearPrefetchCache(): void {
  prefetchCache.clear()
}
