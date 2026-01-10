-- ============================================
-- PERFORMANCE FIX: Optimize RLS Policies & Remove Duplicate Indexes
-- ============================================

-- 1. FIX RLS POLICIES - Replace auth.uid() with (SELECT auth.uid())
-- ============================================

-- Products table
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;

CREATE POLICY "Admin can manage products" ON public.products FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Product Images
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admin manage images" ON public.product_images FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users own profile" ON public.profiles FOR ALL
USING (user_id = (SELECT auth.uid()));

-- Addresses
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
CREATE POLICY "Users own addresses" ON public.addresses FOR ALL
USING (user_id = (SELECT auth.uid()));

-- Cart Items
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can add to their cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can remove from their cart" ON public.cart_items;
CREATE POLICY "Users own cart" ON public.cart_items FOR ALL
USING (user_id = (SELECT auth.uid()));

-- Orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT
USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()->>'role') = 'admin');
CREATE POLICY "Users create orders" ON public.orders FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Order Items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
CREATE POLICY "View order items" ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND (orders.user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()->>'role') = 'admin')
  )
);
CREATE POLICY "Create order items" ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = (SELECT auth.uid()))
);

-- Product Reviews
DROP POLICY IF EXISTS "Users can create reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.product_reviews;
CREATE POLICY "Users manage reviews" ON public.product_reviews FOR ALL
USING (user_id = (SELECT auth.uid()));

-- Wishlist Items
DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can add to their wishlist" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can remove from their wishlist" ON public.wishlist_items;
CREATE POLICY "Users own wishlist" ON public.wishlist_items FOR ALL
USING (user_id = (SELECT auth.uid()));

-- Audit Logs
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_logs;
CREATE POLICY "Admin audit logs" ON public.audit_logs FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Vendors
DROP POLICY IF EXISTS "Admins can manage vendors" ON public.vendors;
CREATE POLICY "Admin manage vendors" ON public.vendors FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Homepage Content
DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admin manage homepage" ON public.homepage_content FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Password Policy Violations
DROP POLICY IF EXISTS "Admins can view password violations" ON public.password_policy_violations;
CREATE POLICY "Admin view violations" ON public.password_policy_violations FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Schema Cache
DROP POLICY IF EXISTS "Admins can update schema cache" ON public.schema_cache;
CREATE POLICY "Admin schema cache" ON public.schema_cache FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Admin Logs
DROP POLICY IF EXISTS "Admins can view all logs" ON public.admin_logs;
CREATE POLICY "Admin view logs" ON public.admin_logs FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Product Variants
DROP POLICY IF EXISTS "Admins can manage variants" ON public.product_variants;
CREATE POLICY "Admin manage variants" ON public.product_variants FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Product History
DROP POLICY IF EXISTS "Admins can view history" ON public.product_history;
CREATE POLICY "Admin view history" ON public.product_history FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Bulk Upload Jobs
DROP POLICY IF EXISTS "Users can view own jobs" ON public.bulk_upload_jobs;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.bulk_upload_jobs;
CREATE POLICY "View upload jobs" ON public.bulk_upload_jobs FOR SELECT
USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()->>'role') = 'admin');

-- Customer Notes
DROP POLICY IF EXISTS "Admins can manage notes" ON public.customer_notes;
CREATE POLICY "Admin manage notes" ON public.customer_notes FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Customer Activity
DROP POLICY IF EXISTS "Admins can view activity" ON public.customer_activity;
CREATE POLICY "Admin view activity" ON public.customer_activity FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Order Events
DROP POLICY IF EXISTS "Admins can manage events" ON public.order_events;
CREATE POLICY "Admin manage events" ON public.order_events FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Shipping Labels
DROP POLICY IF EXISTS "Admins can manage labels" ON public.shipping_labels;
CREATE POLICY "Admin manage labels" ON public.shipping_labels FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Notifications
DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
CREATE POLICY "Admin notifications" ON public.notifications FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Alert Settings
DROP POLICY IF EXISTS "Admins manage alerts" ON public.alert_settings;
CREATE POLICY "Admin alerts" ON public.alert_settings FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Discounts
DROP POLICY IF EXISTS "Admins manage discounts" ON public.discounts;
CREATE POLICY "Admin discounts" ON public.discounts FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Coupons
DROP POLICY IF EXISTS "Users view own coupons" ON public.coupons;
CREATE POLICY "Users coupons" ON public.coupons FOR SELECT
USING (user_id = (SELECT auth.uid()));

