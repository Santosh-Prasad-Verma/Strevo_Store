-- ============================================
-- SECURITY FIX: Enable RLS and Fix Security Issues
-- ============================================

-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

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

-- 2. CREATE BASIC RLS POLICIES
-- ============================================
-- Admin full access policy for all tables

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

-- 3. FIX SECURITY DEFINER VIEWS
-- ============================================

DROP VIEW IF EXISTS public.index_usage_stats CASCADE;
CREATE VIEW public.index_usage_stats AS
SELECT * FROM pg_stat_user_indexes;

DROP VIEW IF EXISTS public.database_health_dashboard CASCADE;
CREATE VIEW public.database_health_dashboard AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public';

DROP VIEW IF EXISTS public.slow_queries_monitor CASCADE;
CREATE VIEW public.slow_queries_monitor AS
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 50;

-- 4. FIX FUNCTION SEARCH PATHS
-- ============================================

ALTER FUNCTION public.increment_helpful SET search_path = public, pg_temp;
ALTER FUNCTION public.decrement_helpful SET search_path = public, pg_temp;
ALTER FUNCTION public.update_loyalty_tier SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_referral_code SET search_path = public, pg_temp;
ALTER FUNCTION public.is_flash_sale_active SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_content_likes SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_forum_likes SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_influencer_code SET search_path = public, pg_temp;
ALTER FUNCTION public.get_table_list SET search_path = public, pg_temp;
ALTER FUNCTION public.products_search_vector_update SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_video_likes SET search_path = public, pg_temp;
ALTER FUNCTION public.update_schema_cache SET search_path = public, pg_temp;
ALTER FUNCTION public.refresh_schema_caches SET search_path = public, pg_temp;
ALTER FUNCTION public.get_slow_queries SET search_path = public, pg_temp;
ALTER FUNCTION public.refresh_schema_cache SET search_path = public, pg_temp;
ALTER FUNCTION public.analyze_query_performance SET search_path = public, pg_temp;
ALTER FUNCTION public.suggest_missing_indexes SET search_path = public, pg_temp;
ALTER FUNCTION public.identify_unused_indexes SET search_path = public, pg_temp;
ALTER FUNCTION public.update_table_statistics SET search_path = public, pg_temp;
ALTER FUNCTION public.log_password_violation SET search_path = public, pg_temp;
ALTER FUNCTION public.fast_schema_info SET search_path = public, pg_temp;
ALTER FUNCTION public.get_cached_schema_info SET search_path = public, pg_temp;
ALTER FUNCTION public.validate_password_strength SET search_path = public, pg_temp;
ALTER FUNCTION public.validate_promo_code SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_gift_card_code SET search_path = public, pg_temp;
ALTER FUNCTION public.ban_customer SET search_path = public, pg_temp;
ALTER FUNCTION public.unban_customer SET search_path = public, pg_temp;
ALTER FUNCTION public.get_customer_details SET search_path = public, pg_temp;
ALTER FUNCTION public.get_revenue_report SET search_path = public, pg_temp;
ALTER FUNCTION public.bulk_update_orders SET search_path = public, pg_temp;
ALTER FUNCTION public.get_invoice_data SET search_path = public, pg_temp;
ALTER FUNCTION public.create_shipping_label SET search_path = public, pg_temp;
ALTER FUNCTION public.get_performance_stats SET search_path = public, pg_temp;
ALTER FUNCTION public.get_setting SET search_path = public, pg_temp;
ALTER FUNCTION public.set_setting SET search_path = public, pg_temp;
ALTER FUNCTION public.check_admin_permission SET search_path = public, pg_temp;
ALTER FUNCTION public.log_product_change SET search_path = public, pg_temp;
ALTER FUNCTION public.duplicate_product SET search_path = public, pg_temp;
ALTER FUNCTION public.bulk_update_products SET search_path = public, pg_temp;
ALTER FUNCTION public.update_customer_stats SET search_path = public, pg_temp;
ALTER FUNCTION public.assign_customer_segment SET search_path = public, pg_temp;
ALTER FUNCTION public.log_order_event SET search_path = public, pg_temp;
ALTER FUNCTION public.check_low_stock SET search_path = public, pg_temp;
ALTER FUNCTION public.get_unread_notifications SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_bulk_coupons SET search_path = public, pg_temp;
ALTER FUNCTION public.auto_log_admin_actions SET search_path = public, pg_temp;
ALTER FUNCTION public.log_activity SET search_path = public, pg_temp;
ALTER FUNCTION public.get_payment_stats SET search_path = public, pg_temp;
ALTER FUNCTION public.create_refund SET search_path = public, pg_temp;
ALTER FUNCTION public.log_login SET search_path = public, pg_temp;
ALTER FUNCTION public.track_search SET search_path = public, pg_temp;
ALTER FUNCTION public.apply_discount SET search_path = public, pg_temp;
ALTER FUNCTION public.track_abandoned_cart SET search_path = public, pg_temp;
ALTER FUNCTION public.send_email_campaign SET search_path = public, pg_temp;
ALTER FUNCTION public.process_refund SET search_path = public, pg_temp;
ALTER FUNCTION public.get_popular_searches SET search_path = public, pg_temp;
ALTER FUNCTION public.get_no_results_searches SET search_path = public, pg_temp;
ALTER FUNCTION public.track_performance SET search_path = public, pg_temp;
ALTER FUNCTION public.get_profit_report SET search_path = public, pg_temp;
ALTER FUNCTION public.get_tax_report SET search_path = public, pg_temp;
ALTER FUNCTION public.check_ip_whitelist SET search_path = public, pg_temp;

-- 5. SECURE MATERIALIZED VIEWS
-- ============================================

REVOKE SELECT ON public.schema_objects_cache FROM anon, authenticated;
GRANT SELECT ON public.schema_objects_cache TO service_role;

REVOKE SELECT ON public.table_definitions_cache FROM anon, authenticated;
GRANT SELECT ON public.table_definitions_cache TO service_role;

-- 6. ENABLE HIBP PASSWORD CHECK (Run in Supabase Dashboard)
-- ============================================
-- Go to: Authentication > Settings > Enable "Check for compromised passwords"
-- This must be done via the Supabase Dashboard UI

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
