-- Enhanced Products Schema for Advanced Filtering
-- Migration: 20250122_enhanced_products_schema.sql

BEGIN;

-- Add new columns for filtering (if not exists)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS subcategories TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS popularity INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs for existing products
UPDATE products 
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- B-tree indexes for common filters
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- GIN indexes for array and JSONB columns
CREATE INDEX IF NOT EXISTS idx_products_subcategories ON products USING GIN(subcategories);
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN(sizes);
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN(colors);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_variants ON products USING GIN(variants);

-- Full-text search index (fallback)
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_products_search 
ON products USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- Update existing rows
UPDATE products SET search_vector = 
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B')
WHERE search_vector IS NULL;

COMMIT;
