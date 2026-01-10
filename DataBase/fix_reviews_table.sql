-- Fix reviews table with correct data types
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

-- Create review votes table
CREATE TABLE IF NOT EXISTS review_votes (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);

-- Create helper functions
CREATE OR REPLACE FUNCTION increment_helpful(review_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE reviews 
  SET helpful_count = helpful_count + 1 
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_helpful(review_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE reviews 
  SET helpful_count = GREATEST(helpful_count - 1, 0)
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;
