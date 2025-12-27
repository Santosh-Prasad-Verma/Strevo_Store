# PERFORMANCE OPTIMIZATION IMPLEMENTATION GUIDE

## QUICK START

### 1. Run Baseline Tests
```powershell
# Windows
.\scripts\run-baseline.ps1

# Or manually
node scripts/collect-timings.js http://localhost:3000/api/products?limit=4 100
```

### 2. Apply Fixes
```powershell
.\scripts\apply-fixes.ps1
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Run Post-Fix Tests
```powershell
node scripts/collect-timings.js http://localhost:3000/api/products?limit=4 100
```

## DETAILED FIXES

### Fix 1: Enable Redis (CRITICAL)
**File**: `lib/cache/redis.ts`
**Issue**: Redis client is null, caching disabled
**Fix**: Replace with `lib/cache/redis-enhanced.ts`

### Fix 2: Add Server-Timing Headers
**File**: `app/api/products/route.ts`
**Issue**: No performance instrumentation
**Fix**: Replace with `app/api/products/route-enhanced.ts`

### Fix 3: Cache Key Versioning
**File**: `lib/cache/cache-keys-v2.ts`
**Issue**: No version control for cache invalidation
**Fix**: Use new versioned key system

### Fix 4: CDN Configuration
**File**: `vercel.json`
**Issue**: No CDN-level caching rules
**Fix**: Add Cache-Control headers for static assets, admin, auth

### Fix 5: Invalidation Webhook
**File**: `app/api/revalidate/webhook/route.ts`
**Issue**: No automated cache invalidation
**Fix**: Webhook to purge Redis + Next.js cache

## LOAD TESTING

### Local Test (100 users)
```bash
k6 run k6/local-test.js
```

### Cloud Test (10,000 users)
```bash
# Install k6 cloud
k6 login cloud

# Run test
k6 cloud k6/load-test.js --env BASE_URL=https://your-site.vercel.app
```

**WARNING**: Do NOT run 10k test against production without approval!

## ACCEPTANCE CRITERIA

| Metric | Baseline | Target | Post-Fix |
|--------|----------|--------|----------|
| P95 Latency | TBD | <800ms | TBD |
| P99 Latency | TBD | <2000ms | TBD |
| Cache Hit Rate | 0% | >70% | TBD |
| Error Rate | TBD | <0.5% | TBD |

## ROLLBACK PROCEDURE

```powershell
# Restore backups
Copy-Item "lib\cache\redis.ts.backup" "lib\cache\redis.ts" -Force
Copy-Item "app\api\products\route.ts.backup" "app\api\products\route.ts" -Force

# Restart
npm run dev
```

## MONITORING

### Check Cache Stats
```bash
curl http://localhost:3000/api/admin/cache/stats
```

### Check Server-Timing
```bash
curl -I http://localhost:3000/api/products?limit=4
```

Look for:
- `Server-Timing: db;dur=X, cache;dur=Y, total;dur=Z`
- `X-Cache-Status: HIT` or `MISS`

## PRODUCTION DEPLOYMENT

1. Deploy to staging
2. Run `node scripts/collect-timings.js https://staging-url/api/products 100`
3. Run `k6 run k6/local-test.js --env BASE_URL=https://staging-url`
4. Verify metrics meet acceptance criteria
5. Deploy to production
6. Monitor for 24 hours

## CACHE INVALIDATION

### Manual Invalidation
```bash
curl -X POST http://localhost:3000/api/revalidate/webhook \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type":"product"}'
```

### Supabase Webhook (Product Updates)
Configure in Supabase Dashboard:
- URL: `https://your-site.vercel.app/api/revalidate/webhook`
- Secret: `Bearer YOUR_REVALIDATE_SECRET`
- Events: `INSERT`, `UPDATE`, `DELETE` on `products` table
- Payload: `{"type":"product","id":"{{record.id}}"}`

## SCALING RECOMMENDATIONS

### Vercel
- Pro plan minimum for production
- Enable Edge Network
- Monitor function execution time (<10s limit)

### Supabase
- Enable connection pooling (pgBouncer)
- Monitor active connections (<60 for free tier)
- Upgrade to Pro if >100k requests/day

### Redis
- Upstash Redis recommended (serverless)
- Monitor memory usage
- Set maxmemory-policy: allkeys-lru

### Meilisearch
- Cloud hosting recommended for production
- Monitor index size and search latency
- Target <50ms search response time
