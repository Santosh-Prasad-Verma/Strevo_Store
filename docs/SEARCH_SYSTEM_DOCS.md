# Advanced Search System Documentation

## Architecture

```
Frontend (React)
    ↓
API Routes (/api/search/*)
    ↓
SearchEngine Service Layer
    ↓
PostgreSQL Full-Text Search + Trigram
```

## Features Implemented

### ✅ Core Search
- Full-text search with PostgreSQL `tsvector`
- Fuzzy/typo matching with `pg_trgm` (trigram similarity)
- Weighted ranking (name > brand > category > description)
- Business logic boosting (in-stock, featured products)

### ✅ Autocomplete
- Real-time suggestions (300ms debounce)
- Product names, categories, brands
- Prefix, contains, and fuzzy matching
- Keyboard navigation (↑↓ Enter Esc)

### ✅ Advanced Features
- Spell correction ("Did you mean?")
- Synonym expansion (tshirt → t-shirt, tee)
- Popular searches tracking
- Search history per user
- Click-through analytics

### ✅ Performance
- GIN indexes on search_vector and trigram
- Request abort on new query
- Rate limiting (100 req/min search, 200 req/min suggestions)
- Materialized view for popular searches

## API Endpoints

### 1. Main Search
```
GET /api/search?q=<query>&category=<cat>&minPrice=<min>&maxPrice=<max>&limit=<n>

Response:
{
  "query": "tshirt",
  "results": [...],
  "count": 15,
  "didYouMean": "t-shirt" // if no results
}
```

### 2. Autocomplete Suggestions
```
GET /api/search/suggestions?q=<query>

Response:
{
  "suggestions": [
    {
      "suggestion": "Black T-Shirt",
      "type": "product",
      "match_type": "prefix"
    },
    {
      "suggestion": "T-Shirts",
      "type": "category",
      "match_type": "exact"
    }
  ]
}
```

### 3. Popular Searches
```
GET /api/search/popular

Response:
{
  "popular": ["jeans", "tshirt", "sneakers", ...]
}
```

### 4. Log Search Click
```
POST /api/search/log
Body: { "query": "tshirt", "productId": 123 }

Response:
{ "success": true }
```

## Database Schema

### Tables Created
1. **search_synonyms** - Synonym dictionary
2. **search_history** - User search analytics
3. **popular_searches** - Materialized view (top 50 searches)

### Indexes Created
- `products_search_vector_idx` (GIN) - Full-text search
- `products_name_trgm_idx` (GIN) - Fuzzy matching
- `products_category_idx` - Category filtering
- `products_brand_idx` - Brand filtering

### Functions Created
1. `search_products()` - Main search with ranking
2. `search_suggestions()` - Autocomplete
3. `did_you_mean()` - Spell correction
4. `refresh_popular_searches()` - Update popular searches

## Ranking Formula

```sql
relevance_score = 
  ts_rank_cd(search_vector, query) * 10 +  -- FTS rank
  (exact_match ? 5 : 0) +                   -- Exact match bonus
  (in_stock ? 3 : 0) +                      -- Stock bonus
  (is_featured ? 2 : 0) +                   -- Featured bonus
  similarity(name, query) * 3               -- Trigram similarity
```

## Component Usage

### Replace Navbar Search
```tsx
import { AdvancedSearchBar } from '@/components/search/advanced-search-bar';

// In navbar:
<AdvancedSearchBar />
```

### Features
- Debounced input (300ms)
- Autocomplete dropdown
- Popular searches when empty
- Keyboard navigation
- Loading states
- Request cancellation

## Setup Instructions

### 1. Run SQL Migration
```bash
psql -h <supabase-host> -U postgres -d postgres -f scripts/012_search_system.sql
```

Or via Supabase Dashboard:
- Go to SQL Editor
- Paste contents of `scripts/012_search_system.sql`
- Run

### 2. Update Existing Products
```sql
-- Trigger will auto-update new products
-- For existing products, run:
UPDATE products SET updated_at = NOW();
```

### 3. Add Sample Synonyms (Optional)
```sql
INSERT INTO search_synonyms (word, synonyms) VALUES
  ('hoodie', ARRAY['sweatshirt', 'pullover']),
  ('pants', ARRAY['trousers', 'slacks']),
  ('bag', ARRAY['purse', 'handbag', 'tote']);
```

