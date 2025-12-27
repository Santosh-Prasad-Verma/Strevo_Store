-- See all products with their IDs and prices
SELECT id, name, price, category, created_at
FROM products
ORDER BY name, price;

-- Count total products
SELECT COUNT(*) as total_products FROM products;

-- Find products with similar names (case-insensitive)
SELECT LOWER(TRIM(name)) as normalized_name, COUNT(*) as count, array_agg(id) as ids, array_agg(price) as prices
FROM products
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Option 1: Keep OLDEST product (lowest ID)
DELETE FROM products
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)) ORDER BY id ASC) as rn
    FROM products
  ) t
  WHERE rn > 1
);

-- Option 2: Keep CHEAPEST product
-- DELETE FROM products
-- WHERE id IN (
--   SELECT id
--   FROM (
--     SELECT id,
--            ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)) ORDER BY price ASC, id ASC) as rn
--     FROM products
--   ) t
--   WHERE rn > 1
-- );

-- Option 3: Keep NEWEST product (highest ID)
-- DELETE FROM products
-- WHERE id IN (
--   SELECT id
--   FROM (
--     SELECT id,
--            ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)) ORDER BY id DESC) as rn
--     FROM products
--   ) t
--   WHERE rn > 1
-- );

-- Verify cleanup
SELECT COUNT(*) as remaining_products FROM products;
