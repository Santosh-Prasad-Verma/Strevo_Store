# 🚀 Query Optimization Guide

You have **48 slow queries** that need optimization. Follow this guide to identify and fix them.

## 📊 Current Status

- ✅ **Cache Hit Rate**: 100% (Excellent!)
- ⚠️ **Slow Queries**: 48 queries need optimization
- 📈 **Avg Rows Per Call**: 2.6

## 🔍 Step 1: Identify Slow Queries

Run this script to see which queries are slow:

```bash
# In Supabase SQL Editor
scripts/analyze-slow-queries.sql
```

This will show you:
- Top 48 slowest queries
- Missing indexes
- Unused indexes (wasting space)
- Tables needing VACUUM
- Bloated tables

## ⚡ Step 2: Apply Optimizations

After identifying issues, run:

```bash
# In Supabase SQL Editor
scripts/optimize-slow-queries.sql
```

This will:
- ✅ Add missing indexes on frequently queried columns
- ✅ Create materialized views for complex queries
- ✅ Run VACUUM ANALYZE on all tables
- ✅ Update query planner statistics

## 🎯 Common Slow Query Patterns

### 1. Missing Indexes

**Problem**: Sequential scans on large tables

**Solution**: Add indexes on:
- Foreign keys (`user_id`, `product_id`, `order_id`)
- Filter columns (`status`, `category`, `brand`)
- Sort columns (`created_at`, `updated_at`)
- Composite indexes for common query patterns

### 2. Unoptimized JOINs

**Problem**: Joining large tables without proper indexes

**Solution**:
```sql
-- Add indexes on JOIN columns
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

### 3. Complex Aggregations

**Problem**: COUNT/AVG/SUM on large datasets

**Solution**: Use materialized views
```sql
-- Pre-compute expensive aggregations
CREATE MATERIALIZED VIEW product_stats AS
SELECT product_id, COUNT(*) as review_count, AVG(rating) as avg_rating
FROM product_reviews
GROUP BY product_id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
```

### 4. Full Text Search

**Problem**: LIKE queries on text columns

**Solution**: Use GIN indexes
```sql
CREATE INDEX idx_products_name_gin ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_search_vector ON products USING gin(search_vector);
```

## 📈 Performance Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Cache Hit Rate | 100% | >99% | ✅ |
| Slow Queries | 48 | <10 | ⚠️ |
| Avg Query Time | ? | <50ms | ⚠️ |
| Index Hit Rate | ? | >99% | ? |

## 🔧 Quick Fixes

### Fix 1: Add Core Indexes
```sql
-- Products
CREATE INDEX idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_category_status ON products(category, status);

-- Orders
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status_updated ON orders(status, updated_at DESC);

-- Cart
CREATE INDEX idx_cart_user ON cart_items(user_id);
```

### Fix 2: Optimize Common Queries

**Before** (Slow):
```sql
SELECT * FROM products WHERE category = 'clothing' AND status = 'active';
-- Sequential scan: 500ms
```

**After** (Fast):
```sql
-- With composite index
CREATE INDEX idx_products_category_status ON products(category, status);
-- Index scan: 5ms
```

### Fix 3: Use Partial Indexes

For queries that always filter by status:
```sql
CREATE INDEX idx_products_active ON products(category, brand) 
WHERE status = 'active';
```

This is smaller and faster than a full index.

## 🧪 Testing Performance

### Before Optimization
```sql
EXPLAIN ANALYZE
SELECT * FROM products WHERE category = 'clothing' AND status = 'active';
```

Look for:
- ❌ `Seq Scan` - Bad (full table scan)
- ✅ `Index Scan` - Good (uses index)
- ✅ `Bitmap Index Scan` - Good (multiple indexes)

### After Optimization
```sql
-- Should show Index Scan with low execution time
EXPLAIN ANALYZE
SELECT * FROM products WHERE category = 'clothing' AND status = 'active';
```

## 📊 Monitoring

### Check Query Performance
```sql
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC;
```

### Check Index Usage
```sql
SELECT 
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Check Cache Hit Rate
```sql
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

## 🔄 Maintenance Schedule

### Daily
- Monitor slow query log
- Check for long-running queries

### Weekly
- Run ANALYZE on large tables
- Refresh materialized views
- Check index usage

### Monthly
- Run VACUUM FULL on bloated tables
- Review and drop unused indexes
- Optimize query patterns

## 🚨 Emergency Fixes

If queries are extremely slow right now:

```sql
-- 1. Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active' AND query_start < now() - interval '5 minutes';

-- 2. Quick VACUUM
VACUUM ANALYZE products;
VACUUM ANALYZE orders;

-- 3. Reset query stats
SELECT pg_stat_statements_reset();
```

## 📞 Next Steps

1. ✅ Run `analyze-slow-queries.sql` to identify issues
2. ✅ Run `optimize-slow-queries.sql` to apply fixes
3. ✅ Monitor performance for 24 hours
4. ✅ Adjust indexes based on actual query patterns
5. ✅ Set up automated VACUUM schedule

---

**Expected Results**: Slow queries should drop from 48 to <10 after optimization! 🎯
