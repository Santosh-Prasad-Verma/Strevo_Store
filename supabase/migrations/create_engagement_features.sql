-- 1. LOYALTY/REWARDS PROGRAM
CREATE TABLE IF NOT EXISTS loyalty_points (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  points INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- purchase, referral, signup, review, redeem
  description TEXT,
  order_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REFERRAL SYSTEM
CREATE TABLE IF NOT EXISTS referrals (
  id BIGSERIAL PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id),
  referee_id UUID REFERENCES auth.users(id),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, expired
  reward_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. PRODUCT WAITLIST
CREATE TABLE IF NOT EXISTS product_waitlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  email VARCHAR(255) NOT NULL,
  size VARCHAR(10),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- 4. SIZE RECOMMENDATIONS (User measurements)
CREATE TABLE IF NOT EXISTS user_measurements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  height INTEGER, -- in cm
  weight INTEGER, -- in kg
  chest INTEGER, -- in cm
  waist INTEGER, -- in cm
  hips INTEGER, -- in cm
  preferred_fit VARCHAR(20), -- slim, regular, oversized
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STYLE QUIZ
CREATE TABLE IF NOT EXISTS style_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  style_preferences JSONB, -- stores quiz answers
  recommended_categories TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RECENTLY VIEWED PRODUCTS
CREATE TABLE IF NOT EXISTS recently_viewed (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 7. PRODUCT COMPARISON
CREATE TABLE IF NOT EXISTS product_comparisons (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_loyalty_points_user ON loyalty_points(user_id);
CREATE INDEX idx_loyalty_transactions_user ON loyalty_transactions(user_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_waitlist_product ON product_waitlist(product_id);
CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id);
CREATE INDEX idx_recently_viewed_time ON recently_viewed(viewed_at DESC);

-- Function to update loyalty tier
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lifetime_points >= 10000 THEN
    NEW.tier = 'platinum';
  ELSIF NEW.lifetime_points >= 5000 THEN
    NEW.tier = 'gold';
  ELSIF NEW.lifetime_points >= 2000 THEN
    NEW.tier = 'silver';
  ELSE
    NEW.tier = 'bronze';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loyalty_tier_update
BEFORE UPDATE ON loyalty_points
FOR EACH ROW
EXECUTE FUNCTION update_loyalty_tier();

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR(20);
BEGIN
  code := 'REF' || UPPER(SUBSTRING(MD5(user_id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  RETURN code;
END;
$$ LANGUAGE plpgsql;
