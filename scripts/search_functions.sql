-- =============================================================================
-- Strevo Search Functions
-- RPC functions for fast typeahead suggestions
-- =============================================================================

-- Function 1: Fast prefix search on materialized view
CREATE OR REPLACE FUNCTION search_suggestions_prefix(
  search_term TEXT,
  result_limit INT DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  price NUMERIC,
  thumbnail_url TEXT,
  score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.id,
    ps.title,
    ps.slug::TEXT,
    ps.price,
    ps.thumbnail_url,
    ps.popularity_score::FLOAT AS score
  FROM product_suggestions ps
  WHERE ps.title_norm LIKE search_term || '%'
  ORDER BY ps.popularity_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 2: Trigram similarity search
CREATE OR REPLACE FUNCTION search_suggestions_trigram(
  search_term TEXT,
  result_limit INT DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  price NUMERIC,
  thumbnail_url TEXT,
  score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.id,
    ps.title,
    ps.slug::TEXT,
    ps.price,
    ps.thumbnail_url,
    similarity(ps.title_norm, search_term)::FLOAT AS score
  FROM product_suggestions ps
  WHERE similarity(ps.title_norm, search_term) > 0.15
  ORDER BY similarity(ps.title_norm, search_term) DESC, ps.popularity_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 3: Full-text search on products table
CREATE OR REPLACE FUNCTION search_suggestions_fulltext(
  search_term TEXT,
  result_limit INT DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  price NUMERIC,
  thumbnail_url TEXT,
  score FLOAT
) AS $$
DECLARE
  tsquery_val tsquery;
BEGIN
  -- Build tsquery from search term
  tsquery_val := websearch_to_tsquery('simple', search_term);
  
  RETURN QUERY
  SELECT 
    p.id,
    p.name AS title,
    p.id::TEXT AS slug,
    p.price,
    p.image_url AS thumbnail_url,
    ts_rank(p.search_vector, tsquery_val)::FLOAT AS score
  FROM products p
  WHERE p.is_active = true 
    AND p.search_vector @@ tsquery_val
  ORDER BY ts_rank(p.search_vector, tsquery_val) DESC, p.stock_quantity DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 4: Combined search with fallbacks (all-in-one)
CREATE OR REPLACE FUNCTION search_suggestions_combined(
  search_term TEXT,
  result_limit INT DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  price NUMERIC,
  thumbnail_url TEXT,
  score FLOAT,
  match_type TEXT
) AS $$
DECLARE
  normalized_term TEXT;
  result_count INT;
BEGIN
  -- Normalize the search term
  normalized_term := lower(regexp_replace(
    regexp_replace(search_term, '[-_]', ' ', 'g'),
    '[^a-z0-9\s]', '', 'g'
  ));
  
  -- Try prefix match first
  RETURN QUERY
  SELECT 
    ps.id,
    ps.title,
    ps.slug::TEXT,
    ps.price,
    ps.thumbnail_url,
    ps.popularity_score::FLOAT AS score,
    'prefix'::TEXT AS match_type
  FROM product_suggestions ps
  WHERE ps.title_norm LIKE normalized_term || '%'
  ORDER BY ps.popularity_score DESC
  LIMIT result_limit;
  
  GET DIAGNOSTICS result_count = ROW_COUNT;
  
  -- If no prefix results, try trigram
  IF result_count = 0 THEN
    RETURN QUERY
    SELECT 
      ps.id,
      ps.title,
      ps.slug::TEXT,
      ps.price,
      ps.thumbnail_url,
      similarity(ps.title_norm, normalized_term)::FLOAT AS score,
      'trigram'::TEXT AS match_type
    FROM product_suggestions ps
    WHERE similarity(ps.title_norm, normalized_term) > 0.15
    ORDER BY similarity(ps.title_norm, normalized_term) DESC, ps.popularity_score DESC
    LIMIT result_limit;
    
    GET DIAGNOSTICS result_count = ROW_COUNT;
  END IF;
  
  -- If still no results, try full-text
  IF result_count = 0 THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.name AS title,
      p.id::TEXT AS slug,
      p.price,
      p.image_url AS thumbnail_url,
      ts_rank(p.search_vector, websearch_to_tsquery('simple', search_term))::FLOAT AS score,
      'fulltext'::TEXT AS match_type
    FROM products p
    WHERE p.is_active = true 
      AND p.search_vector @@ websearch_to_tsquery('simple', search_term)
    ORDER BY ts_rank(p.search_vector, websearch_to_tsquery('simple', search_term)) DESC
    LIMIT result_limit;
  END IF;
  
  RETURN;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions (adjust role as needed)
-- GRANT EXECUTE ON FUNCTION search_suggestions_prefix TO authenticated;
-- GRANT EXECUTE ON FUNCTION search_suggestions_trigram TO authenticated;
-- GRANT EXECUTE ON FUNCTION search_suggestions_fulltext TO authenticated;
-- GRANT EXECUTE ON FUNCTION search_suggestions_combined TO authenticated;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DROP FUNCTION IF EXISTS search_suggestions_prefix;
-- DROP FUNCTION IF EXISTS search_suggestions_trigram;
-- DROP FUNCTION IF EXISTS search_suggestions_fulltext;
-- DROP FUNCTION IF EXISTS search_suggestions_combined;
