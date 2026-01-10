-- Add indexes for faster search queries
-- Run this in Supabase SQL Editor

-- Index for name search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

-- Index for brand search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm ON products USING gin (brand gin_trgm_ops);

-- Index for active products
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active) WHERE is_active = true;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_products_active_name ON products (is_active, name) WHERE is_active = true;

-- Enable pg_trgm extension for fuzzy search (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verify indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'products'
ORDER BY indexname;
