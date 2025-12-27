-- Order Management Enhancement Schema
-- Adds order timeline, bulk actions, and shipping features

BEGIN;

-- Order Timeline/Events Table
CREATE TABLE IF NOT EXISTS order_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW()
);

-- Shipping Labels Table
CREATE TABLE IF NOT EXISTS shipping_labels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number text,
  carrier text,
  label_url text,
  created_at timestamptz DEFAULT NOW()
);

-- Add shipping columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at timestamptz;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_type ON order_events(event_type);
CREATE INDEX IF NOT EXISTS idx_shipping_labels_order ON shipping_labels(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, created_at DESC);

-- Enable RLS
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_labels ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Admins can manage events" ON order_events;
CREATE POLICY "Admins can manage events" ON order_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can manage labels" ON shipping_labels;
CREATE POLICY "Admins can manage labels" ON shipping_labels
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Function to log order events
CREATE OR REPLACE FUNCTION log_order_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      INSERT INTO order_events (order_id, event_type, event_data, created_by)
      VALUES (NEW.id, 'status_change', 
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status),
        auth.uid()
      );
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO order_events (order_id, event_type, event_data, created_by)
    VALUES (NEW.id, 'order_created', jsonb_build_object('status', NEW.status), auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply event logging trigger
DROP TRIGGER IF EXISTS log_order_event_trigger ON orders;
CREATE TRIGGER log_order_event_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_event();

-- Function for bulk order status update
CREATE OR REPLACE FUNCTION bulk_update_orders(
  order_ids uuid[],
  new_status text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer := 0;
BEGIN
  UPDATE orders SET 
    status = new_status,
    shipped_at = CASE WHEN new_status = 'shipped' THEN NOW() ELSE shipped_at END
  WHERE id = ANY(order_ids);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log events
  INSERT INTO order_events (order_id, event_type, event_data, created_by)
  SELECT 
    unnest(order_ids),
    'bulk_status_update',
    jsonb_build_object('new_status', new_status),
    auth.uid();
  
  RETURN updated_count;
END;
$$;

-- Function to generate invoice data
CREATE OR REPLACE FUNCTION get_invoice_data(order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'order', row_to_json(o.*),
    'customer', row_to_json(p.*),
    'items', (
      SELECT jsonb_agg(row_to_json(oi.*))
      FROM order_items oi
      WHERE oi.order_id = get_invoice_data.order_id
    )
  ) INTO result
  FROM orders o
  JOIN profiles p ON o.user_id = p.id
  WHERE o.id = get_invoice_data.order_id;
  
  RETURN result;
END;
$$;

-- Function to create shipping label
CREATE OR REPLACE FUNCTION create_shipping_label(
  order_id uuid,
  tracking_number text,
  carrier text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  label_id uuid;
BEGIN
  INSERT INTO shipping_labels (order_id, tracking_number, carrier)
  VALUES (order_id, tracking_number, carrier)
  RETURNING id INTO label_id;
  
  UPDATE orders SET
    tracking_number = create_shipping_label.tracking_number,
    carrier = create_shipping_label.carrier
  WHERE id = order_id;
  
  INSERT INTO order_events (order_id, event_type, event_data, created_by)
  VALUES (order_id, 'label_created', 
    jsonb_build_object('tracking_number', tracking_number, 'carrier', carrier),
    auth.uid()
  );
  
  RETURN label_id;
END;
$$;

-- Grant permissions
GRANT SELECT ON order_events TO authenticated;
GRANT SELECT ON shipping_labels TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_update_orders TO authenticated;
GRANT EXECUTE ON FUNCTION get_invoice_data TO authenticated;
GRANT EXECUTE ON FUNCTION create_shipping_label TO authenticated;

COMMIT;