-- Add size_stocks column to products table for simple size stock management
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_stocks JSONB;

-- Update existing products with size_stocks if they have available_sizes
UPDATE products 
SET size_stocks = (
  SELECT jsonb_object_agg(size, 0)
  FROM unnest(available_sizes) AS size
)
WHERE available_sizes IS NOT NULL AND array_length(available_sizes, 1) > 0 AND size_stocks IS NULL;