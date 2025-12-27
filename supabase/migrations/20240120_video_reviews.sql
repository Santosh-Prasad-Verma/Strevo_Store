-- Video Reviews Table
CREATE TABLE IF NOT EXISTS video_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  likes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_reviews_product ON video_reviews(product_id);
CREATE INDEX idx_video_reviews_approved ON video_reviews(approved);

-- Outfit Builder Table
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product_ids UUID[] NOT NULL,
  total_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outfits_user ON outfits(user_id);
