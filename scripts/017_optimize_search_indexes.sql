-- Optimize search performance with GIN indexes for text search
CREATE INDEX IF NOT EXISTS idx_products_name_gin ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_gin ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_brand_gin ON products USING gin(to_tsvector('english', brand));
CREATE INDEX IF NOT EXISTS idx_products_category_gin ON products USING gin(to_tsvector('english', category));

-- Add trigram indexes for faster ILIKE queries (fallback)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm ON products USING gin(brand gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_category_trgm ON products USING gin(category gin_trgm_ops);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_active_price ON products(is_active, price) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(is_active, category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_active_brand ON products(is_active, brand) WHERE is_active = true;
