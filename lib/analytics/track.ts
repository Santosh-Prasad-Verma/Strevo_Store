/**
 * Strevo Analytics Tracking
 * Lightweight event tracking for nav clicks, filters, and conversions
 */

export interface TrackingEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

// In-memory queue for batching events
const eventQueue: TrackingEvent[] = []
let flushTimeout: NodeJS.Timeout | null = null

export function trackEvent(
  eventName: string, 
  properties: Record<string, any> = {}
): void {
  const event: TrackingEvent = {
    event: eventName,
    properties: {
      ...properties,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
    },
    timestamp: Date.now(),
  }

  // Add to queue
  eventQueue.push(event)

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, JSON.stringify(properties))
  }

  // Batch flush after 1 second
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushEvents, 1000)
  }
}

async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return

  const events = [...eventQueue]
  eventQueue.length = 0
  flushTimeout = null

  try {
    // Send to analytics endpoint
    if (typeof window !== 'undefined') {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
        keepalive: true, // Ensure request completes even on page unload
      }).catch(() => {}) // Silently fail
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
  }
}

// Specific tracking functions
export function trackNavClick(
  category: string,
  subcategory?: string,
  source: 'mega-menu' | 'mobile-drawer' | 'nav-link' = 'nav-link'
): void {
  trackEvent('nav_click', {
    category,
    subcategory,
    source,
  })
}

export function trackNavHoverPrefetch(
  category: string,
  subcategory: string | undefined,
  success: boolean,
  responseTime?: number
): void {
  trackEvent('nav_hover_prefetch', {
    category,
    subcategory,
    success,
    responseTime,
  })
}

export function trackFilterApply(
  filterType: string,
  filterValue: string | string[],
  resultCount?: number
): void {
  trackEvent('filter_apply', {
    filterType,
    filterValue,
    resultCount,
  })
}

export function trackFilterClear(previousFilters: Record<string, any>): void {
  trackEvent('filter_clear', {
    previousFilters,
  })
}

export function trackFilterChange(
  filterType: string,
  oldValue: any,
  newValue: any
): void {
  trackEvent('filter_change', {
    filterType,
    oldValue,
    newValue,
  })
}

export function trackProductView(
  productId: string,
  productName: string,
  category: string,
  source: string
): void {
  trackEvent('product_view', {
    productId,
    productName,
    category,
    source,
  })
}

export function trackSearchQuery(
  query: string,
  resultCount: number,
  responseTime: number
): void {
  trackEvent('search_query', {
    query,
    resultCount,
    responseTime,
  })
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (eventQueue.length > 0) {
      // Use sendBeacon for reliable delivery on page unload
      const data = JSON.stringify({ events: eventQueue })
      navigator.sendBeacon('/api/analytics/track', data)
    }
  })
}
