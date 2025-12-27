-- Financial Management Schema
-- Revenue reports, profit tracking, tax reports, refunds, payment stats

BEGIN;

-- Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  reason text,
  status text DEFAULT 'pending',
  processed_by uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT NOW()
);

-- Product Costs Table (for profit calculation)
CREATE TABLE IF NOT EXISTS product_costs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  cost_price decimal(10,2) NOT NULL,
  effective_from timestamptz DEFAULT NOW(),
  created_at timestamptz DEFAULT NOW()
);

-- Payment Gateway Stats Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  payment_method text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL,
  gateway_response jsonb,
  created_at timestamptz DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_product_costs_product ON product_costs(product_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_method ON payment_transactions(payment_method);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_date ON payment_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Admins manage refunds" ON refunds;
CREATE POLICY "Admins manage refunds" ON refunds
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins manage costs" ON product_costs;
CREATE POLICY "Admins manage costs" ON product_costs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins view transactions" ON payment_transactions;
CREATE POLICY "Admins view transactions" ON payment_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Function: Revenue Report
CREATE OR REPLACE FUNCTION get_revenue_report(
  start_date timestamptz,
  end_date timestamptz,
  period text DEFAULT 'daily'
)
RETURNS TABLE(
  period_start timestamptz,
  total_revenue decimal,
  total_orders bigint,
  avg_order_value decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc(period, o.created_at) as period_start,
    SUM(o.total_amount)::decimal as total_revenue,
    COUNT(*)::bigint as total_orders,
    AVG(o.total_amount)::decimal as avg_order_value
  FROM orders o
  WHERE o.created_at BETWEEN start_date AND end_date
    AND o.status NOT IN ('cancelled', 'refunded')
  GROUP BY date_trunc(period, o.created_at)
  ORDER BY period_start DESC;
END;
$$;

-- Function: Profit Margin Report
CREATE OR REPLACE FUNCTION get_profit_report(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS TABLE(
  product_id uuid,
  product_name text,
  units_sold bigint,
  revenue decimal,
  cost decimal,
  profit decimal,
  margin_percent decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as product_id,
    p.name as product_name,
    COUNT(oi.id)::bigint as units_sold,
    SUM(oi.price * oi.quantity)::decimal as revenue,
    SUM(COALESCE(pc.cost_price, 0) * oi.quantity)::decimal as cost,
    (SUM(oi.price * oi.quantity) - SUM(COALESCE(pc.cost_price, 0) * oi.quantity))::decimal as profit,
    CASE 
      WHEN SUM(oi.price * oi.quantity) > 0 
      THEN ((SUM(oi.price * oi.quantity) - SUM(COALESCE(pc.cost_price, 0) * oi.quantity)) / SUM(oi.price * oi.quantity) * 100)::decimal
      ELSE 0
    END as margin_percent
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  JOIN orders o ON oi.order_id = o.id
  LEFT JOIN LATERAL (
    SELECT cost_price 
    FROM product_costs 
    WHERE product_id = p.id 
    ORDER BY effective_from DESC 
    LIMIT 1
  ) pc ON true
  WHERE o.created_at BETWEEN start_date AND end_date
    AND o.status NOT IN ('cancelled', 'refunded')
  GROUP BY p.id, p.name
  ORDER BY profit DESC;
END;
$$;

-- Function: Tax Report (GST breakdown)
CREATE OR REPLACE FUNCTION get_tax_report(
  start_date timestamptz,
  end_date timestamptz,
  tax_rate decimal DEFAULT 18.0
)
RETURNS TABLE(
  period_start timestamptz,
  gross_sales decimal,
  taxable_amount decimal,
  tax_collected decimal,
  net_sales decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', o.created_at) as period_start,
    SUM(o.total_amount)::decimal as gross_sales,
    SUM(o.total_amount / (1 + tax_rate/100))::decimal as taxable_amount,
    SUM(o.total_amount - (o.total_amount / (1 + tax_rate/100)))::decimal as tax_collected,
    SUM(o.total_amount / (1 + tax_rate/100))::decimal as net_sales
  FROM orders o
  WHERE o.created_at BETWEEN start_date AND end_date
    AND o.status NOT IN ('cancelled', 'refunded')
  GROUP BY date_trunc('day', o.created_at)
  ORDER BY period_start DESC;
END;
$$;

-- Function: Process Refund
CREATE OR REPLACE FUNCTION process_refund(
  refund_id uuid,
  new_status text DEFAULT 'completed'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE refunds SET
    status = new_status,
    processed_by = auth.uid(),
    processed_at = NOW()
  WHERE id = refund_id;

  IF new_status = 'completed' THEN
    UPDATE orders SET status = 'refunded'
    WHERE id = (SELECT order_id FROM refunds WHERE id = refund_id);
  END IF;
END;
$$;

-- Function: Payment Gateway Stats
CREATE OR REPLACE FUNCTION get_payment_stats(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS TABLE(
  payment_method text,
  total_transactions bigint,
  successful_transactions bigint,
  failed_transactions bigint,
  success_rate decimal,
  total_amount decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pt.payment_method,
    COUNT(*)::bigint as total_transactions,
    COUNT(*) FILTER (WHERE pt.status = 'success')::bigint as successful_transactions,
    COUNT(*) FILTER (WHERE pt.status = 'failed')::bigint as failed_transactions,
    (COUNT(*) FILTER (WHERE pt.status = 'success')::decimal / NULLIF(COUNT(*), 0) * 100)::decimal as success_rate,
    SUM(pt.amount) FILTER (WHERE pt.status = 'success')::decimal as total_amount
  FROM payment_transactions pt
  WHERE pt.created_at BETWEEN start_date AND end_date
  GROUP BY pt.payment_method
  ORDER BY total_amount DESC;
END;
$$;

-- Function: Create Refund
CREATE OR REPLACE FUNCTION create_refund(
  order_id uuid,
  amount decimal,
  reason text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  refund_id uuid;
BEGIN
  INSERT INTO refunds (order_id, amount, reason)
  VALUES (order_id, amount, reason)
  RETURNING id INTO refund_id;
  
  RETURN refund_id;
END;
$$;

-- Grant permissions
GRANT SELECT ON refunds TO authenticated;
GRANT SELECT ON product_costs TO authenticated;
GRANT SELECT ON payment_transactions TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_report TO authenticated;
GRANT EXECUTE ON FUNCTION get_profit_report TO authenticated;
GRANT EXECUTE ON FUNCTION get_tax_report TO authenticated;
GRANT EXECUTE ON FUNCTION process_refund TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_stats TO authenticated;
GRANT EXECUTE ON FUNCTION create_refund TO authenticated;

COMMIT;
