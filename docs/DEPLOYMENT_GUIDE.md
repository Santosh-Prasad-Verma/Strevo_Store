# 🚀 Production Deployment Guide - Caching Layer

## Prerequisites

- [ ] Vercel account (or other Next.js hosting)
- [ ] Redis instance (Upstash/AWS ElastiCache/Redis Cloud)
- [ ] Meilisearch Cloud account or self-hosted instance
- [ ] Supabase project with realtime enabled
- [ ] Domain with SSL certificate

## Step 1: Redis Setup

### Option A: Upstash (Recommended for Vercel)

1. Go to https://upstash.com
2. Create new Redis database
3. Select region closest to your Next.js deployment
4. Copy `REDIS_URL` from dashboard
5. Enable TLS

### Option B: AWS ElastiCache

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id thrift-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --engine-version 7.0
```

### Option C: Docker (Self-hosted)

```bash
docker-compose -f docker-compose.redis.prod.yml up -d
```

## Step 2: Meilisearch Setup

### Option A: Meilisearch Cloud (Recommended)

1. Go to https://cloud.meilisearch.com
2. Create new project
3. Copy `MEILI_HOST` and `MEILI_SEARCH_KEY`
4. Create index: `products`

### Option B: Self-hosted

```bash
# Docker
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY=your_master_key \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:latest
```

## Step 3: Environment Variables

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add REDIS_URL production
vercel env add MEILI_HOST production
vercel env add MEILI_SEARCH_KEY production
vercel env add MEILI_INDEX_VERSION production
vercel env add REVALIDATE_SECRET production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

### .env.production

```bash
REDIS_URL=redis://:password@host:6379
MEILI_HOST=https://your-meili.com
MEILI_SEARCH_KEY=your_search_key
MEILI_INDEX_VERSION=1
REVALIDATE_SECRET=your_secret_token
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Step 4: Deploy to Vercel

```bash
# Build and deploy
vercel --prod

# Or via GitHub integration (automatic)
git push origin main
```

## Step 5: Initialize Cache

### Warm Cache

```bash
# Run locally pointing to production Redis
REDIS_URL=your_prod_redis npm run cache:warm
```

### Start Realtime Invalidation

Deploy as background service:

**Option A: Vercel Cron (Recommended)**

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/cache-invalidation",
    "schedule": "* * * * *"
  }]
}
```

**Option B: AWS Lambda**

```bash
# Package function
zip -r function.zip scripts/cache-invalidation.prod.ts node_modules

# Deploy to Lambda
aws lambda create-function \
  --function-name cache-invalidation \
  --runtime nodejs18.x \
  --handler scripts/cache-invalidation.handler \
  --zip-file fileb://function.zip
```

**Option C: Docker Container (Always Running)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["npx", "tsx", "scripts/cache-invalidation.prod.ts"]
```

## Step 6: Configure CDN

### Vercel (Automatic)

Vercel automatically respects `Cache-Control` headers. No additional configuration needed.

### Cloudflare

1. Go to Cloudflare dashboard
2. Navigate to Caching → Configuration
3. Enable "Cache Everything" for `/api/*`
4. Set Browser Cache TTL to "Respect Existing Headers"

### AWS CloudFront

```json
{
  "CacheBehaviors": [{
    "PathPattern": "/api/*",
    "TargetOriginId": "nextjs-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "custom-cache-policy"
  }]
}
```

## Step 7: Monitoring Setup

### Upstash Console

- Monitor Redis memory usage
- Track request count
- View key distribution

### Vercel Analytics

```bash
# Enable in Vercel dashboard
# Or add to code:
npm install @vercel/analytics
```

### Custom Monitoring

```bash
# Run monitoring script
npm run cache:monitor

# Or set up cron job
*/5 * * * * cd /app && npm run cache:monitor >> /var/log/cache-monitor.log
```

## Step 8: Testing

### Load Test

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run artillery-load-test.yml

# Generate report
artillery run artillery-load-test.yml --output report.json
artillery report report.json
```

### Cache Hit Rate Test

```bash
# First request (MISS)
curl -w "\nTime: %{time_total}s\n" https://your-domain.com/api/search/prod?q=nike

# Second request (HIT - should be <50ms)
curl -w "\nTime: %{time_total}s\n" https://your-domain.com/api/search/prod?q=nike
```

### Manual Invalidation Test

```bash
# Invalidate product
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"product","id":"product-id"}'

# Verify cache cleared
curl https://your-domain.com/api/product/product-id
# Should show "cached": false
```

## Step 9: Performance Optimization

### Redis Connection Pooling

Already configured in `redis.prod.ts` with:
- Max retries: 3
- Retry strategy: exponential backoff
- Reconnect on error

### Meilisearch Query Optimization

```typescript
// Use attributesToRetrieve to reduce payload
attributesToRetrieve: ["id", "name", "price", "image_url"]

// Use pagination
limit: 20,
offset: (page - 1) * 20
```

### CDN Edge Caching

Already configured with:
- `s-maxage` for CDN cache duration
- `stale-while-revalidate` for serving stale content
- `stale-if-error` for error fallback

## Step 10: Alerts & Monitoring

### Redis Alerts

**Upstash:**
- Set up email alerts for memory > 80%
- Alert on connection errors

**AWS CloudWatch:**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name redis-memory-high \
  --metric-name DatabaseMemoryUsagePercentage \
  --threshold 80
```

### Application Monitoring

**Sentry:**
```typescript
// In redis.prod.ts
import * as Sentry from "@sentry/nextjs"

client.on("error", (err) => {
  Sentry.captureException(err)
})
```

**Datadog:**
```typescript
import { StatsD } from "node-dogstatsd"
const statsd = new StatsD()

// Track cache hits
statsd.increment("cache.hit")
statsd.increment("cache.miss")
```

## Troubleshooting

### Cache Not Working

1. Check Redis connection:
```bash
redis-cli -h host -p 6379 -a password ping
```

2. Verify environment variables:
```bash
vercel env ls
```

3. Check Next.js logs:
```bash
vercel logs
```

### High Cache Miss Rate

1. Increase TTLs in `keyBuilder.prod.ts`
2. Run cache warming more frequently
3. Check if keys are being invalidated too often

### Redis Memory Issues

1. Check memory usage:
```bash
redis-cli INFO memory
```

2. Increase maxmemory:
```bash
redis-cli CONFIG SET maxmemory 4gb
```

3. Adjust eviction policy:
```bash
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Production Checklist

- [ ] Redis deployed and accessible
- [ ] Meilisearch deployed with products indexed
- [ ] All environment variables set
- [ ] Cache warming script executed
- [ ] Realtime invalidation listener running
- [ ] CDN configured
- [ ] Load testing completed
- [ ] Monitoring and alerts configured
- [ ] SSL certificates valid
- [ ] Backup strategy for Redis (if self-hosted)
- [ ] Documentation updated with production URLs

## Rollback Plan

If issues occur:

1. Disable caching:
```bash
vercel env rm REDIS_URL production
```

2. Revert deployment:
```bash
vercel rollback
```

3. Clear all cache:
```bash
redis-cli FLUSHALL
```

## Support Contacts

- Redis: support@upstash.com
- Meilisearch: support@meilisearch.com
- Vercel: support@vercel.com
- Supabase: support@supabase.com
