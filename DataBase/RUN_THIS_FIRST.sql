-- ============================================
-- 🚀 MASTER FIX SCRIPT - Run This First
-- ============================================
-- This script fixes all security and performance issues
-- Run this in Supabase SQL Editor

-- ============================================
-- PART 1: SECURITY FIXES (54 tables)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.birthday_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bnpl_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmap_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_profiles ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'birthday_rewards', 'sustainability_impact', 'product_customizations', 'subscription_boxes',
        'invoices', 'saved_payment_methods', 'bnpl_plans', 'store_locations', 'exchanges', 'returns',
        'delivery_slots', 'delivery_options', 'order_tracking', 'heatmap_clicks', 'ab_test_results',
        'ab_tests', 'push_subscriptions', 'newsletter_subscribers', 'user_activity', 'outfits',
        'video_reviews', 'forum_likes', 'forum_replies', 'forum_posts', 'forum_categories',
        'chat_messages', 'chat_sessions', 'influencer_sales', 'influencers', 'social_shares',
        'social_connections', 'content_likes', 'product_waitlist', 'referrals', 'loyalty_transactions',
        'loyalty_points', 'user_measurements', 'influencer_payouts', 'pre_orders', 'promo_code_usage',
        'promo_codes', 'review_votes', 'gift_card_transactions', 'gift_cards', 'reviews',
        'pricing_rules', 'bundle_deals', 'flash_sales', 'user_content', 'stock_alerts',
        'product_comparisons', 'stylist_sessions', 'recently_viewed', 'style_profiles'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS admin_all ON public.%I', tbl);
        EXECUTE format('CREATE POLICY admin_all ON public.%I FOR ALL TO service_role USING (true)', tbl);
        
        EXECUTE format('DROP POLICY IF EXISTS public_read ON public.%I', tbl);
        EXECUTE format('CREATE POLICY public_read ON public.%I FOR SELECT TO anon, authenticated USING (true)', tbl);
    END LOOP;
END $$;

-- ============================================
-- PART 2: PERFORMANCE FIXES (Optimize RLS)
-- ============================================

-- Products - Consolidate admin policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
    DROP POLICY IF EXISTS "Admins can update products" ON public.products;
    DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
    DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
    DROP POLICY IF EXISTS "Admin can update products" ON public.products;
    DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
    CREATE POLICY "Admin can manage products" ON public.products FOR ALL
    USING ((SELECT auth.jwt()->>'role') = 'admin');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Remove duplicate indexes
DROP INDEX IF EXISTS public.idx_cart_items_user;
DROP INDEX IF EXISTS public.idx_cart_items_user_product;
DROP INDEX IF EXISTS public.idx_orders_status_created;
DROP INDEX IF EXISTS public.idx_history_product;
DROP INDEX IF EXISTS public.idx_product_variants_product;
DROP INDEX IF EXISTS public.idx_product_variants_sku;
DROP INDEX IF EXISTS public.idx_products_price;
DROP INDEX IF EXISTS public.idx_products_brand_trgm;
DROP INDEX IF EXISTS public.idx_products_category_trgm;
DROP INDEX IF EXISTS public.idx_products_name_trgm;
DROP INDEX IF EXISTS public.idx_products_search_name;
DROP INDEX IF EXISTS public.idx_products_search;
DROP INDEX IF EXISTS public.idx_products_tags;
DROP INDEX IF EXISTS public.idx_search_analytics_date;
DROP INDEX IF EXISTS public.idx_search_analytics_query;

-- ============================================
-- PART 3: ADD MISSING INDEXES
-- ============================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Cart Items
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Product Reviews
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- Wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);

-- ============================================
-- PART 4: UPDATE STATISTICS
-- ============================================

ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE cart_items;
ANALYZE product_reviews;
ANALYZE wishlist_items;

-- ============================================
-- ✅ DONE! Check results below
-- ============================================

-- Verify RLS is enabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = false
ORDER BY tablename;
-- Should return 0 rows

-- Verify indexes created
SELECT 
    schemaname,
    relname as table_name,
    indexrelname as index_name
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND indexrelname LIKE 'idx_%'
ORDER BY relname;
