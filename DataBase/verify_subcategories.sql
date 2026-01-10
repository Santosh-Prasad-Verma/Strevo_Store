-- Check if T-shirt products have subcategories set
SELECT id, name, subcategories, is_active
FROM products
WHERE name ILIKE '%shirt%'
ORDER BY name;
