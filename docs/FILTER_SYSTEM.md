# Strevo Filter System Documentation

## Design Rationale

The filter system prioritizes **instant-feeling navigation** through prefetch-on-hover, SWR caching, and optimistic UI. URL-driven state ensures SEO-friendliness and shareable links. The system gracefully degrades when Redis is unavailable, falling back to direct Postgres queries.

---

## File Map

```
lib/
├── filters/
│   └── types.ts              # Filter types, URL builders, cache key generation
├── analytics/
│   └── track.ts              # Event tracking for nav clicks, filters
│
hooks/
└── useFilters.ts             # Main filter hook with SWR + URL sync

components/
├── navigation/
│   ├── category-link.tsx     # Prefetch-enabled nav links
│   └── mega-menu.tsx         # Updated with CategoryLink
├── mobile-menu/
│   └── index.tsx             # Updated with CategoryLink
├── products/
│   └── product-grid-skeleton.tsx  # Skeleton + optimistic grid

app/
├── products/
│   └── page.tsx              # Updated with useFilters hook
├── api/
│   ├── products/
│   │   └── filter/route.ts   # Existing filter API
│   └── analytics/
│       └── track/route.ts    # Analytics endpoint

scripts/
└── purge-cache.js            # Redis cache purge utility
```

---

## UX Behavior Spec

### Desktop (Mega-Menu Item)
1. **Hover**: After 150ms delay, prefetch `/api/products/filter?prefetch=1&category=X&subcategory=Y`
2. **Click**: 
   - Track `nav_click` event
   - Store prefetched data in sessionStorage
   - Navigate to `/products?category=X&subcategory=Y`
   - Show prefetched products immediately while SWR revalidates

### Desktop (Direct Nav Click)
- Same as above, but no prefetch (immediate navigation)

### Mobile (Drawer)
1. Tap category → Track event → Close drawer → Navigate to listing
2. Sticky filter bar appears at top of listing

### Promotional Links
- "Sale" links apply `sort=discount-desc` and `sale=true` params

### Back/Forward
- URL state drives filter state via `useFilters` hook
- Browser history preserved with `router.push`

---

## URL Scheme

### Path-based (SEO-friendly)
```
/products?category=men&subcategory=t-shirts
/products?category=women&subcategory=dress&sort=price-asc
/products?sale=true&sort=discount-desc
```

### Query Parameters
| Param | Type | Example |
|-------|------|---------|
| `category` | string | `men`, `women`, `accessories` |
| `subcategory` | string | `t-shirts`, `hoodies` |
| `brand` | string[] | `brand=nike&brand=adidas` |
| `color` | string[] | `color=black&color=white` |
| `size` | string[] | `size=M&size=L` |
| `minPrice` | number | `minPrice=500` |
| `maxPrice` | number | `maxPrice=2000` |
| `sort` | enum | `newest`, `price-asc`, `price-desc`, `popular`, `discount-desc` |
| `page` | number | `page=2` |
| `inStock` | boolean | `inStock=true` |
| `sale` | boolean | `sale=true` |
| `search` | string | `search=cotton` |

---

## Component Usage

### CategoryLink
```tsx
import { CategoryLink } from '@/components/navigation/category-link'

<CategoryLink
  target={{ category: 'men', subcategory: 't-shirts' }}
  source="mega-menu"
  onClick={() => closeMenu()}
  className="text-base hover:text-black"
>
  T-Shirts
</CategoryLink>
```

### useFilters Hook
```tsx
import { useFilters } from '@/hooks/useFilters'

function ProductsPage() {
  const {
    filters,           // Current filter state
    data,              // FilterResponse with products, facets, total
    isLoading,         // Initial load
    isValidating,      // Background refresh
    setFilters,        // Partial update
    clearFilters,      // Reset all
    removeFilter,      // Remove specific filter
  } = useFilters()

  return (
    <OptimisticProductGrid
      isLoading={isLoading}
      products={data?.products}
      renderProduct={(p) => <ProductCard product={p} />}
    />
  )
}
```

---

## Cache Strategy

### Redis Keys (when enabled)
```
prod:list:men:t-shirts:newest:p1     # Category listing
prod:list:all::newest:p1              # All products
prod:version                          # Cache version for invalidation
```

### TTLs
| Type | TTL | Notes |
|------|-----|-------|
| Hot listings | 30-60s | Frequently accessed categories |
| Cold listings | 120s | Less popular filters |
| Prefetch | 30s | Client-side cache |

### Invalidation
```bash
# Purge all product cache
node scripts/purge-cache.js

# Purge specific pattern
node scripts/purge-cache.js --pattern "prod:list:men:*"

# Purge specific key
node scripts/purge-cache.js --key "prod:list:men:t-shirts:newest:p1"
```

---

## Analytics Events

| Event | Properties | Trigger |
|-------|------------|---------|
| `nav_click` | category, subcategory, source | Click on nav item |
| `nav_hover_prefetch` | category, subcategory, success, responseTime | Hover prefetch completes |
| `filter_apply` | filterType, filterValue, resultCount | Filter applied |
| `filter_change` | filterType, oldValue, newValue | Filter value changed |
| `filter_clear` | previousFilters | All filters cleared |

---

## Accessibility

- `aria-current="page"` on active nav items
- Focus moves to `#main-heading` on filter change
- All animations respect `prefers-reduced-motion`
- Keyboard navigation fully supported

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Meaningful Paint | < 1.2s |
| Cached Response | < 150-250ms |
| Uncached Response | < 800ms |
| Prefetch Improvement | 30%+ reduction in FMP |

---

## Rollout Plan

1. Deploy with feature flag `nav-filter-v2`
2. Run smoke tests on staging
3. Enable for 5% traffic
4. Monitor metrics for 24h
5. Gradual rollout to 100%

### Rollback
```bash
# Disable prefetch
PREFETCH_ENABLED=false npm run deploy

# Clear stale cache
node scripts/purge-cache.js
```
