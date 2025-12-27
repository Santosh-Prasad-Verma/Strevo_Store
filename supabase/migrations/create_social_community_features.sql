-- 1. USER-GENERATED CONTENT (Customer Photo Gallery)
CREATE TABLE IF NOT EXISTS user_content (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  instagram_handle VARCHAR(100),
  likes_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_likes (
  id BIGSERIAL PRIMARY KEY,
  content_id BIGINT REFERENCES user_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, user_id)
);

-- 2. SOCIAL LOGIN (Track social auth providers)
CREATE TABLE IF NOT EXISTS social_connections (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  google_id VARCHAR(255),
  facebook_id VARCHAR(255),
  instagram_id VARCHAR(255),
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SOCIAL SHARES (Track sharing activity)
CREATE TABLE IF NOT EXISTS social_shares (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  platform VARCHAR(50) NOT NULL, -- whatsapp, instagram, facebook, twitter
  share_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INFLUENCER DASHBOARD
CREATE TABLE IF NOT EXISTS influencers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  influencer_code VARCHAR(20) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  payout_threshold DECIMAL(10,2) DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS influencer_sales (
  id BIGSERIAL PRIMARY KEY,
  influencer_id BIGINT REFERENCES influencers(id),
  order_id UUID,
  sale_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, paid
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS influencer_payouts (
  id BIGSERIAL PRIMARY KEY,
  influencer_id BIGINT REFERENCES influencers(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_details JSONB,
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. LIVE CHAT SUPPORT
CREATE TABLE IF NOT EXISTS chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, closed, waiting
  assigned_agent_id UUID,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  sender_type VARCHAR(20) NOT NULL, -- customer, agent, bot
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMUNITY FORUM
CREATE TABLE IF NOT EXISTS forum_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES forum_categories(id),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id BIGINT REFERENCES forum_replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR
    (post_id IS NULL AND reply_id IS NOT NULL)
  )
);

-- Create indexes
CREATE INDEX idx_user_content_approved ON user_content(is_approved, created_at DESC);
CREATE INDEX idx_user_content_featured ON user_content(is_featured);
CREATE INDEX idx_social_shares_product ON social_shares(product_id);
CREATE INDEX idx_influencers_code ON influencers(influencer_code);
CREATE INDEX idx_influencer_sales_influencer ON influencer_sales(influencer_id);
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_slug ON forum_posts(slug);
CREATE INDEX idx_forum_replies_post ON forum_replies(post_id);

-- Function to increment content likes
CREATE OR REPLACE FUNCTION increment_content_likes(content_id_param BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE user_content 
  SET likes_count = likes_count + 1 
  WHERE id = content_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to increment forum post likes
CREATE OR REPLACE FUNCTION increment_forum_likes(post_id_param BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET likes_count = likes_count + 1 
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to generate influencer code
CREATE OR REPLACE FUNCTION generate_influencer_code(user_id_param UUID)
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR(20);
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'INF' || UPPER(SUBSTRING(MD5(user_id_param::TEXT || RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM influencers WHERE influencer_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Insert default forum categories
INSERT INTO forum_categories (name, description, slug, icon) VALUES
('Style Tips', 'Share your styling tips and fashion advice', 'style-tips', '👔'),
('Product Reviews', 'Discuss products and share reviews', 'product-reviews', '⭐'),
('Outfit Ideas', 'Show off your outfits and get inspiration', 'outfit-ideas', '👗'),
('General Discussion', 'Talk about anything streetwear related', 'general', '💬'),
('Questions', 'Ask questions and get help from the community', 'questions', '❓')
ON CONFLICT (slug) DO NOTHING;
