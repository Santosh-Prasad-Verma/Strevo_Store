-- Notifications & Marketing Schema
BEGIN;

CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type text UNIQUE NOT NULL,
  enabled boolean DEFAULT true,
  threshold jsonb,
  recipients text[],
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL,
  value decimal(10,2) NOT NULL,
  min_purchase decimal(10,2),
  max_uses integer,
  used_count integer DEFAULT 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_id uuid REFERENCES discounts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  used_at timestamptz,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  segment text,
  status text DEFAULT 'draft',
  sent_count integer DEFAULT 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  segment text,
  status text DEFAULT 'draft',
  sent_count integer DEFAULT 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  cart_data jsonb NOT NULL,
  email_sent boolean DEFAULT false,
  recovered boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON sms_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user ON abandoned_carts(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage notifications" ON notifications;
CREATE POLICY "Admins manage notifications" ON notifications FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Admins manage alerts" ON alert_settings;
CREATE POLICY "Admins manage alerts" ON alert_settings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Public view active discounts" ON discounts;
CREATE POLICY "Public view active discounts" ON discounts FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage discounts" ON discounts;
CREATE POLICY "Admins manage discounts" ON discounts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Users view own coupons" ON coupons;
CREATE POLICY "Users view own coupons" ON coupons FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins manage campaigns" ON email_campaigns;
CREATE POLICY "Admins manage campaigns" ON email_campaigns FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Admins manage sms" ON sms_campaigns;
CREATE POLICY "Admins manage sms" ON sms_campaigns FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Users view own carts" ON abandoned_carts;
CREATE POLICY "Users view own carts" ON abandoned_carts FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage carts" ON abandoned_carts;
CREATE POLICY "Admins manage carts" ON abandoned_carts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE(product_id uuid, product_name text, stock integer, threshold integer)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT p.id, p.name, p.stock, COALESCE((SELECT (threshold->>'stock')::integer FROM alert_settings WHERE alert_type = 'low_stock'), 10) as threshold FROM products p WHERE p.stock <= COALESCE((SELECT (threshold->>'stock')::integer FROM alert_settings WHERE alert_type = 'low_stock'), 10) ORDER BY p.stock ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_unread_notifications()
RETURNS SETOF notifications
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT * FROM notifications WHERE is_read = false ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION apply_discount(discount_code text, order_amount decimal)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE discount_record discounts; discount_amount decimal;
BEGIN
  SELECT * INTO discount_record FROM discounts WHERE code = discount_code AND is_active = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (expires_at IS NULL OR expires_at >= NOW()) AND (max_uses IS NULL OR used_count < max_uses) AND (min_purchase IS NULL OR order_amount >= min_purchase);
  IF NOT FOUND THEN RETURN jsonb_build_object('valid', false, 'message', 'Invalid or expired discount code'); END IF;
  IF discount_record.type = 'percentage' THEN discount_amount := order_amount * (discount_record.value / 100); ELSE discount_amount := discount_record.value; END IF;
  RETURN jsonb_build_object('valid', true, 'discount_amount', discount_amount, 'final_amount', order_amount - discount_amount);
END;
$$;

CREATE OR REPLACE FUNCTION generate_bulk_coupons(discount_id uuid, count integer, prefix text DEFAULT 'COUPON')
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE i integer := 0; code text;
BEGIN
  FOR i IN 1..count LOOP code := prefix || '-' || upper(substring(md5(random()::text) from 1 for 8)); INSERT INTO coupons (code, discount_id) VALUES (code, discount_id); END LOOP;
  RETURN count;
END;
$$;

CREATE OR REPLACE FUNCTION track_abandoned_cart(user_id uuid, cart_data jsonb)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE cart_id uuid;
BEGIN
  INSERT INTO abandoned_carts (user_id, cart_data) VALUES (user_id, cart_data) RETURNING id INTO cart_id;
  INSERT INTO notifications (type, title, message, data) VALUES ('abandoned_cart', 'Abandoned Cart', 'User left items in cart', jsonb_build_object('cart_id', cart_id, 'user_id', user_id));
  RETURN cart_id;
END;
$$;

CREATE OR REPLACE FUNCTION send_email_campaign(campaign_id uuid)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE recipient_count integer;
BEGIN
  SELECT COUNT(*) INTO recipient_count FROM profiles;
  UPDATE email_campaigns SET status = 'sent', sent_count = recipient_count, sent_at = NOW() WHERE id = campaign_id;
  RETURN recipient_count;
END;
$$;

GRANT SELECT ON notifications TO authenticated;
GRANT SELECT ON alert_settings TO authenticated;
GRANT SELECT ON discounts TO authenticated;
GRANT SELECT ON coupons TO authenticated;
GRANT SELECT ON email_campaigns TO authenticated;
GRANT SELECT ON sms_campaigns TO authenticated;
GRANT SELECT ON abandoned_carts TO authenticated;
GRANT EXECUTE ON FUNCTION check_low_stock TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION apply_discount TO authenticated;
GRANT EXECUTE ON FUNCTION generate_bulk_coupons TO authenticated;
GRANT EXECUTE ON FUNCTION track_abandoned_cart TO authenticated;
GRANT EXECUTE ON FUNCTION send_email_campaign TO authenticated;

COMMIT;
