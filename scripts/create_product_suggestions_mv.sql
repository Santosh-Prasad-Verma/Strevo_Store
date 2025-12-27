-- Materialized view for blazing-fast product suggestions
CREATE MATERIALIZED VIEW IF NOT EXISTS product_suggestions AS
SELECT
  p.id,
  p.name AS title,
  p.slug,
  p.price,
  p.image_url AS thumbnail_url,
  COALESCE(p.stock_quantity, 0) AS popularity_score,
  lower(regexp_replace(p.name, '[-_]', ' ', 'g')) AS title_norm,
  p.brand,
  p.is_active
FROM products p
WHERE p.is_active = true
ORDER BY COALESCE(p.stock_quantity, 0) DESC, p.created_at DESC;

-- Create UNIQUE index (required for CONCURRENTLY refresh)
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_suggestions_id 
  ON product_suggestions(id);

-- Create indexes on materialized view for fast lookups
CREATE INDEX IF NOT EXISTS idx_product_suggestions_title_norm_trgm 
  ON product_suggestions USING GIN (title_norm gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_suggestions_popularity 
  ON product_suggestions(popularity_score DESC);

-- Initial refresh (non-concurrent first time)
REFRESH MATERIALIZED VIEW product_suggestions;

-- Function to refresh materialized view incrementally
CREATE OR REPLACE FUNCTION refresh_product_suggestions()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_suggestions;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (run this manually or via cron)
-- SELECT refresh_product_suggestions();

-- For real-time updates, create trigger on products table
CREATE OR REPLACE FUNCTION trigger_refresh_product_suggestions()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh asynchronously (non-blocking)
  PERFORM pg_notify('refresh_suggestions', '');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_changed_trigger ON products;
CREATE TRIGGER products_changed_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_product_suggestions();

-- Rollback statements
-- DROP TRIGGER IF EXISTS products_changed_trigger ON products;
-- DROP FUNCTION IF EXISTS trigger_refresh_product_suggestions();
-- DROP FUNCTION IF EXISTS refresh_product_suggestions();
-- DROP INDEX IF EXISTS idx_product_suggestions_id;
-- DROP INDEX IF EXISTS idx_product_suggestions_title_norm_trgm;
-- DROP INDEX IF EXISTS idx_product_suggestions_popularity;
-- DROP MATERIALIZED VIEW IF EXISTS product_suggestions;
