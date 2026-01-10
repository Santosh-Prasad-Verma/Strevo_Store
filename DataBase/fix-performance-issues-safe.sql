-- ============================================
-- PERFORMANCE FIX: Optimize RLS Policies (Safe Version)
-- ============================================
-- This version only fixes existing policies without assuming column names

-- 1. FIX EXISTING RLS POLICIES - Replace auth.uid() with (SELECT auth.uid())
-- ============================================

-- Products table - Admin policies
DO $$
BEGIN
    -- Drop duplicate admin policies
    DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
    DROP POLICY IF EXISTS "Admins can update products" ON public.products;
    DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
    DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
    DROP POLICY IF EXISTS "Admin can update products" ON public.products;
    DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
    
    -- Create optimized policy
    CREATE POLICY "Admin can manage products" ON public.products FOR ALL
    USING ((SELECT auth.jwt()->>'role') = 'admin');
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Products policies: %', SQLERRM;
END $$;

-- Product Images
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
    CREATE POLICY "Admin manage images" ON public.product_images FOR ALL
    USING ((SELECT auth.jwt()->>'role') = 'admin');
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Product images policies: %', SQLERRM;
END $$;

-- Profiles (check for id or user_id column)
DO $$
DECLARE
    col_name text;
BEGIN
    -- Find the correct column name
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'profiles'
      AND column_name IN ('user_id', 'id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        EXECUTE format('CREATE POLICY "Users own profile" ON public.profiles FOR ALL USING (%I = (SELECT auth.uid()))', col_name);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Profiles policies: %', SQLERRM;
END $$;

-- Addresses
DO $$
DECLARE
    col_name text;
BEGIN
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'addresses'
      AND column_name IN ('user_id', 'profile_id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
        EXECUTE format('CREATE POLICY "Users own addresses" ON public.addresses FOR ALL USING (%I = (SELECT auth.uid()))', col_name);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Addresses policies: %', SQLERRM;
END $$;

-- Cart Items
DO $$
DECLARE
    col_name text;
BEGIN
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'cart_items'
      AND column_name IN ('user_id', 'profile_id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can add to their cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can update their cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can remove from their cart" ON public.cart_items;
        EXECUTE format('CREATE POLICY "Users own cart" ON public.cart_items FOR ALL USING (%I = (SELECT auth.uid()))', col_name);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Cart items policies: %', SQLERRM;
END $$;

-- Orders
DO $$
DECLARE
    col_name text;
BEGIN
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'orders'
      AND column_name IN ('user_id', 'profile_id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
        DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
        
        EXECUTE format('CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (%I = (SELECT auth.uid()) OR (SELECT auth.jwt()->>''role'') = ''admin'')', col_name);
        EXECUTE format('CREATE POLICY "Users create orders" ON public.orders FOR INSERT WITH CHECK (%I = (SELECT auth.uid()))', col_name);
        CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING ((SELECT auth.jwt()->>'role') = 'admin');
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Orders policies: %', SQLERRM;
END $$;

-- Order Items
DO $$
DECLARE
    col_name text;
BEGIN
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'orders'
      AND column_name IN ('user_id', 'profile_id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
        DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
        DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
        
        EXECUTE format('CREATE POLICY "View order items" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.%I = (SELECT auth.uid()) OR (SELECT auth.jwt()->>''role'') = ''admin'')))', col_name);
        EXECUTE format('CREATE POLICY "Create order items" ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.%I = (SELECT auth.uid())))', col_name);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Order items policies: %', SQLERRM;
END $$;

-- Product Reviews
DO $$
DECLARE
    col_name text;
BEGIN
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'product_reviews'
      AND column_name IN ('user_id', 'profile_id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can create reviews" ON public.product_reviews;
        DROP POLICY IF EXISTS "Users can update their own reviews" ON public.product_reviews;
        DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.product_reviews;
        EXECUTE format('CREATE POLICY "Users manage reviews" ON public.product_reviews FOR ALL USING (%I = (SELECT auth.uid()))', col_name);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Product reviews policies: %', SQLERRM;
END $$;

-- Wishlist Items
DO $$
DECLARE
    col_name text;
BEGIN
    SELECT column_name INTO col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'wishlist_items'
      AND column_name IN ('user_id', 'profile_id')
    LIMIT 1;
    
    IF col_name IS NOT NULL THEN
        DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can add to their wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can remove from their wishlist" ON public.wishlist_items;
        EXECUTE format('CREATE POLICY "Users own wishlist" ON public.wishlist_items FOR ALL USING (%I = (SELECT auth.uid()))', col_name);
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Wishlist items policies: %', SQLERRM;
END $$;

-- Admin-only tables (no user_id needed)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins can read audit logs" ON public.audit_logs;
    DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_logs;
    CREATE POLICY "Admin audit logs" ON public.audit_logs FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can manage vendors" ON public.vendors;
    CREATE POLICY "Admin manage vendors" ON public.vendors FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
    CREATE POLICY "Admin manage homepage" ON public.homepage_content FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can view password violations" ON public.password_policy_violations;
    CREATE POLICY "Admin view violations" ON public.password_policy_violations FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can update schema cache" ON public.schema_cache;
    CREATE POLICY "Admin schema cache" ON public.schema_cache FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can view all logs" ON public.admin_logs;
    CREATE POLICY "Admin view logs" ON public.admin_logs FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can manage variants" ON public.product_variants;
    CREATE POLICY "Admin manage variants" ON public.product_variants FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can view history" ON public.product_history;
    CREATE POLICY "Admin view history" ON public.product_history FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can manage notes" ON public.customer_notes;
    CREATE POLICY "Admin manage notes" ON public.customer_notes FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can view activity" ON public.customer_activity;
    CREATE POLICY "Admin view activity" ON public.customer_activity FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can manage events" ON public.order_events;
    CREATE POLICY "Admin manage events" ON public.order_events FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins can manage labels" ON public.shipping_labels;
    CREATE POLICY "Admin manage labels" ON public.shipping_labels FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
    CREATE POLICY "Admin notifications" ON public.notifications FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage alerts" ON public.alert_settings;
    CREATE POLICY "Admin alerts" ON public.alert_settings FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage discounts" ON public.discounts;
    CREATE POLICY "Admin discounts" ON public.discounts FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage campaigns" ON public.email_campaigns;
    CREATE POLICY "Admin campaigns" ON public.email_campaigns FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage sms" ON public.sms_campaigns;
    CREATE POLICY "Admin sms" ON public.sms_campaigns FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage refunds" ON public.refunds;
    CREATE POLICY "Admin refunds" ON public.refunds FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage costs" ON public.product_costs;
    CREATE POLICY "Admin costs" ON public.product_costs FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins view transactions" ON public.payment_transactions;
    CREATE POLICY "Admin transactions" ON public.payment_transactions FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Super admins manage roles" ON public.admin_roles;
    CREATE POLICY "Super admin roles" ON public.admin_roles FOR ALL USING ((SELECT auth.jwt()->>'role') = 'super_admin');
    
    DROP POLICY IF EXISTS "Admins view activity logs" ON public.activity_logs;
    CREATE POLICY "Admin activity" ON public.activity_logs FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins view login history" ON public.login_history;
    CREATE POLICY "Admin login history" ON public.login_history FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Super admins manage whitelist" ON public.ip_whitelist;
    CREATE POLICY "Super admin whitelist" ON public.ip_whitelist FOR ALL USING ((SELECT auth.jwt()->>'role') = 'super_admin');
    
    DROP POLICY IF EXISTS "Admins view search analytics" ON public.search_analytics;
    CREATE POLICY "Admin search analytics" ON public.search_analytics FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins view performance" ON public.performance_metrics;
    CREATE POLICY "Admin performance" ON public.performance_metrics FOR SELECT USING ((SELECT auth.jwt()->>'role') = 'admin');
    
    DROP POLICY IF EXISTS "Admins manage settings" ON public.system_settings;
    CREATE POLICY "Admin settings" ON public.system_settings FOR ALL USING ((SELECT auth.jwt()->>'role') = 'admin');
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Admin policies: %', SQLERRM;
END $$;

-- 2. REMOVE DUPLICATE INDEXES
-- ============================================

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

-- Run ANALYZE to update statistics
ANALYZE;
