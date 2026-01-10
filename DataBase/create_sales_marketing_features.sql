-- 1. FLASH SALES / DAILY DEALS
CREATE TABLE IF NOT EXISTS flash_sales (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  product_ids UUID[],
  category VARCHAR(100),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUNDLE DEALS
CREATE TABLE IF NOT EXISTS bundle_deals (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_ids UUID[] NOT NULL,
  bundle_type VARCHAR(50) NOT NULL, -- buy_x_get_y, percentage_off, fixed_price
  buy_quantity INTEGER,
  get_quantity INTEGER,
  discount_percentage INTEGER,
  fixed_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ABANDONED CART
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR(255),
  cart_data JSONB NOT NULL,
  email VARCHAR(255),
  total_amount DECIMAL(10,2),
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  recovered BOOLEAN DEFAULT false,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DYNAMIC PRICING
CREATE TABLE IF NOT EXISTS pricing_rules (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL, -- member_discount, bulk_pricing, time_based
  product_ids UUID[],
  category VARCHAR(100),
  member_tier VARCHAR(20), -- bronze, silver, gold, platinum
  discount_percentage INTEGER,
  min_quantity INTEGER,
  start_time TIME,
  end_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GIFT CARDS
CREATE TABLE IF NOT EXISTS gift_cards (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  initial_amount DECIMAL(10,2) NOT NULL,
  current_balance DECIMAL(10,2) NOT NULL,
  purchaser_id UUID REFERENCES auth.users(id),
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  message TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id BIGSERIAL PRIMARY KEY,
  gift_card_id BIGINT REFERENCES gift_cards(id),
  order_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL, -- purchase, redeem, refund
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROMO CODES
CREATE TABLE IF NOT EXISTS promo_codes (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount, free_shipping
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  user_limit INTEGER DEFAULT 1,
  applicable_products UUID[],
  applicable_categories TEXT[],
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_code_usage (
  id BIGSERIAL PRIMARY KEY,
  promo_code_id BIGINT REFERENCES promo_codes(id),
  user_id UUID REFERENCES auth.users(id),
  order_id UUID,
  discount_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRE-ORDER SYSTEM
CREATE TABLE IF NOT EXISTS pre_orders (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES auth.users(id),
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2),
  expected_delivery_date DATE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, completed, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, partial, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BACK-IN-STOCK ALERTS (Enhanced from waitlist)
CREATE TABLE IF NOT EXISTS stock_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  email VARCHAR(255) NOT NULL,
  size VARCHAR(10),
  color VARCHAR(50),
  alert_sent BOOLEAN DEFAULT false,
  alert_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- Create indexes
CREATE INDEX idx_flash_sales_active ON flash_sales(is_active, start_time, end_time);
CREATE INDEX idx_bundle_deals_active ON bundle_deals(is_active);
CREATE INDEX idx_abandoned_carts_user ON abandoned_carts(user_id);
CREATE INDEX idx_abandoned_carts_reminder ON abandoned_carts(reminder_sent, created_at);
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active);
CREATE INDEX idx_gift_cards_code ON gift_cards(code);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, start_date, end_date);
CREATE INDEX idx_pre_orders_user ON pre_orders(user_id);
CREATE INDEX idx_pre_orders_product ON pre_orders(product_id);
CREATE INDEX idx_stock_alerts_product ON stock_alerts(product_id);

-- Function to check if flash sale is active
CREATE OR REPLACE FUNCTION is_flash_sale_active(sale_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  SELECT 
    is_active AND 
    NOW() BETWEEN start_time AND end_time AND
    (max_uses IS NULL OR used_count < max_uses)
  INTO is_valid
  FROM flash_sales
  WHERE id = sale_id;
  
  RETURN COALESCE(is_valid, false);
END;
$$ LANGUAGE plpgsql;

-- Function to validate promo code
CREATE OR REPLACE FUNCTION validate_promo_code(code_text VARCHAR, user_id_param UUID, cart_total DECIMAL)
RETURNS TABLE(valid BOOLEAN, discount DECIMAL, message TEXT) AS $$
DECLARE
  promo RECORD;
  user_usage_count INTEGER;
BEGIN
  SELECT * INTO promo FROM promo_codes WHERE code = code_text AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Invalid promo code';
    RETURN;
  END IF;
  
  IF promo.start_date IS NOT NULL AND NOW() < promo.start_date THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code not yet active';
    RETURN;
  END IF;
  
  IF promo.end_date IS NOT NULL AND NOW() > promo.end_date THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code expired';
    RETURN;
  END IF;
  
  IF promo.usage_limit IS NOT NULL AND promo.usage_count >= promo.usage_limit THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code usage limit reached';
    RETURN;
  END IF;
  
  IF promo.min_purchase_amount IS NOT NULL AND cart_total < promo.min_purchase_amount THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Minimum purchase amount not met';
    RETURN;
  END IF;
  
  SELECT COUNT(*) INTO user_usage_count 
  FROM promo_code_usage 
  WHERE promo_code_id = promo.id AND user_id = user_id_param;
  
  IF promo.user_limit IS NOT NULL AND user_usage_count >= promo.user_limit THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'You have already used this promo code';
    RETURN;
  END IF;
  
  RETURN QUERY SELECT true, promo.discount_value, 'Valid promo code'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to generate gift card code
CREATE OR REPLACE FUNCTION generate_gift_card_code()
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR(20);
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'GC' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12));
    SELECT EXISTS(SELECT 1 FROM gift_cards WHERE gift_cards.code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
