-- Subscription Boxes
CREATE TABLE IF NOT EXISTS subscription_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active',
  next_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscription_boxes(user_id);

-- Stylist Sessions
CREATE TABLE IF NOT EXISTS stylist_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stylist_user ON stylist_sessions(user_id);

-- Customizations
CREATE TABLE IF NOT EXISTS product_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  customization_type TEXT NOT NULL,
  customization_text TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sustainability Tracker
CREATE TABLE IF NOT EXISTS sustainability_impact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  co2_saved DECIMAL(10,2) DEFAULT 0,
  water_saved DECIMAL(10,2) DEFAULT 0,
  trees_planted INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sustainability_user ON sustainability_impact(user_id);

-- Birthday Rewards
CREATE TABLE IF NOT EXISTS birthday_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  discount_code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  valid_until DATE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_birthday_user ON birthday_rewards(user_id);
