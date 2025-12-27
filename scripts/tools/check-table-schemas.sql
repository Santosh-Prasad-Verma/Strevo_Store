-- Check column names for all tables with RLS policies
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'addresses', 'cart_items', 'orders', 'order_items',
    'product_reviews', 'wishlist_items', 'bulk_upload_jobs', 'coupons',
    'abandoned_carts'
  )
  AND column_name LIKE '%user%' OR column_name LIKE '%id'
ORDER BY table_name, ordinal_position;
