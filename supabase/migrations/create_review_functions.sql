-- Function to increment helpful count
CREATE OR REPLACE FUNCTION increment_helpful(review_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE reviews 
  SET helpful_count = helpful_count + 1 
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement helpful count
CREATE OR REPLACE FUNCTION decrement_helpful(review_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE reviews 
  SET helpful_count = GREATEST(helpful_count - 1, 0)
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;
