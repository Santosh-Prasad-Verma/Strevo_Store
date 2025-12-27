# 🔍 Strevo Store Search System

Production-ready Meilisearch + Redis search infrastructure with mega-menu navigation.

## Architecture

- **Meilisearch**: Primary search engine (typo-tolerant, faceted, <50ms)
- **Redis**: Cache layer for hot queries and facet counts (70%+ hit rate)
- **Supabase**: Fallback for search failures
- **Realtime Sync**: Postgres → Meilisearch incremental updates

## Environment Variables

```bash
# Meilisearch
MEILI_HOST=https://your-meili-instance.com
MEILI_ADMIN_KEY=your_admin_key_here
MEILI_SEARCH_KEY=your_search_only_key_here
MEILI_INDEX_VERSION=v1

# Redis (optional but recommended)
REDIS_URL=redis://default:password@host:port

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin endpoints
REVALIDATE_SECRET=your_secret_for_admin_endpoints
```

## Quick Start

### 1. Install Dependencies

```bash
npm install meilisearch ioredis
```

### 2. Initialize Meilisearch Index

```bash
# Run bulk index script
node scripts/meili_bulk_index.js
```

### 3. Start Realtime Sync (Optional)

```bash
# Run in background or as systemd service
node scripts/meili_realtime_sync.js
```

### 4. Test Search

```bash
curl "http://localhost:3000/api/search?q=t-shirt"
```

## API Endpoints

### Search Products
```
GET /api/search?q=hoodie&category=Men&minPrice=20&maxPrice=100&page=1
```

**Response:**
```json
{
  "hits": [...],
  "total": 42,
  "facets": {
    "brand": { "Nike": 10, "Adidas": 8 },
    "colors": { "Black": 15, "White": 12 }
  },
  "page": 1,
  "pages": 2
}
```

### Autocomplete Suggestions
```
GET /api/search/suggest?q=hoo
```

**Response:**
```json
{
  "products": [...],
  "brands": ["Nike", "Adidas"],
  "categories": ["Men", "Women"]
}
```

### Get Facet Counts
```
GET /api/search/facets?category=Men
```

**Response:**
```json
{
  "brands": { "Nike": 50, "Adidas": 30 },
  "sizes": { "S": 20, "M": 35, "L": 40 },
  "total": 150
}
```

## Admin Endpoints

### Reindex All Products
```bash
curl -X POST http://localhost:3000/api/meili/reindex \
  -H "Authorization: Bearer YOUR_REVALIDATE_SECRET"
```

### Purge Cache
```bash
curl -X POST http://localhost:3000/api/cache/purge \
  -H "Authorization: Bearer YOUR_REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"pattern": "search:*"}'
```

## Performance Targets

- **Search latency**: <200ms (p95)
- **Cached queries**: <60ms (p95)
- **Cache hit rate**: >70%
- **Meilisearch**: <50ms
- **Facet computation**: <500ms

## Monitoring

Check headers in API responses:
```
X-Cache-Status: HIT | MISS
Server-Timing: meili;dur=45, total;dur=52
```

## Troubleshooting

### Meilisearch Connection Failed
- Check `MEILI_HOST` and `MEILI_ADMIN_KEY`
- Verify Meilisearch is running: `curl $MEILI_HOST/health`
- System falls back to Supabase automatically

### Redis Connection Failed
- Check `REDIS_URL` format: `redis://user:pass@host:port`
- System works without Redis (no caching)

### No Search Results
- Run bulk index: `node scripts/meili_bulk_index.js`
- Check products have `is_active = true`
- Verify index name matches `MEILI_INDEX_VERSION`

### Stale Results
- Purge cache: `POST /api/cache/purge`
- Restart realtime sync worker
- Check Supabase realtime is enabled

## Deployment

### Vercel
1. Add environment variables in Vercel dashboard
2. Deploy: `vercel --prod`
3. Run bulk index after first deploy

### Managed Meilisearch
- Recommended: [Meilisearch Cloud](https://www.meilisearch.com/cloud)
- Alternative: Self-host with Docker

### Redis
- Recommended: [Upstash](https://upstash.com/) (serverless)
- Alternative: Redis Labs, AWS ElastiCache

## Synonyms Management

Edit `scripts/synonyms.json` and reindex:
```bash
node scripts/meili_bulk_index.js
```

## Index Versioning

To create new index version:
1. Update `MEILI_INDEX_VERSION=v2`
2. Run bulk index (creates `products_v2`)
3. Old index (`products_v1`) remains for rollback
4. Update env var in production

## Support

For issues, check:
- Meilisearch logs
- Redis connection
- Supabase realtime status
- API response headers
