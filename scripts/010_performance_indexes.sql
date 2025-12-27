-- Performance Optimization Indexes
-- Run this in Supabase SQL Editor

-- Orders indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
  ON orders(user_id, status);

CREATE INDEX IF NOT EXISTS idx_orders_created_desc 
  ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
  ON orders(payment_status) WHERE payment_status = 'paid';

-- Products indexes for search and filtering
CREATE INDEX IF NOT EXISTS idx_products_category_active 
  ON products(category, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_price 
  ON products(price) WHERE is_active = true;

-- Full-text search for products
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
  ON products USING gin(name gin_trgm_ops);

-- Wishlist indexes (skip if table doesn't exist)
-- CREATE INDEX IF NOT EXISTS idx_wishlist_user_product 
--   ON wishlist(user_id, product_id);

-- CREATE INDEX IF NOT EXISTS idx_wishlist_user_created 
--   ON wishlist(user_id, created_at DESC);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_user 
  ON cart_items(user_id);

CREATE INDEX IF NOT EXISTS idx_cart_user_product 
  ON cart_items(user_id, product_id);

-- Order items for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order 
  ON order_items(order_id);

-- Addresses for user lookup
CREATE INDEX IF NOT EXISTS idx_addresses_user_default 
  ON addresses(user_id, is_default);

-- Notifications for unread count (skip if table doesn't exist)
-- CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
--   ON notifications(user_id, read) WHERE read = false;

-- Audit logs for admin panel (skip if table doesn't exist)
-- CREATE INDEX IF NOT EXISTS idx_audit_logs_created 
--   ON audit_logs(created_at DESC);

-- Analyze tables after creating indexes
ANALYZE orders;
ANALYZE products;
ANALYZE cart_items;
ANALYZE order_items;
