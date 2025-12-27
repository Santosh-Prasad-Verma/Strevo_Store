-- Check actual columns in key tables
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('products', 'orders', 'cart_items', 'order_items', 'product_reviews', 'wishlist_items')
ORDER BY table_name, ordinal_position;
