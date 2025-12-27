# Search System - Quick Start

## 🚀 5-Minute Setup

### 1. Run SQL (2 min)
```bash
# Open Supabase Dashboard → SQL Editor
# Paste and run: scripts/012_search_system.sql
```

### 2. Update Products (30 sec)
```sql
UPDATE products SET updated_at = NOW();
```

### 3. Test (1 min)
```bash
# Start dev server
npm run dev

# Test search
curl "http://localhost:3000/api/search?q=shirt"

# Test autocomplete
curl "http://localhost:3000/api/search/suggestions?q=shi"
```

### 4. Done! ✅
Search bar is already in navbar. Start typing to see autocomplete.

---

## 📊 Features

✅ **Autocomplete** - Real-time suggestions as you type  
✅ **Fuzzy Search** - Handles typos (shirt → shrit)  
✅ **Spell Correction** - "Did you mean?" suggestions  
✅ **Popular Searches** - Shows trending searches  
✅ **Keyboard Nav** - ↑↓ Enter Esc support  
✅ **Analytics** - Tracks searches and clicks  
✅ **Fast** - <100ms autocomplete, <200ms search  

---

## 🎯 API Endpoints

| Endpoint | Purpose | Speed |
|----------|---------|-------|
| `/api/search?q=<query>` | Main search | <200ms |
| `/api/search/suggestions?q=<query>` | Autocomplete | <100ms |
| `/api/search/popular` | Popular searches | <50ms |
| `/api/search/log` | Log clicks | Async |

---

## 🔧 Customization

### Change Debounce Delay
```tsx
// components/search/advanced-search-bar.tsx
const debouncedQuery = useDebounce(query, 300); // Change 300 to desired ms
```

### Add More Synonyms
```sql
INSERT INTO search_synonyms (word, synonyms) VALUES
  ('hoodie', ARRAY['sweatshirt', 'pullover']),
  ('bag', ARRAY['purse', 'handbag', 'tote']);
```

### Adjust Ranking
```sql
-- Edit function in scripts/012_search_system.sql
-- Modify relevance_score formula
```

---

## 📈 Analytics Queries

### Top Searches Today
```sql
SELECT query, COUNT(*) as count
FROM search_history
WHERE created_at > CURRENT_DATE
GROUP BY query
ORDER BY count DESC
LIMIT 10;
```

### Zero-Result Searches
```sql
SELECT query, COUNT(*) as count
FROM search_history
WHERE results_count = 0
GROUP BY query
ORDER BY count DESC;
```

### Click-Through Rate
```sql
SELECT 
  COUNT(DISTINCT CASE WHEN clicked_product_id IS NOT NULL THEN id END)::FLOAT / 
  COUNT(DISTINCT id) * 100 as ctr_percentage
FROM search_history;
```

---

## 🐛 Troubleshooting

**No results?**
```sql
UPDATE products SET updated_at = NOW();
```

**Autocomplete not working?**
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

**Slow queries?**
```sql
REINDEX INDEX products_search_vector_idx;
```

---

## 📚 Full Documentation

See `SEARCH_SYSTEM_DOCS.md` for complete details.
