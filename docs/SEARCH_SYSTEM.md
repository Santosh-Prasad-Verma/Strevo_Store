# Strevo Search System Documentation

## Diagnosis

The current search setup is slow because:
1. **No prefix indexes** - ILIKE queries scan full table without trigram/prefix indexes
2. **No materialized view** - Each suggestion query recalculates from products table
3. **Missing caching** - No Redis cache for hot queries, every request hits DB

---

## Architecture Overview

```
User Types → [250ms debounce] → /api/search/suggest
                                      ↓
                              [Check Redis Cache]
                                      ↓
                              [Cache HIT?] → Return cached
                                      ↓ NO
                              [Strategy 1: Prefix Match]
                              (product_suggestions MV)
                                      ↓ No results?
                              [Strategy 2: Trigram Similarity]
                              (pg_trgm on title_norm)
                                      ↓ No results?
                              [Strategy 3: Full-text Search]
                              (tsvector on products)
                                      ↓
                              [Cache result in Redis]
                                      ↓
                              Return suggestions
```

---

## File Map

```
scripts/
├── search_indexing.sql       # Extensions, indexes, materialized view
├── search_functions.sql      # RPC functions for fast queries
├── benchmark-search.js       # Latency benchmark script
│
lib/
├── search/
│   └── normalizeQuery.ts     # Query normalization
├── cache/
│   └── redis.ts              # Redis client (existing)
│
app/api/search/
└── suggest/route.ts          # Fast suggestion API endpoint

components/
└── SearchSuggest.tsx         # React typeahead component
```

---

## SQL Setup

### 1. Run Indexing Script
```bash
# Via Supabase CLI
supabase db push < scripts/search_indexing.sql

# Or via psql
psql $DATABASE_URL < scripts/search_indexing.sql
```

### 2. Run Functions Script
```bash
supabase db push < scripts/search_functions.sql
```

### 3. Verify Setup
```sql
-- Check materialized view
SELECT COUNT(*) FROM product_suggestions;

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'product_suggestions';

-- Test prefix search
SELECT * FROM search_suggestions_prefix('t shirt', 6);

-- Test trigram search
SELECT * FROM search_suggestions_trigram('tshirt', 6);
```

---

## Query Patterns

### Pattern 1: Fast Prefix Match (Primary)
```sql
SELECT id, title, slug, price, thumbnail_url, popularity_score
FROM product_suggestions
WHERE title_norm LIKE 't shirt%'
ORDER BY popularity_score DESC
LIMIT 6;
```
**Expected:** <10ms with index

### Pattern 2: Trigram Similarity (Fallback)
```sql
SELECT id, title, slug, price, thumbnail_url, 
       similarity(title_norm, 't shirt') AS sim
FROM product_suggestions
WHERE similarity(title_norm, 't shirt') > 0.15
ORDER BY sim DESC, popularity_score DESC
LIMIT 6;
```
**Expected:** <50ms with trigram index

### Pattern 3: Full-text Search (Last Resort)
```sql
SELECT id, name, price, image_url,
       ts_rank(search_vector, websearch_to_tsquery('simple', 't shirt')) AS rank
FROM products
WHERE is_active = true 
  AND search_vector @@ websearch_to_tsquery('simple', 't shirt')
ORDER BY rank DESC, stock_quantity DESC
LIMIT 6;
```
**Expected:** <100ms with GIN index

---

## Cache Strategy

### Redis Key Format
```
suggest:{normalized_query}:l{limit}:v3
suggest:popular:l6:v3
```

### TTLs
| Type | TTL | Reason |
|------|-----|--------|
| Popular (empty query) | 600s | Rarely changes |
| Results found | 120s | Balance freshness/speed |
| No results | 30s | Retry sooner |

### Invalidation
```bash
# Purge all suggestion cache
node scripts/purge-cache.js --pattern "suggest:*"

# Refresh materialized view
psql $DATABASE_URL -c "SELECT refresh_product_suggestions();"
```

---

## API Response Format

```json
{
  "suggestions": [
    {
      "id": "uuid",
      "title": "Classic T-Shirt",
      "slug": "uuid",
      "price": 999,
      "thumbnail_url": "https://..."
    }
  ],
  "cache": "HIT" | "MISS",
  "timeMs": 45
}
```

### Headers
- `X-Cache-Status`: HIT | MISS
- `Server-Timing`: prefix;dur=5, cache;dur=2, total;dur=45
- `Cache-Control`: public, s-maxage=60, stale-while-revalidate=120

---

## Thumbnail Guidelines

### Sizes
| Use Case | Size | Format |
|----------|------|--------|
| Suggestion dropdown | 64×64 or 80×80 | WebP |
| Product grid | 320×320 | WebP |
| Product detail | 1200-2000px | WebP |

### Storage
- Store `thumbnail_url` in products table
- Generate on upload via serverless function
- Or use CDN transform: `?width=64&height=64&fit=cover`

---

## Benchmarking

### Run Benchmark
```bash
node scripts/benchmark-search.js
node scripts/benchmark-search.js --url https://staging.strevo.com --iterations 500
```

### EXPLAIN ANALYZE
```sql
EXPLAIN ANALYZE
SELECT * FROM product_suggestions
WHERE title_norm LIKE 't shirt%'
ORDER BY popularity_score DESC
LIMIT 6;
```

### Load Test (k6)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

const queries = ['t shirt', 'hoodie', 'jeans', 'jacket'];

export default function () {
  const q = queries[Math.floor(Math.random() * queries.length)];
  const res = http.get(`${__ENV.BASE_URL}/api/search/suggest?q=${encodeURIComponent(q)}&limit=6`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });
  
  sleep(0.1);
}
```

---

## Acceptance Criteria

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Cold query p95 | <300ms | Benchmark script |
| Cached query p95 | <120ms | Benchmark script |
| UI perceived latency | <400ms | 250ms debounce + server |
| Suggestions include thumbnail | ✓ | API response |
| Typo handling | ✓ | Test "tshirt" → "t-shirt" |
| Cache hit ratio | >60% | Benchmark script |

---

## Rollback

```sql
-- Remove triggers
DROP TRIGGER IF EXISTS products_notify_trigger ON products;
DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;

-- Remove functions
DROP FUNCTION IF EXISTS notify_product_change();
DROP FUNCTION IF EXISTS refresh_product_suggestions();
DROP FUNCTION IF EXISTS products_search_vector_update();
DROP FUNCTION IF EXISTS search_suggestions_prefix;
DROP FUNCTION IF EXISTS search_suggestions_trigram;
DROP FUNCTION IF EXISTS search_suggestions_fulltext;
DROP FUNCTION IF EXISTS search_suggestions_combined;

-- Remove materialized view
DROP MATERIALIZED VIEW IF EXISTS product_suggestions;

-- Remove indexes
DROP INDEX IF EXISTS idx_products_name_trgm;
DROP INDEX IF EXISTS idx_products_brand_trgm;
DROP INDEX IF EXISTS idx_products_search_vector;
DROP INDEX IF EXISTS idx_products_active_popular;

-- Remove column
ALTER TABLE products DROP COLUMN IF EXISTS search_vector;
```

---

## Optional Next Steps

1. **Precompute n-grams** - Store search_keywords column for exact prefix lookups
2. **Top-N cache** - Precompute top suggestions per popular prefix in Redis
3. **Synonym expansion** - Map "tee" → "t-shirt" at query time
4. **Meilisearch** - If latency still high, add as search layer (keep Postgres as source)
5. **Analytics** - Track no-result queries to improve coverage
