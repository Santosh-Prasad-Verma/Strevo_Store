# 🚀 Production E-Commerce Caching Layer - Complete Guide

## 📊 Architecture Overview

```
Client → CDN Edge → Next.js API → Redis → Meilisearch/Supabase
         (30-900s)   (ISR)        (10-900s)
```

## 🎯 Caching Strategy

| Resource | Redis TTL | CDN Cache | Revalidate |
|----------|-----------|-----------|------------|
| Search | 30s | 30s + 60s SWR | - |
| Products | 60s | 60s + 120s SWR | 60s ISR |
| Categories | 300s | 300s + 600s SWR | 300s ISR |
| Facets | 600s | 600s + 1200s SWR | 600s ISR |
| Trending | 900s | 900s + 1800s SWR | 900s ISR |
| Inventory | 10s | 10s + 30s SWR | - |

## 🔧 Setup Instructions

### 1. Environment Variables

```bash
# Production Redis (Upstash/AWS ElastiCache/Redis Cloud)
REDIS_URL=redis://:password@host:6379
REDIS_PASSWORD=your_password

# Meilisearch
MEILI_HOST=https://your-meili.com
MEILI_SEARCH_KEY=your_search_key
MEILI_INDEX_VERSION=1

# Revalidation
REVALIDATE_SECRET=your_secret_token
```

### 2. Start Redis (Docker)

```bash
docker-compose -f docker-compose.redis.prod.yml up -d
```

### 3. Run Cache Warming

```bash
npx tsx scripts/warm-cache.prod.ts
```

### 4. Start Realtime Invalidation

```bash
npx tsx scripts/cache-invalidation.prod.ts
```

## 📡 API Endpoints

### Search API
```
GET /api/search/prod?q=nike&category=shoes&page=1
```

**Caching:**
- Redis: 30s
- CDN: s-maxage=30, stale-while-revalidate=60

### Product API
```
GET /api/product/[id]
```

**Caching:**
- Redis: 60s
- CDN: s-maxage=60, stale-while-revalidate=120
- ISR: revalidate=60

### Category API
```
GET /api/category/[slug]?page=1&limit=20
```

**Caching:**
- Redis: 300s
- CDN: s-maxage=300, stale-while-revalidate=600
- ISR: revalidate=300

### Facets API
```
GET /api/facets?category=shoes
```

**Caching:**
- Redis: 600s
- CDN: s-maxage=600, stale-while-revalidate=1200
- ISR: revalidate=600

### Trending API
```
GET /api/trending
```

**Caching:**
- Redis: 900s
- CDN: s-maxage=900, stale-while-revalidate=1800
- ISR: revalidate=900

### Inventory API
```
GET /api/inventory/[id]
```

**Caching:**
- Redis: 10s (short TTL for real-time stock)
- CDN: s-maxage=10, stale-while-revalidate=30

## 🔄 Cache Invalidation

### Manual Revalidation

```bash
# Invalidate specific product
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"product","id":"product-uuid"}'

# Invalidate category
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"category","category":"shoes"}'

# Invalidate all search
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"search"}'

# Global invalidation
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"global"}'
```

### Automatic Invalidation (Realtime)

The `cache-invalidation.prod.ts` script listens to Supabase realtime changes:

- **Product INSERT/UPDATE** → Clears product + inventory cache
- **Product DELETE** → Clears product cache
- **Any change** → Increments search version, clears trending

## 🔑 Cache Key Structure

```
search:{hash}:v{version}
product:{id}
category:{slug}:{hash}:v{version}
facets:{category}
trending:products
inventory:{id}
version:search
version:global
```

## 📈 Monitoring Metrics

### Redis Metrics
```bash
# Connect to Redis
redis-cli -h host -p 6379 -a password

# Check memory usage
INFO memory

# Check hit rate
INFO stats

# List all keys
KEYS *

# Get key TTL
TTL search:abc123:v1
```

