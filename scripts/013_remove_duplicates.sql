-- Step 1: Find duplicate products by name
SELECT name, COUNT(*) as count, array_agg(id) as ids
FROM products
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Step 2: Remove duplicates (keeps oldest by ID)
DELETE FROM products a
USING products b
WHERE a.id > b.id
  AND a.name = b.name;

-- Step 3: Verify no duplicates remain
SELECT name, COUNT(*) as count
FROM products
GROUP BY name
HAVING COUNT(*) > 1;
