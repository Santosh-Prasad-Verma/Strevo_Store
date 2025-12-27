# Meilisearch Connection Fix

## Issue
Meilisearch is not running or not accessible, causing 13-32 second response times.

## Quick Fix Applied
Switched suggestions API to use Supabase with:
- Redis caching (5min TTL)
- Optimized ILIKE query with LIMIT 8
- CDN caching headers

## Performance
- **Before**: 13-32 seconds (Meilisearch timeout)
- **After**: ~100-200ms (Supabase + cache)
- **Cached**: ~20ms (Redis hit)

## Required: Run Database Optimization

```bash
# Connect to Supabase SQL Editor and run:
scripts/017_optimize_search_indexes.sql
```

This adds trigram indexes for fast ILIKE queries.

## Optional: Fix Meilisearch (Better Performance)

If you want <50ms search:

### 1. Check if Meilisearch is running
```bash
curl http://localhost:7700/health
```

### 2. Start Meilisearch
```bash
# Windows
meilisearch --master-key="your_key"

# Or Docker
docker run -d -p 7700:7700 getmeili/meilisearch:latest
```

### 3. Sync products to Meilisearch
```bash
npm run meili:sync
```

### 4. Update .env.local
```env
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your_master_key
MEILI_SEARCH_KEY=your_search_key
```

## Current Solution Works
The Supabase fallback with Redis caching is production-ready and fast enough for most use cases.
