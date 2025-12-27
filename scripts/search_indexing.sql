-- =============================================================================
-- Strevo Search Indexing SQL
-- Fast Postgres-first typeahead with pg_trgm + tsvector fallbacks
-- =============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Add search_vector column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 3. Update search_vector for all products
UPDATE products SET search_vector = 
  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(brand, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(description, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(category, '')), 'D');

-- 4. Create indexes for fast search
-- Trigram index on name for fuzzy matching
CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
  ON products USING GIN (name gin_trgm_ops);

-- Trigram index on brand
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm 
  ON products USING GIN (brand gin_trgm_ops);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search_vector 
  ON products USING GIN (search_vector);

-- Composite index for active products sorted by popularity
CREATE INDEX IF NOT EXISTS idx_products_active_popular 
  ON products (is_active, stock_quantity DESC, created_at DESC) 
  WHERE is_active = true;

-- 5. Create trigger to auto-update search_vector
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(NEW.category, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE OF name, brand, description, category
  ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- 6. Create materialized view for fast suggestions
DROP MATERIALIZED VIEW IF EXISTS product_suggestions CASCADE;

CREATE MATERIALIZED VIEW product_suggestions AS
SELECT
  p.id,
  p.name AS title,
  p.id AS slug, -- Using id as slug since slug column may not exist
  p.price,
  p.image_url AS thumbnail_url,
  COALESCE(p.stock_quantity, 0) AS popularity_score,
  -- Normalized title for prefix matching
  lower(regexp_replace(
    regexp_replace(p.name, '[-_]', ' ', 'g'),
    '[^a-z0-9\s]', '', 'g'
  )) AS title_norm,
  -- Also store brand normalized
  lower(coalesce(p.brand, '')) AS brand_norm,
  p.category
FROM products p
WHERE p.is_active = true
ORDER BY COALESCE(p.stock_quantity, 0) DESC, p.created_at DESC;

-- 7. Create indexes on materialized view
CREATE UNIQUE INDEX idx_product_suggestions_id 
  ON product_suggestions(id);

CREATE INDEX idx_product_suggestions_title_norm_trgm 
  ON product_suggestions USING GIN (title_norm gin_trgm_ops);

CREATE INDEX idx_product_suggestions_title_norm_prefix 
  ON product_suggestions (title_norm text_pattern_ops);

CREATE INDEX idx_product_suggestions_popularity 
  ON product_suggestions(popularity_score DESC);

-- 8. Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_product_suggestions()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_suggestions;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger to notify when products change (for async refresh)
CREATE OR REPLACE FUNCTION notify_product_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('product_changed', TG_OP);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_notify_trigger ON products;
CREATE TRIGGER products_notify_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH STATEMENT
  EXECUTE FUNCTION notify_product_change();

-- 10. Initial refresh
REFRESH MATERIALIZED VIEW product_suggestions;

-- =============================================================================
-- QUERY PATTERNS (for reference - used in API)
-- =============================================================================

-- Pattern 1: Fast prefix match on materialized view
-- SELECT id, title, slug, price, thumbnail_url, popularity_score
-- FROM product_suggestions
-- WHERE title_norm LIKE $1 || '%'
-- ORDER BY popularity_score DESC
-- LIMIT $2;

-- Pattern 2: Trigram similarity fallback
-- SELECT id, title, slug, price, thumbnail_url, similarity(title_norm, $1) AS sim
-- FROM product_suggestions
-- WHERE similarity(title_norm, $1) > 0.15
-- ORDER BY sim DESC, popularity_score DESC
-- LIMIT $2;

-- Pattern 3: Full-text search fallback (on products table)
-- SELECT id, name AS title, id AS slug, price, image_url AS thumbnail_url,
--        ts_rank(search_vector, websearch_to_tsquery('simple', $1)) AS rank
-- FROM products
-- WHERE is_active = true AND search_vector @@ websearch_to_tsquery('simple', $1)
-- ORDER BY rank DESC, stock_quantity DESC
-- LIMIT $2;

-- =============================================================================
-- ROLLBACK STATEMENTS
-- =============================================================================
-- DROP TRIGGER IF EXISTS products_notify_trigger ON products;
-- DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
-- DROP FUNCTION IF EXISTS notify_product_change();
-- DROP FUNCTION IF EXISTS refresh_product_suggestions();
-- DROP FUNCTION IF EXISTS products_search_vector_update();
-- DROP MATERIALIZED VIEW IF EXISTS product_suggestions;
-- DROP INDEX IF EXISTS idx_products_name_trgm;
-- DROP INDEX IF EXISTS idx_products_brand_trgm;
-- DROP INDEX IF EXISTS idx_products_search_vector;
-- DROP INDEX IF EXISTS idx_products_active_popular;
-- ALTER TABLE products DROP COLUMN IF EXISTS search_vector;
