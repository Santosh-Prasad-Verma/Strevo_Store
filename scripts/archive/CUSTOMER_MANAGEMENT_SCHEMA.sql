-- Customer Management Schema
-- Adds customer segments, notes, and ban functionality

BEGIN;

-- Add customer management columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS segment text DEFAULT 'regular';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ban_reason text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifetime_value numeric(10,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_orders integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_order_at timestamptz;

-- Customer Notes Table
CREATE TABLE IF NOT EXISTS customer_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Customer Activity Log
CREATE TABLE IF NOT EXISTS customer_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb,
  created_at timestamptz DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON customer_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_customer ON customer_activity(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_type ON customer_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_profiles_segment ON profiles(segment);
CREATE INDEX IF NOT EXISTS idx_profiles_banned ON profiles(is_banned);

-- Enable RLS
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Admins can manage notes" ON customer_notes;
CREATE POLICY "Admins can manage notes" ON customer_notes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can view activity" ON customer_activity;
CREATE POLICY "Admins can view activity" ON customer_activity
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Function to calculate customer lifetime value
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE profiles SET
      lifetime_value = (
        SELECT COALESCE(SUM(total_amount), 0)
        FROM orders
        WHERE user_id = NEW.user_id AND status = 'completed'
      ),
      total_orders = (
        SELECT COUNT(*)
        FROM orders
        WHERE user_id = NEW.user_id AND status = 'completed'
      ),
      last_order_at = (
        SELECT MAX(created_at)
        FROM orders
        WHERE user_id = NEW.user_id AND status = 'completed'
      )
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply trigger to orders
DROP TRIGGER IF EXISTS update_customer_stats_trigger ON orders;
CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- Function to auto-assign customer segments
CREATE OR REPLACE FUNCTION assign_customer_segment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- VIP: lifetime_value > 10000 or total_orders > 20
  IF NEW.lifetime_value > 10000 OR NEW.total_orders > 20 THEN
    NEW.segment := 'vip';
  -- High Value: lifetime_value > 5000 or total_orders > 10
  ELSIF NEW.lifetime_value > 5000 OR NEW.total_orders > 10 THEN
    NEW.segment := 'high_value';
  -- Inactive: last order > 90 days ago
  ELSIF NEW.last_order_at IS NOT NULL AND NEW.last_order_at < NOW() - INTERVAL '90 days' THEN
    NEW.segment := 'inactive';
  -- Regular: default
  ELSE
    NEW.segment := 'regular';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply segment trigger
DROP TRIGGER IF EXISTS assign_segment_trigger ON profiles;
CREATE TRIGGER assign_segment_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION assign_customer_segment();

-- Function to ban customer
CREATE OR REPLACE FUNCTION ban_customer(
  customer_id uuid,
  reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles SET
    is_banned = true,
    ban_reason = reason,
    banned_at = NOW()
  WHERE id = customer_id;
  
  -- Log activity
  INSERT INTO customer_activity (customer_id, activity_type, activity_data)
  VALUES (customer_id, 'banned', jsonb_build_object('reason', reason, 'banned_by', auth.uid()));
END;
$$;

-- Function to unban customer
CREATE OR REPLACE FUNCTION unban_customer(customer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles SET
    is_banned = false,
    ban_reason = NULL,
    banned_at = NULL
  WHERE id = customer_id;
  
  -- Log activity
  INSERT INTO customer_activity (customer_id, activity_type, activity_data)
  VALUES (customer_id, 'unbanned', jsonb_build_object('unbanned_by', auth.uid()));
END;
$$;

-- Function to get customer details with stats
CREATE OR REPLACE FUNCTION get_customer_details(customer_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'profile', row_to_json(p.*),
    'stats', jsonb_build_object(
      'lifetime_value', p.lifetime_value,
      'total_orders', p.total_orders,
      'last_order_at', p.last_order_at,
      'segment', p.segment
    ),
    'recent_orders', (
      SELECT COALESCE(jsonb_agg(row_to_json(o.*)), '[]'::jsonb)
      FROM (
        SELECT * FROM orders WHERE user_id = customer_id ORDER BY created_at DESC LIMIT 5
      ) o
    ),
    'notes', (
      SELECT COALESCE(jsonb_agg(row_to_json(n.*)), '[]'::jsonb)
      FROM (
        SELECT * FROM customer_notes WHERE customer_notes.customer_id = get_customer_details.customer_id ORDER BY created_at DESC
      ) n
    )
  ) INTO result
  FROM profiles p
  WHERE p.id = customer_id;
  
  RETURN result;
END;
$$;

-- Grant permissions
GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT ALL ON customer_notes TO authenticated;
GRANT SELECT ON customer_activity TO authenticated;
GRANT EXECUTE ON FUNCTION ban_customer TO authenticated;
GRANT EXECUTE ON FUNCTION unban_customer TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_details TO authenticated;

COMMIT;