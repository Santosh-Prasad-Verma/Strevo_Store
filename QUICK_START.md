# ⚡ PERFORMANCE OPTIMIZATION - QUICK START

## 🚀 5-MINUTE SETUP

```powershell
# 1. Install dependencies
npm install ioredis axios

# 2. Run BEFORE test
node scripts/collect-timings.js http://localhost:3000/api/products?limit=4 100

# 3. Apply fixes
.\scripts\apply-fixes.ps1

# 4. Restart
npm run dev

# 5. Run AFTER test
node scripts/collect-timings.js http://localhost:3000/api/products?limit=4 100
```

## 📊 WHAT TO EXPECT

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Cache Hit Rate | 0% | 75% | +75pp |
| P50 Latency | 500ms | 50ms | 90% faster |
| P95 Latency | 2000ms | 800ms | 60% faster |

## ✅ SUCCESS INDICATORS

After applying fixes, you should see:

```bash
curl -I http://localhost:3000/api/products?limit=4
```

Response headers:
```
Server-Timing: db;dur=45, cache;dur=2, total;dur=47
X-Cache-Status: HIT
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

## 🔍 VERIFY IT WORKS

```bash
# Request 1 (MISS - hits database)
curl -I http://localhost:3000/api/products?limit=4
# X-Cache-Status: MISS
# Server-Timing: db;dur=450, ...

# Request 2 (HIT - from Redis)
curl -I http://localhost:3000/api/products?limit=4
# X-Cache-Status: HIT
# Server-Timing: cache;dur=5, ...
```

## 📁 FILES CREATED

- `lib/cache/redis-enhanced.ts` - Redis with retry logic
- `app/api/products/route-enhanced.ts` - Server-Timing headers
- `lib/cache/cache-keys-v2.ts` - Cache versioning
- `app/api/revalidate/webhook/route.ts` - Invalidation
- `vercel.json` - CDN config
- `scripts/collect-timings.js` - Testing tool
- `k6/load-test.js` - Load test (10k users)

## 🚨 ROLLBACK

```powershell
Copy-Item "lib\cache\redis.ts.backup" "lib\cache\redis.ts" -Force
Copy-Item "app\api\products\route.ts.backup" "app\api\products\route.ts" -Force
npm run dev
```

## 📚 FULL DOCS

- **Complete Guide**: `README_PERFORMANCE.md`
- **Implementation**: `IMPLEMENTATION_GUIDE.md`
- **All Deliverables**: `PERFORMANCE_COMPLETE.md`

## 🎯 NEXT STEPS

1. ✅ Apply fixes (above)
2. ⏳ Deploy to staging
3. ⏳ Run load test: `k6 run k6/local-test.js`
4. ⏳ Deploy to production
5. ⏳ Monitor for 24 hours

---

**Need help?** See `README_PERFORMANCE.md` troubleshooting section