### 4. Setup Cron Job (Optional)
Refresh popular searches daily:
```sql
-- Via pg_cron extension
SELECT cron.schedule('refresh-popular-searches', '0 2 * * *', 'SELECT refresh_popular_searches()');
```

Or via Supabase Edge Function scheduled daily.

## Performance Benchmarks

### Expected Performance
- Search query: <100ms (with indexes)
- Autocomplete: <50ms
- Popular searches: <10ms (cached)

### Optimization Tips
1. **Add more indexes** if filtering by other fields
2. **Use Redis** for caching popular searches
3. **CDN cache** for `/api/search/popular`
4. **Limit results** to 20-50 per query

## Testing

### Test Search
```bash
curl "http://localhost:3000/api/search?q=shirt"
```

### Test Autocomplete
```bash
curl "http://localhost:3000/api/search/suggestions?q=shi"
```

### Test Popular
```bash
curl "http://localhost:3000/api/search/popular"
```

### Load Test
```bash
k6 run k6-search-test.js
```

## Monitoring

### Key Metrics to Track
1. **Search latency** (p50, p95, p99)
2. **Zero-result rate** (% of searches with 0 results)
3. **Click-through rate** (% of searches leading to product click)
4. **Top searches** (what users search most)
5. **Failed searches** (queries with no results)

### Query Analytics
```sql
-- Top searches last 7 days
SELECT query, COUNT(*) as count
FROM search_history
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY count DESC
LIMIT 20;

-- Zero-result searches
SELECT query, COUNT(*) as count
FROM search_history
WHERE results_count = 0
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY count DESC
LIMIT 20;

-- Click-through rate
SELECT 
  COUNT(DISTINCT CASE WHEN clicked_product_id IS NOT NULL THEN id END)::FLOAT / 
  COUNT(DISTINCT id) * 100 as ctr_percentage
FROM search_history
WHERE created_at > NOW() - INTERVAL '7 days';
```

## Synonym Management

### Add Synonyms
```sql
INSERT INTO search_synonyms (word, synonyms) 
VALUES ('sneaker', ARRAY['shoe', 'trainer', 'kicks']);
```

### Update Synonyms
```sql
UPDATE search_synonyms 
SET synonyms = ARRAY['t-shirt', 'tee', 'top', 'shirt']
WHERE word = 'tshirt';
```

## Troubleshooting

### Search returns no results
1. Check if products have `search_vector` populated:
```sql
SELECT id, name, search_vector FROM products LIMIT 5;
```

2. Manually update search vectors:
```sql
UPDATE products SET updated_at = NOW();
```

### Autocomplete not working
1. Check trigram extension:
```sql
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';
```

2. Check trigram index:
```sql
SELECT * FROM pg_indexes WHERE indexname = 'products_name_trgm_idx';
```

### Slow queries
1. Check if indexes exist:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'products';
```

2. Analyze query plan:
```sql
EXPLAIN ANALYZE SELECT * FROM search_products('shirt', NULL, NULL, NULL, 20);
```

## Future Enhancements

### Phase 2 (Optional)
- [ ] Redis caching layer
- [ ] Search filters UI (price range, category checkboxes)
- [ ] Search result highlighting
- [ ] Image search
- [ ] Voice search
- [ ] AI semantic search with embeddings
- [ ] Personalized ranking based on user history
- [ ] A/B testing for ranking algorithms

### Phase 3 (Advanced)
- [ ] Elasticsearch migration for >100K products
- [ ] Real-time search analytics dashboard
- [ ] ML-based query understanding
- [ ] Multi-language support
- [ ] Search result clustering

## Cost Analysis

### Current Setup (PostgreSQL)
- **Infrastructure**: $0 (uses existing Supabase)
- **Maintenance**: Low
- **Scalability**: Good up to 100K products

### Alternative: Algolia
- **Cost**: ~$1 per 1,000 searches
- **Maintenance**: Zero
- **Scalability**: Unlimited

### Alternative: Meilisearch
- **Cost**: $10-50/month (server)
- **Maintenance**: Medium
- **Scalability**: Excellent

## Support

For issues or questions:
1. Check logs in Supabase Dashboard
2. Review SQL function definitions
3. Test API endpoints directly
4. Check browser console for frontend errors
