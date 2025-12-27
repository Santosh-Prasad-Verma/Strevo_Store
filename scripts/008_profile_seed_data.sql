-- Seed data for Profile Module
-- Run after 007_profile_module_schema.sql

-- 1. Sample Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, usage_limit, is_active)
VALUES
  ('WELCOME10', 'Welcome offer - 10% off on first order', 'percentage', 10.00, 500.00, 100.00, now(), now() + interval '30 days', 1000, true),
  ('FLAT200', 'Flat ₹200 off on orders above ₹1000', 'fixed', 200.00, 1000.00, 200.00, now(), now() + interval '15 days', 500, true),
  ('SAVE15', '15% off on all products', 'percentage', 15.00, 750.00, 300.00, now(), now() + interval '7 days', 200, true),
  ('FREESHIP', 'Free shipping on orders above ₹500', 'fixed', 50.00, 500.00, 50.00, now(), now() + interval '60 days', 5000, true);

-- Note: User-specific data (notifications, wallet transactions, user_coupons) 
-- will be created dynamically when users interact with the system
