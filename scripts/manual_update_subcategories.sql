-- Update T-Shirts (remove the empty array check)
UPDATE products 
SET subcategories = ARRAY['T-Shirt']
WHERE name ILIKE '%t-shirt%' OR name ILIKE '%tshirt%';

-- Update Shirts
UPDATE products 
SET subcategories = ARRAY['Shirt']
WHERE name ILIKE '%shirt%' AND name NOT ILIKE '%t-shirt%' AND name NOT ILIKE '%tshirt%';

-- Update Jeans
UPDATE products 
SET subcategories = ARRAY['Jeans']
WHERE name ILIKE '%jeans%';

-- Update Trousers
UPDATE products 
SET subcategories = ARRAY['Trouser']
WHERE name ILIKE '%trouser%' OR name ILIKE '%pant%';

-- Update Jackets
UPDATE products 
SET subcategories = ARRAY['Jacket']
WHERE name ILIKE '%jacket%';

-- Update Tops
UPDATE products 
SET subcategories = ARRAY['Top']
WHERE name ILIKE '%top%';

-- Update Kurtis
UPDATE products 
SET subcategories = ARRAY['Kurti']
WHERE name ILIKE '%kurti%';

-- Update Dresses
UPDATE products 
SET subcategories = ARRAY['Dress']
WHERE name ILIKE '%dress%';

-- Update Skirts
UPDATE products 
SET subcategories = ARRAY['Skirt']
WHERE name ILIKE '%skirt%';

-- Verify
SELECT name, subcategories FROM products ORDER BY name;
