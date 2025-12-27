# Search System Deployment Guide

## Step 1: Database Setup

### Run SQL Migration
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/012_search_system.sql`
3. Execute the script
4. Verify tables created:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'search%';
```

### Verify Extensions
```sql
SELECT * FROM pg_extension WHERE extname IN ('pg_trgm', 'unaccent');
```

### Update Existing Products
```sql
UPDATE products SET updated_at = NOW();
```

## Step 2: Test API Endpoints

### Test Search
```bash
curl "http://localhost:3000/api/search?q=shirt"
```

Expected response:
```json
{
  "query": "shirt",
  "results": [...],
  "count": 5,
  "didYouMean": null
}
```

### Test Autocomplete
```bash
curl "http://localhost:3000/api/search/suggestions?q=shi"
```

### Test Popular Searches
```bash
curl "http://localhost:3000/api/search/popular"
```

## Step 3: Frontend Integration

The search bar is already integrated in navbar. To use elsewhere:

```tsx
import { AdvancedSearchBar } from '@/components/search/advanced-search-bar';

<AdvancedSearchBar />
```

## Step 4: Performance Testing

### Run Load Test
```bash
k6 run k6-search-test.js
```

Expected results:
- Autocomplete: p95 < 100ms
- Search: p95 < 200ms
- Popular: p95 < 50ms

## Step 5: Monitoring Setup

### Create Analytics Dashboard
```sql
-- Top searches today
SELECT query, COUNT(*) as count
FROM search_history
WHERE created_at > CURRENT_DATE
GROUP BY query
ORDER BY count DESC
LIMIT 10;

-- Zero-result searches
SELECT query, COUNT(*) as count
FROM search_history
WHERE results_count = 0
  AND created_at > CURRENT_DATE
GROUP BY query
ORDER BY count DESC;
```

### Setup Alerts
Monitor these metrics:
1. Search error rate > 1%
2. Average search latency > 500ms
3. Zero-result rate > 20%

## Step 6: Cron Jobs (Optional)

### Refresh Popular Searches Daily
Via Supabase Edge Function:
```typescript
// supabase/functions/refresh-popular/index.ts
import { createClient } from '@supabase/supabase-js';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  await supabase.rpc('refresh_popular_searches');
  
  return new Response('OK');
});
```

Schedule via Supabase Dashboard → Edge Functions → Cron.

## Step 7: Add Sample Data (Testing)

### Add Products
```sql
INSERT INTO products (name, slug, description, price, category, brand, image_url, stock_quantity)
VALUES
  ('Black T-Shirt', 'black-tshirt', 'Classic black cotton t-shirt', 499, 'T-Shirts', 'Thrift', '/images/tshirt.jpg', 50),
  ('Blue Jeans', 'blue-jeans', 'Slim fit denim jeans', 1299, 'Jeans', 'Thrift', '/images/jeans.jpg', 30),
  ('White Sneakers', 'white-sneakers', 'Comfortable white sneakers', 1999, 'Shoes', 'Thrift', '/images/sneakers.jpg', 20);
```

### Add Synonyms
```sql
INSERT INTO search_synonyms (word, synonyms) VALUES
  ('tshirt', ARRAY['t-shirt', 'tee', 'top']),
  ('jeans', ARRAY['denim', 'pants']),
  ('sneakers', ARRAY['shoes', 'trainers']);
```

### Generate Search History
```sql
INSERT INTO search_history (query, results_count)
SELECT 
  (ARRAY['shirt', 'jeans', 'shoes', 'dress', 'jacket'])[floor(random() * 5 + 1)],
  floor(random() * 20)
FROM generate_series(1, 100);

-- Refresh popular searches
SELECT refresh_popular_searches();
```

## Step 8: Production Checklist

- [ ] SQL migration executed
- [ ] Extensions enabled (pg_trgm, unaccent)
- [ ] Indexes created and verified
- [ ] All API endpoints tested
- [ ] Load test passed
- [ ] Search bar integrated in UI
- [ ] Analytics queries working
- [ ] Rate limiting configured
- [ ] Error logging setup
- [ ] Cron job scheduled (optional)

## Troubleshooting

### Issue: Search returns empty results
**Solution**: Update search vectors
```sql
UPDATE products SET updated_at = NOW();
```

### Issue: Autocomplete not working
**Solution**: Check trigram extension
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Issue: Slow queries
**Solution**: Verify indexes
```sql
REINDEX INDEX products_search_vector_idx;
REINDEX INDEX products_name_trgm_idx;
```

### Issue: Popular searches empty
**Solution**: Refresh materialized view
```sql
SELECT refresh_popular_searches();
```

## Rollback Plan

If issues occur, rollback:
```sql
-- Drop tables
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS search_synonyms CASCADE;
DROP MATERIALIZED VIEW IF EXISTS popular_searches CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS search_products CASCADE;
DROP FUNCTION IF EXISTS search_suggestions CASCADE;
DROP FUNCTION IF EXISTS did_you_mean CASCADE;
DROP FUNCTION IF EXISTS refresh_popular_searches CASCADE;

-- Drop indexes
DROP INDEX IF EXISTS products_search_vector_idx;
DROP INDEX IF EXISTS products_name_trgm_idx;

-- Remove column
ALTER TABLE products DROP COLUMN IF EXISTS search_vector;
```

## Support

Check documentation: `SEARCH_SYSTEM_DOCS.md`