### Cache Hit Rate
```typescript
// In your API routes, track:
const cached = await getCache(key)
if (cached) {
  // Log cache hit
  console.log('[CACHE HIT]', key)
} else {
  // Log cache miss
  console.log('[CACHE MISS]', key)
}
```

## 🔒 Security Considerations

1. **Never expose master keys to frontend**
   - Use `MEILI_SEARCH_KEY` (read-only) in API routes
   - Keep `MEILI_MASTER_KEY` server-side only

2. **Protect revalidation endpoint**
   - Require `REVALIDATE_SECRET` token
   - Validate request origin

3. **Redis authentication**
   - Always use password in production
   - Use TLS for Redis connections

4. **Rate limiting**
   - Implement rate limiting on API routes
   - Use Vercel Edge Config or Upstash Rate Limit

## 📊 Scaling Plan

### Redis Cluster (High Availability)
```yaml
# docker-compose.redis.cluster.yml
services:
  redis-master:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
  
  redis-replica-1:
    image: redis:7-alpine
    command: redis-server --replicaof redis-master 6379 --requirepass ${REDIS_PASSWORD}
  
  redis-replica-2:
    image: redis:7-alpine
    command: redis-server --replicaof redis-master 6379 --requirepass ${REDIS_PASSWORD}
```

### Meilisearch Replicas
- Use Meilisearch Cloud with multi-region deployment
- Or deploy multiple Meilisearch instances behind load balancer

### CDN Configuration
- **Vercel**: Automatic edge caching with `Cache-Control` headers
- **Cloudflare**: Configure cache rules in dashboard
- **AWS CloudFront**: Set cache behaviors for `/api/*` routes

## 🧪 Testing Plan

### Load Test (Artillery)
```yaml
# artillery-load-test.yml
config:
  target: "https://your-domain.com"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Search queries"
    flow:
      - get:
          url: "/api/search/prod?q=nike"
      - get:
          url: "/api/search/prod?q=jordan"
```

Run: `artillery run artillery-load-test.yml`

### Cache Hit Test
```bash
# First request (cache miss)
curl -w "\nTime: %{time_total}s\n" https://your-domain.com/api/search/prod?q=nike

# Second request (cache hit - should be faster)
curl -w "\nTime: %{time_total}s\n" https://your-domain.com/api/search/prod?q=nike
```

## 📁 File Structure

```
Thrift_ind/
├── lib/
│   └── cache/
│       ├── redis.prod.ts          # Redis client
│       ├── keyBuilder.prod.ts     # Cache key generator
│       └── headers.prod.ts        # CDN headers
├── app/
│   └── api/
│       ├── search/prod/route.ts   # Search with caching
│       ├── product/[id]/route.ts  # Product with ISR
│       ├── category/[slug]/route.ts
│       ├── facets/route.ts
│       ├── trending/route.ts
│       ├── inventory/[id]/route.ts
│       └── revalidate/route.ts    # Cache invalidation
├── scripts/
│   ├── warm-cache.prod.ts         # Pre-populate cache
│   └── cache-invalidation.prod.ts # Realtime listener
├── docker-compose.redis.prod.yml
└── .env.production.example
```

## 🚀 Deployment Checklist

- [ ] Set all environment variables in Vercel/hosting platform
- [ ] Deploy Redis (Upstash/AWS ElastiCache/Redis Cloud)
- [ ] Deploy Meilisearch (Meilisearch Cloud or self-hosted)
- [ ] Configure CDN cache rules
- [ ] Run cache warming script
- [ ] Start realtime invalidation listener (as background service)
- [ ] Set up monitoring (Datadog/Sentry/CloudWatch)
- [ ] Test cache hit rates
- [ ] Load test with Artillery
- [ ] Configure alerts for Redis memory/CPU

## 📞 Support

For issues or questions:
1. Check Redis connection: `redis-cli ping`
2. Check Meilisearch: `curl https://your-meili.com/health`
3. Monitor cache hit rate in Redis Commander
4. Review Next.js logs for cache errors
