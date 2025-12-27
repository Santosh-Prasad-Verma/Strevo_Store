# ⚡ Caching Layer - Quick Reference Card

## 🚀 One-Command Setup

```bash
# 1. Start Redis
docker-compose -f docker-compose.redis.prod.yml up -d

# 2. Set environment variables
cp .env.production.example .env.production
# Edit .env.production with your values

# 3. Warm cache
npx tsx scripts/warm-cache.prod.ts

# 4. Start invalidation listener (separate terminal)
npx tsx scripts/cache-invalidation.prod.ts
```

## 📊 Cache TTLs (Quick Reference)

```
Search:    30s  (real-time search results)
Inventory: 10s  (stock levels)
Product:   60s  (product details)
Category:  300s (5 minutes)
Facets:    600s (10 minutes)
Trending:  900s (15 minutes)
```

## 🔑 Cache Key Patterns

```bash
search:{hash}:v{version}    # Search queries
product:{uuid}              # Product by ID
category:{slug}:{hash}:v1   # Category with filters
facets:{category}           # Facet distribution
trending:products           # Trending list
inventory:{uuid}            # Stock quantity
version:{resource}          # Version counter
```

## 🔄 Invalidation Commands

```bash
# Product
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"TOKEN","type":"product","id":"UUID"}'

# Category
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"TOKEN","type":"category","category":"shoes"}'

# All search
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"TOKEN","type":"search"}'

# Global (nuclear option)
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"TOKEN","type":"global"}'
```

## 📡 API Endpoints

```
GET /api/search/prod?q=nike&category=shoes&page=1
GET /api/product/{id}
GET /api/category/{slug}?page=1&limit=20
GET /api/facets?category=shoes
GET /api/trending
GET /api/inventory/{id}
POST /api/revalidate
```

## 🔍 Redis Commands

```bash
# Connect
redis-cli -h host -p 6379 -a password

# Check memory
INFO memory

# Check stats
INFO stats

# List keys
KEYS search:*
KEYS product:*

# Get key value
GET product:11111111-1111-1111-1111-111111111111

# Check TTL
TTL search:abc123:v1

# Delete key
DEL product:11111111-1111-1111-1111-111111111111

# Delete pattern
EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 "search:*"

# Flush all (DANGER!)
FLUSHALL
```

## 📈 Monitoring Commands

```bash
# Cache hit rate
npx tsx scripts/monitor-cache.ts

# Redis stats
redis-cli INFO stats | grep keyspace

# Memory usage
redis-cli INFO memory | grep used_memory_human

# Connection count
redis-cli INFO clients | grep connected_clients
```

## 🧪 Testing Commands

```bash
# Load test
artillery run artillery-load-test.yml

# Cache hit test (run twice, second should be faster)
curl -w "\nTime: %{time_total}s\n" https://your-domain.com/api/search/prod?q=nike

# Check if cached
curl https://your-domain.com/api/search/prod?q=nike | jq '.cached'
```

## 🐛 Troubleshooting

```bash
# Redis not connecting
redis-cli -h host -p 6379 -a password ping
# Should return: PONG

# Check Redis logs
docker logs thrift_redis_prod

# Check Next.js logs
vercel logs --follow

# Clear all cache
redis-cli FLUSHALL

# Restart Redis
docker-compose -f docker-compose.redis.prod.yml restart
```

## 📊 Expected Response Times

```
Cached:     5-20ms   ✅
Uncached:   100-300ms
CDN Hit:    <50ms    ✅✅
```

## 🔒 Security Checklist

- [ ] `REDIS_PASSWORD` set
- [ ] `REVALIDATE_SECRET` set (random 32+ chars)
- [ ] `MEILI_MASTER_KEY` never exposed to frontend
- [ ] Use `MEILI_SEARCH_KEY` in API routes
- [ ] TLS enabled for Redis in production

## 🎯 Performance Targets

```
Cache Hit Rate:  >70%
P95 Latency:     <100ms
Redis Memory:    <2GB
CDN Hit Rate:    >80%
```

## 📁 Key Files

```
lib/cache/redis.prod.ts           # Redis client
lib/cache/keyBuilder.prod.ts      # Key generator
lib/cache/headers.prod.ts         # CDN headers
app/api/search/prod/route.ts      # Search API
app/api/revalidate/route.ts       # Invalidation
scripts/warm-cache.prod.ts        # Cache warming
scripts/cache-invalidation.prod.ts # Realtime listener
```

## 🚨 Emergency Commands

```bash
# Stop all caching (remove Redis URL)
vercel env rm REDIS_URL production

# Rollback deployment
vercel rollback

# Clear all cache
redis-cli FLUSHALL

# Restart services
docker-compose -f docker-compose.redis.prod.yml restart
```

## 📞 Quick Links

- Redis UI: http://localhost:8081 (local)
- Upstash Console: https://console.upstash.com
- Meilisearch Cloud: https://cloud.meilisearch.com
- Vercel Dashboard: https://vercel.com/dashboard

---

**💡 Pro Tip:** Keep this file open in a separate tab for quick reference during deployment and debugging!
