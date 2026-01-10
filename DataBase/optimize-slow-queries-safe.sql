-- ============================================
-- SLOW QUERY OPTIMIZATION - Safe Version
-- ============================================

-- 1. ADD INDEXES ONLY IF COLUMNS EXIST
-- ============================================

-- Products table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='updated_at') THEN
        CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category') THEN
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='brand') THEN
        CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price') THEN
        CREATE INDEX IF NOT EXISTS idx_products_price_range ON products(price);
    END IF;
END $$;

-- Orders table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='created_at') THEN
            CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='status') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='updated_at') THEN
            CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, updated_at DESC);
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    END IF;
END $$;

-- Order Items
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='order_id') THEN
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='product_id') THEN
        CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
    END IF;
END $$;

-- Cart Items
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='user_id') THEN
        CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='product_id') THEN
            CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON cart_items(user_id, product_id);
        END IF;
    END IF;
END $$;

-- Product Reviews
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_reviews' AND column_name='product_id') THEN
        CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_reviews' AND column_name='user_id') THEN
        CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_reviews' AND column_name='created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
    END IF;
END $$;

-- Wishlist Items
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wishlist_items' AND column_name='user_id') THEN
        CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wishlist_items' AND column_name='product_id') THEN
        CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);
    END IF;
END $$;

-- Search Analytics
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='search_analytics' AND column_name='query') THEN
        CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='search_analytics' AND column_name='created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at DESC);
    END IF;
END $$;

-- 2. UPDATE STATISTICS
-- ============================================

ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE cart_items;
ANALYZE product_reviews;
ANALYZE wishlist_items;
ANALYZE search_analytics;

-- 4. VERIFICATION
-- ============================================

-- Check newly created indexes
SELECT 
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND indexrelname LIKE 'idx_%'
ORDER BY relname, indexrelname;

-- Check table sizes
SELECT 
    t.tablename,
    pg_size_pretty(pg_total_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename))) as total_size,
    pg_size_pretty(pg_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename))) as table_size
FROM pg_tables t
WHERE t.schemaname = 'public'
ORDER BY pg_total_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename)) DESC
LIMIT 10;

-- Check sequential scans (should decrease after indexes)
SELECT 
    schemaname,
    relname as table_name,
    seq_scan,
    idx_scan,
    CASE 
        WHEN seq_scan + idx_scan > 0 
        THEN ROUND(100.0 * idx_scan / (seq_scan + idx_scan), 2)
        ELSE 0
    END as index_usage_pct
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY seq_scan DESC
LIMIT 10;
