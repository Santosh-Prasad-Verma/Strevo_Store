-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add search_vector column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search_vector
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search_vector
DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- Update existing rows
UPDATE products SET search_vector = 
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(brand, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'B');

-- Create GIN index on search_vector
CREATE INDEX IF NOT EXISTS products_search_vector_idx ON products USING GIN(search_vector);

-- Create trigram indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_brand_trgm_idx ON products USING GIN(brand gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_category_trgm_idx ON products USING GIN(category gin_trgm_ops);

-- Create index on tags JSONB
CREATE INDEX IF NOT EXISTS products_tags_idx ON products USING GIN(tags);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  user_id UUID,
  results_count INTEGER NOT NULL DEFAULT 0,
  clicked_product_id UUID,
  filters JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response_time_ms INTEGER,
  source TEXT DEFAULT 'meilisearch'
);

-- Create indexes on search_analytics
CREATE INDEX IF NOT EXISTS search_analytics_query_idx ON search_analytics(query);
CREATE INDEX IF NOT EXISTS search_analytics_created_at_idx ON search_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS search_analytics_user_idx ON search_analytics(user_id);

-- Note: Materialized view and function removed - create after table has data
