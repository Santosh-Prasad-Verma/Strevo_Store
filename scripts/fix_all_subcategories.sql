-- Update all products with correct subcategories matching menu-data.ts

-- T-Shirts (with 's')
UPDATE products 
SET subcategories = ARRAY['T-Shirts']
WHERE name ILIKE '%t-shirt%' OR name ILIKE '%tshirt%';

-- Shirts
UPDATE products 
SET subcategories = ARRAY['Shirt']
WHERE name ILIKE '%shirt%' AND name NOT ILIKE '%t-shirt%' AND name NOT ILIKE '%tshirt%';

-- Jeans
UPDATE products 
SET subcategories = ARRAY['Jeans']
WHERE name ILIKE '%jeans%';

-- Trousers
UPDATE products 
SET subcategories = ARRAY['Trouser']
WHERE name ILIKE '%trouser%' OR name ILIKE '%pant%';

-- Jackets
UPDATE products 
SET subcategories = ARRAY['Jacket']
WHERE name ILIKE '%jacket%';

-- Tops (with 's')
UPDATE products 
SET subcategories = ARRAY['Tops']
WHERE name ILIKE '%top%';

-- Kurtis
UPDATE products 
SET subcategories = ARRAY['Kurti']
WHERE name ILIKE '%kurti%';

-- Dresses
UPDATE products 
SET subcategories = ARRAY['Dress']
WHERE name ILIKE '%dress%';

-- Skirts
UPDATE products 
SET subcategories = ARRAY['Skirt']
WHERE name ILIKE '%skirt%';

-- Watches
UPDATE products 
SET subcategories = ARRAY['Watch']
WHERE name ILIKE '%watch%';

-- Belts
UPDATE products 
SET subcategories = ARRAY['Belt']
WHERE name ILIKE '%belt%';

-- Wallets
UPDATE products 
SET subcategories = ARRAY['Wallet']
WHERE name ILIKE '%wallet%';

-- Sunglasses
UPDATE products 
SET subcategories = ARRAY['Sunglass']
WHERE name ILIKE '%sunglass%' OR name ILIKE '%sunglasses%';

-- Bags
UPDATE products 
SET subcategories = ARRAY['Bag']
WHERE name ILIKE '%bag%';

-- Jewellery
UPDATE products 
SET subcategories = ARRAY['Jewellery']
WHERE name ILIKE '%jewellery%' OR name ILIKE '%jewelry%';

-- Verify the updates
SELECT name, subcategories FROM products ORDER BY name;
