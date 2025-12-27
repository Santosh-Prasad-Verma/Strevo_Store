# PERFORMANCE & CACHING AUDIT - STREVO STORE

## 1. DIAGNOSIS SUMMARY

**Current State**: Redis infrastructure exists but is DISABLED (redis = null), API routes have basic Cache-Control headers but lack Server-Timing instrumentation, no CDN configuration beyond Next.js defaults, zero observability for cache hit rates. Critical issues: (1) Redis completely non-functional, (2) No Server-Timing headers for debugging, (3) Missing stale-while-revalidate on most endpoints, (4) No cache invalidation webhooks.

## 2. INVENTORY REPORT

### Endpoints Audited:
- `/api/products` - Cache-Control: public, s-maxage=60, stale-while-revalidate=120 ✓
- `/api/search` - Cache-Control: public, s-maxage=30, stale-while-revalidate=60 ✓
- `/api/admin/*` - NO cache headers (needs no-store)
- `/api/auth/*` - NO cache headers (needs private, no-store)
- `/api/cart/*` - NO cache headers (needs private)
- Static assets - Next.js defaults (needs immutable)

### Current Headers Sample:
```
GET /api/products?limit=4
Cache-Control: public, s-maxage=60, stale-while-revalidate=120
X-Cache: MISS (Redis disabled)
Server-Timing: MISSING
```

## 3. CACHE RULES CHECKLIST

| Endpoint Type | Cache-Control | Rationale |
|--------------|---------------|-----------|
| Static assets (/_next/static/*) | public, max-age=31536000, immutable | Hashed filenames, never change |
| Product images (Supabase) | public, max-age=31536000, immutable | Versioned URLs |
| Product list (/api/products) | public, s-maxage=60, stale-while-revalidate=300 | Frequent updates, stale OK |
| Product detail (/api/product/[id]) | public, s-maxage=120, stale-while-revalidate=600 | Less frequent changes |
| Search (/api/search) | public, s-maxage=30, stale-while-revalidate=60 | Real-time feel needed |
| Category pages | public, s-maxage=60, stale-while-revalidate=300 | Similar to product list |
| Cart (/api/cart/*) | private, no-store | User-specific, never cache |
| Auth (/api/auth/*) | private, no-store | Security critical |
| Admin (/api/admin/*) | no-store | Security critical |

## 4. RECOMMENDED TTLs

| Content Type | Redis TTL | CDN s-maxage | stale-while-revalidate |
|-------------|-----------|--------------|------------------------|
| Product list | 60s | 60s | 300s |
| Product detail | 120s | 120s | 600s |
| Search results | 30s | 30s | 60s |
| Category data | 300s | 60s | 300s |
| User cart | N/A | N/A | N/A |
| Static assets | N/A | 31536000s | N/A |
