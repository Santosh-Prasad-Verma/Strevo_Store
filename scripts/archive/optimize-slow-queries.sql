-- ============================================
-- SLOW QUERY OPTIMIZATION
-- ============================================

-- 1. IDENTIFY SLOW QUERIES
-- ============================================

-- View current slow queries
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time,
    rows
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;

-- 2. ADD MISSING INDEXES
-- ============================================

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category, status);
CREATE INDEX IF NOT EXISTS idx_products_brand_status ON products(brand, status);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_updated ON orders(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order Items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Cart Items indexes
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_product ON cart_items(user_id, product_id);

-- Product Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON product_reviews(created_at DESC);

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist_items(product_id);

-- Search Analytics indexes
CREATE INDEX IF NOT EXISTS idx_search_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_created ON search_analytics(created_at DESC);

-- 3. OPTIMIZE COMMON QUERIES
-- ============================================

-- Create materialized view for product stats
CREATE MATERIALIZED VIEW IF NOT EXISTS product_stats AS
SELECT 
    p.id,
    p.name,
    COUNT(DISTINCT pr.id) as review_count,
    AVG(pr.rating) as avg_rating,
    COUNT(DISTINCT oi.id) as order_count
FROM products p
LEFT JOIN product_reviews pr ON p.id = pr.product_id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_stats_id ON product_stats(id);

-- Create function to refresh stats
CREATE OR REPLACE FUNCTION refresh_product_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
END;
$$ LANGUAGE plpgsql;

-- 4. VACUUM AND ANALYZE
-- ============================================

VACUUM ANALYZE products;
VACUUM ANALYZE orders;
VACUUM ANALYZE order_items;
VACUUM ANALYZE cart_items;
VACUUM ANALYZE product_reviews;
VACUUM ANALYZE wishlist_items;
VACUUM ANALYZE search_analytics;

-- 5. UPDATE TABLE STATISTICS
-- ============================================

ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE cart_items;
ANALYZE product_reviews;
ANALYZE wishlist_items;

-- 6. ENABLE QUERY OPTIMIZATION
-- ============================================

-- Set work_mem for complex queries (per connection)
-- Run this in your application connection string or pgbouncer
-- SET work_mem = '256MB';

-- 7. VERIFICATION
-- ============================================

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries after optimization
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