-- Email Campaigns
DROP POLICY IF EXISTS "Admins manage campaigns" ON public.email_campaigns;
CREATE POLICY "Admin campaigns" ON public.email_campaigns FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- SMS Campaigns
DROP POLICY IF EXISTS "Admins manage sms" ON public.sms_campaigns;
CREATE POLICY "Admin sms" ON public.sms_campaigns FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Abandoned Carts
DROP POLICY IF EXISTS "Users view own carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Admins manage carts" ON public.abandoned_carts;
CREATE POLICY "View abandoned carts" ON public.abandoned_carts FOR SELECT
USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()->>'role') = 'admin');

-- Refunds
DROP POLICY IF EXISTS "Admins manage refunds" ON public.refunds;
CREATE POLICY "Admin refunds" ON public.refunds FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Product Costs
DROP POLICY IF EXISTS "Admins manage costs" ON public.product_costs;
CREATE POLICY "Admin costs" ON public.product_costs FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Payment Transactions
DROP POLICY IF EXISTS "Admins view transactions" ON public.payment_transactions;
CREATE POLICY "Admin transactions" ON public.payment_transactions FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Admin Roles
DROP POLICY IF EXISTS "Super admins manage roles" ON public.admin_roles;
CREATE POLICY "Super admin roles" ON public.admin_roles FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'super_admin');

-- Activity Logs
DROP POLICY IF EXISTS "Admins view activity logs" ON public.activity_logs;
CREATE POLICY "Admin activity" ON public.activity_logs FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Login History
DROP POLICY IF EXISTS "Admins view login history" ON public.login_history;
CREATE POLICY "Admin login history" ON public.login_history FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- IP Whitelist
DROP POLICY IF EXISTS "Super admins manage whitelist" ON public.ip_whitelist;
CREATE POLICY "Super admin whitelist" ON public.ip_whitelist FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'super_admin');

-- Search Analytics
DROP POLICY IF EXISTS "Admins view search analytics" ON public.search_analytics;
CREATE POLICY "Admin search analytics" ON public.search_analytics FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- Performance Metrics
DROP POLICY IF EXISTS "Admins view performance" ON public.performance_metrics;
CREATE POLICY "Admin performance" ON public.performance_metrics FOR SELECT
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- System Settings
DROP POLICY IF EXISTS "Admins manage settings" ON public.system_settings;
CREATE POLICY "Admin settings" ON public.system_settings FOR ALL
USING ((SELECT auth.jwt()->>'role') = 'admin');

-- 2. REMOVE DUPLICATE INDEXES
-- ============================================

-- Cart Items
DROP INDEX IF EXISTS public.idx_cart_items_user;
DROP INDEX IF EXISTS public.idx_cart_items_user_product;

-- Orders
DROP INDEX IF EXISTS public.idx_orders_status_created;

-- Product History
DROP INDEX IF EXISTS public.idx_history_product;

-- Product Variants
DROP INDEX IF EXISTS public.idx_product_variants_product;
DROP INDEX IF EXISTS public.idx_product_variants_sku;

-- Products
DROP INDEX IF EXISTS public.idx_products_price;
DROP INDEX IF EXISTS public.idx_products_brand_trgm;
DROP INDEX IF EXISTS public.idx_products_category_trgm;
DROP INDEX IF EXISTS public.idx_products_name_trgm;
DROP INDEX IF EXISTS public.idx_products_search_name;
DROP INDEX IF EXISTS public.idx_products_search;
DROP INDEX IF EXISTS public.idx_products_tags;

-- Search Analytics
DROP INDEX IF EXISTS public.idx_search_analytics_date;
DROP INDEX IF EXISTS public.idx_search_analytics_query;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check for remaining duplicate policies
SELECT 
    schemaname,
    tablename,
    array_agg(policyname) as policies,
    cmd,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename, cmd, roles
HAVING COUNT(*) > 1
ORDER BY tablename;
