-- Enable the pg_trgm extension for fuzzy string matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a function for advanced product search
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price DECIMAL,
  category TEXT,
  image_url TEXT,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.price,
    p.category,
    p.image_url,
    GREATEST(
      similarity(p.name, search_query),
      similarity(p.description, search_query),
      similarity(p.category, search_query)
    ) as similarity
  FROM products p
  WHERE
    (
      search_query IS NULL OR search_query = '' OR
      p.name % search_query OR
      p.description % search_query OR
      p.category % search_query
    )
    AND (category_filter IS NULL OR p.category = category_filter)
  ORDER BY similarity DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
