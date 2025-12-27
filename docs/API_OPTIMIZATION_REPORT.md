# API Optimization Report

## ✅ Already Optimized

### 1. `/api/products` - GOOD
- ✅ Redis caching with 60s TTL
- ✅ Cache timeout protection (1s)
- ✅ CDN headers (s-maxage=60, stale-while-revalidate=300)
- ✅ Server-Timing headers for monitoring
- ✅ ISR with revalidate=60

### 2. `/api/product/[id]` - GOOD
- ✅ Redis caching per product
- ✅ CDN headers
- ✅ Parallel image fetch
- ✅ ISR revalidation

### 3. `/api/search` - GOOD
- ✅ Meilisearch primary, Postgres fallback
- ✅ CDN caching (30s)
- ✅ Search analytics (fire-and-forget)

## ⚠️ Needs Optimization

### 1. `/api/cart/route.ts` - CRITICAL
**Issue**: No caching, makes 2 separate DB calls
```typescript
const items = await getCart()      // Query 1
const total = await getCartTotal() // Query 2
```
**Impact**: 2x slower than needed
**Fix**: Combine queries or add Redis caching

### 2. `/api/wishlist/route.ts` - MEDIUM
**Issue**: No caching
**Fix**: Add Redis cache with 5min TTL

### 3. `/api/profile/route.ts` - MEDIUM
**Issue**: No caching for frequently accessed data
**Fix**: Add Redis cache with 2min TTL

### 4. `/api/admin/dashboard/stats` - HIGH
**Issue**: Heavy aggregation queries on every request
**Fix**: Cache for 30s, use materialized view

### 5. `/api/orders/create` - LOW
**Issue**: Sequential operations (order → items → clear cart)
**Fix**: Use transaction, parallel where possible

## 🔧 Recommended Fixes

### Priority 1: Cart API (Most Used)
- Combine getCart + getCartTotal into single query
- Add Redis cache (30s TTL)
- Add CDN headers

### Priority 2: Dashboard Stats
- Cache aggregated stats (30s)
- Consider materialized view for real-time stats

### Priority 3: Profile API
- Cache profile data (2min)
- Invalidate on profile update

### Priority 4: Wishlist
- Add Redis cache (5min)
- Invalidate on add/remove

## 📊 Performance Targets

| Endpoint | Current | Target | Priority |
|----------|---------|--------|----------|
| `/api/cart` | ~200ms | <50ms | HIGH |
| `/api/wishlist` | ~150ms | <50ms | MEDIUM |
| `/api/profile` | ~100ms | <30ms | MEDIUM |
| `/api/admin/dashboard/stats` | ~500ms | <100ms | HIGH |
| `/api/products` | ~50ms | ✅ | - |
| `/api/product/[id]` | ~40ms | ✅ | - |

## 🎯 Quick Wins

1. **Cart API**: Single query + cache = 4x faster
2. **Dashboard Stats**: Cache = 5x faster
3. **Profile**: Cache = 3x faster
4. **Wishlist**: Cache = 3x faster

## 📝 Implementation Order

1. Fix cart API (highest traffic)
2. Cache dashboard stats (admin performance)
3. Cache profile (auth-related)
4. Cache wishlist (user experience)
