-- ============================================
-- ADVANCED SEARCH SYSTEM FOR THRIFT_IND
-- PostgreSQL Full-Text Search + Trigram
-- ============================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- Fuzzy/typo matching
CREATE EXTENSION IF NOT EXISTS unaccent; -- Remove accents

-- 2. Create search configuration with unaccent
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS english_unaccent (COPY = english);
ALTER TEXT SEARCH CONFIGURATION english_unaccent
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, english_stem;

-- 3. Add full-text search column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 4. Create function to update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english_unaccent', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english_unaccent', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english_unaccent', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('english_unaccent', COALESCE(NEW.brand, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to auto-update search vector
DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- 6. Update existing products
UPDATE products SET search_vector = 
  setweight(to_tsvector('english_unaccent', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english_unaccent', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english_unaccent', COALESCE(category, '')), 'C') ||
  setweight(to_tsvector('english_unaccent', COALESCE(brand, '')), 'A');

-- 7. Create GIN indexes for fast search
CREATE INDEX IF NOT EXISTS products_search_vector_idx ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand);

-- 8. Synonym dictionary table
CREATE TABLE IF NOT EXISTS search_synonyms (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  synonyms TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common synonyms
INSERT INTO search_synonyms (word, synonyms) VALUES
  ('tshirt', ARRAY['t-shirt', 'tee', 'top']),
  ('jeans', ARRAY['denim', 'pants', 'trousers']),
  ('sneakers', ARRAY['shoes', 'trainers', 'kicks']),
  ('dress', ARRAY['gown', 'frock']),
  ('jacket', ARRAY['coat', 'blazer']),
  ('shirt', ARRAY['blouse', 'top'])
ON CONFLICT DO NOTHING;

-- 9. Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  clicked_product_id INT REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS search_history_user_idx ON search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS search_history_query_idx ON search_history(query);

-- 10. Popular searches materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_searches AS
SELECT 
  query,
  COUNT(*) as search_count,
  AVG(results_count) as avg_results,
  MAX(created_at) as last_searched
FROM search_history
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY query
HAVING COUNT(*) > 2
ORDER BY search_count DESC
LIMIT 50;

CREATE UNIQUE INDEX IF NOT EXISTS popular_searches_query_idx ON popular_searches(query);

-- 11. Function to refresh popular searches (run daily via cron)
CREATE OR REPLACE FUNCTION refresh_popular_searches() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_searches;
END;
$$ LANGUAGE plpgsql;

-- 12. Advanced search function with ranking
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  limit_count INT DEFAULT 20
)
RETURNS TABLE (
  id INT,
  name TEXT,
  slug TEXT,
  description TEXT,
  price DECIMAL,
  category TEXT,
  brand TEXT,
  image_url TEXT,
  stock_quantity INT,
  relevance_score REAL
) AS $$
DECLARE
  ts_query tsquery;
BEGIN
  -- Convert search query to tsquery
  ts_query := plainto_tsquery('english_unaccent', search_query);
  
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.description,
    p.price,
    p.category,
    p.brand,
    p.image_url,
    p.stock_quantity,
    (
      -- Ranking formula with business logic
      ts_rank_cd(p.search_vector, ts_query, 32) * 10 + -- FTS rank
      CASE WHEN p.name ILIKE '%' || search_query || '%' THEN 5 ELSE 0 END + -- Exact match bonus
      CASE WHEN p.stock_quantity > 0 THEN 3 ELSE 0 END + -- In-stock bonus
      CASE WHEN p.is_featured THEN 2 ELSE 0 END + -- Featured bonus
      similarity(p.name, search_query) * 3 -- Trigram similarity
    )::REAL as relevance_score
  FROM products p
  WHERE 
    (p.search_vector @@ ts_query OR similarity(p.name, search_query) > 0.2)
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  ORDER BY relevance_score DESC, p.stock_quantity DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 13. Autocomplete suggestions function
CREATE OR REPLACE FUNCTION search_suggestions(
  search_query TEXT,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  suggestion TEXT,
  type TEXT,
  match_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Product name suggestions
  SELECT DISTINCT
    p.name as suggestion,
    'product'::TEXT as type,
    CASE 
      WHEN p.name ILIKE search_query || '%' THEN 'prefix'
      WHEN p.name ILIKE '%' || search_query || '%' THEN 'contains'
      ELSE 'fuzzy'
    END as match_type
  FROM products p
  WHERE 
    p.name ILIKE '%' || search_query || '%'
    OR similarity(p.name, search_query) > 0.3
  ORDER BY 
    CASE 
      WHEN p.name ILIKE search_query || '%' THEN 1
      WHEN p.name ILIKE '%' || search_query || '%' THEN 2
      ELSE 3
    END,
    similarity(p.name, search_query) DESC
  LIMIT limit_count / 2
  
  UNION ALL
  
  -- Category suggestions
  SELECT DISTINCT
    p.category as suggestion,
    'category'::TEXT as type,
    'exact'::TEXT as match_type
  FROM products p
  WHERE p.category ILIKE '%' || search_query || '%'
  LIMIT 3
  
  UNION ALL
  
  -- Brand suggestions
  SELECT DISTINCT
    p.brand as suggestion,
    'brand'::TEXT as type,
    'exact'::TEXT as match_type
  FROM products p
  WHERE p.brand ILIKE '%' || search_query || '%'
  LIMIT 2;
END;
$$ LANGUAGE plpgsql;

-- 14. Did you mean function (spell correction)
CREATE OR REPLACE FUNCTION did_you_mean(search_query TEXT)
RETURNS TEXT AS $$
DECLARE
  suggestion TEXT;
BEGIN
  SELECT name INTO suggestion
  FROM products
  WHERE similarity(name, search_query) > 0.4
  ORDER BY similarity(name, search_query) DESC
  LIMIT 1;
  
  RETURN suggestion;
END;
$$ LANGUAGE plpgsql;

-- 15. Grant permissions (adjust for your RLS policies)
-- GRANT SELECT ON products TO anon, authenticated;
-- GRANT SELECT ON popular_searches TO anon, authenticated;
-- GRANT INSERT ON search_history TO authenticated;

COMMENT ON TABLE search_synonyms IS 'Synonym dictionary for search query expansion';
COMMENT ON TABLE search_history IS 'User search analytics and history';
COMMENT ON MATERIALIZED VIEW popular_searches IS 'Top 50 searches in last 30 days';
COMMENT ON FUNCTION search_products IS 'Main search function with ranking and filters';
COMMENT ON FUNCTION search_suggestions IS 'Autocomplete suggestions for search bar';
COMMENT ON FUNCTION did_you_mean IS 'Spell correction suggestions';
