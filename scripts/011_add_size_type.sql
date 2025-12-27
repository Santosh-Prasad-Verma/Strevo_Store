-- Add size_type column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_type TEXT DEFAULT 'clothing' 
  CHECK (size_type IN ('clothing', 'shoes', 'onesize', 'none'));

-- Add available_sizes column
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_sizes TEXT[];

-- Update existing products
UPDATE products SET size_type = 'clothing', available_sizes = ARRAY['S', 'M', 'L', 'XL'] WHERE size_type IS NULL;
