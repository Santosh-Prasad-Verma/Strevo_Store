-- System Tools, Security & Settings Schema
-- Cache, performance, search analytics, admin roles, activity logs, system settings

BEGIN;

-- Admin Roles Table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('super_admin', 'manager', 'viewer')),
  permissions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource text,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT NOW()
);

-- Login History Table
CREATE TABLE IF NOT EXISTS login_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  ip_address text,
  user_agent text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT NOW()
);

-- IP Whitelist Table
CREATE TABLE IF NOT EXISTS ip_whitelist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT NOW()
);

-- Search Analytics Table
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  query text NOT NULL,
  results_count integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text NOT NULL,
  response_time integer NOT NULL,
  status_code integer,
  created_at timestamptz DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_roles_user ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_login_history_user ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_date ON search_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_endpoint ON performance_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Super admins manage roles" ON admin_roles;
CREATE POLICY "Super admins manage roles" ON admin_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

DROP POLICY IF EXISTS "Admins view activity logs" ON activity_logs;
CREATE POLICY "Admins view activity logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins view login history" ON login_history;
CREATE POLICY "Admins view login history" ON login_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Super admins manage whitelist" ON ip_whitelist;
CREATE POLICY "Super admins manage whitelist" ON ip_whitelist
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

DROP POLICY IF EXISTS "Admins view search analytics" ON search_analytics;
CREATE POLICY "Admins view search analytics" ON search_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins view performance" ON performance_metrics;
CREATE POLICY "Admins view performance" ON performance_metrics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins manage settings" ON system_settings;
CREATE POLICY "Admins manage settings" ON system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Function: Log Activity
CREATE OR REPLACE FUNCTION log_activity(
  action text,
  resource text DEFAULT NULL,
  details jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO activity_logs (user_id, action, resource, details)
  VALUES (auth.uid(), action, resource, details)
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$$;

-- Function: Log Login
CREATE OR REPLACE FUNCTION log_login(
  ip_address text,
  user_agent text,
  success boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO login_history (user_id, ip_address, user_agent, success)
  VALUES (auth.uid(), ip_address, user_agent, success)
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$$;

-- Function: Check IP Whitelist
CREATE OR REPLACE FUNCTION check_ip_whitelist(ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM ip_whitelist 
    WHERE ip_address = ip AND is_active = true
  );
END;
$$;

-- Function: Track Search
CREATE OR REPLACE FUNCTION track_search(
  query text,
  results_count integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  search_id uuid;
BEGIN
  INSERT INTO search_analytics (query, results_count, user_id)
  VALUES (query, results_count, auth.uid())
  RETURNING id INTO search_id;
  RETURN search_id;
END;
$$;

-- Function: Get Popular Searches
CREATE OR REPLACE FUNCTION get_popular_searches(limit_count integer DEFAULT 10)
RETURNS TABLE(query text, search_count bigint, avg_results decimal)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.query,
    COUNT(*)::bigint as search_count,
    AVG(sa.results_count)::decimal as avg_results
  FROM search_analytics sa
  WHERE sa.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY sa.query
  ORDER BY search_count DESC
  LIMIT limit_count;
END;
$$;

-- Function: Get No Results Searches
CREATE OR REPLACE FUNCTION get_no_results_searches()
RETURNS TABLE(query text, search_count bigint, last_searched timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.query,
    COUNT(*)::bigint as search_count,
    MAX(sa.created_at) as last_searched
  FROM search_analytics sa
  WHERE sa.results_count = 0
    AND sa.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY sa.query
  ORDER BY search_count DESC;
END;
$$;

-- Function: Track Performance
CREATE OR REPLACE FUNCTION track_performance(
  endpoint text,
  response_time integer,
  status_code integer DEFAULT 200
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  metric_id uuid;
BEGIN
  INSERT INTO performance_metrics (endpoint, response_time, status_code)
  VALUES (endpoint, response_time, status_code)
  RETURNING id INTO metric_id;
  RETURN metric_id;
END;
$$;

-- Function: Get Performance Stats
CREATE OR REPLACE FUNCTION get_performance_stats()
RETURNS TABLE(
  endpoint text,
  avg_response_time decimal,
  min_response_time integer,
  max_response_time integer,
  request_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.endpoint,
    AVG(pm.response_time)::decimal as avg_response_time,
    MIN(pm.response_time) as min_response_time,
    MAX(pm.response_time) as max_response_time,
    COUNT(*)::bigint as request_count
  FROM performance_metrics pm
  WHERE pm.created_at >= NOW() - INTERVAL '24 hours'
  GROUP BY pm.endpoint
  ORDER BY avg_response_time DESC;
END;
$$;

-- Function: Get/Set System Setting
CREATE OR REPLACE FUNCTION get_setting(setting_category text, setting_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  setting_value jsonb;
BEGIN
  SELECT value INTO setting_value
  FROM system_settings
  WHERE category = setting_category AND key = setting_key;
  RETURN setting_value;
END;
$$;

CREATE OR REPLACE FUNCTION set_setting(
  setting_category text,
  setting_key text,
  setting_value jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO system_settings (category, key, value)
  VALUES (setting_category, setting_key, setting_value)
  ON CONFLICT (category, key) 
  DO UPDATE SET value = setting_value, updated_at = NOW();
END;
$$;

-- Function: Check Admin Permission
CREATE OR REPLACE FUNCTION check_admin_permission(required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF required_role = 'viewer' THEN
    RETURN EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'manager', 'viewer')
    );
  ELSIF required_role = 'manager' THEN
    RETURN EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'manager')
    );
  ELSE
    RETURN EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    );
  END IF;
END;
$$;

-- Trigger: Auto-log admin actions
CREATE OR REPLACE FUNCTION auto_log_admin_actions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs (user_id, action, resource, details)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_to_json(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_logs (user_id, action, resource, details)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, 
      jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activity_logs (user_id, action, resource, details)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_to_json(OLD));
  END IF;
  RETURN NEW;
END;
$$;

-- Apply logging triggers to critical tables
DROP TRIGGER IF EXISTS log_product_changes ON products;
CREATE TRIGGER log_product_changes
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION auto_log_admin_actions();

DROP TRIGGER IF EXISTS log_order_changes ON orders;
CREATE TRIGGER log_order_changes
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION auto_log_admin_actions();

-- Grant permissions
GRANT SELECT ON admin_roles TO authenticated;
GRANT SELECT ON activity_logs TO authenticated;
GRANT SELECT ON login_history TO authenticated;
GRANT SELECT ON ip_whitelist TO authenticated;
GRANT SELECT, INSERT ON search_analytics TO authenticated;
GRANT SELECT, INSERT ON performance_metrics TO authenticated;
GRANT SELECT ON system_settings TO authenticated;
GRANT EXECUTE ON FUNCTION log_activity TO authenticated;
GRANT EXECUTE ON FUNCTION log_login TO authenticated;
GRANT EXECUTE ON FUNCTION check_ip_whitelist TO authenticated;
GRANT EXECUTE ON FUNCTION track_search TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO authenticated;
GRANT EXECUTE ON FUNCTION get_no_results_searches TO authenticated;
GRANT EXECUTE ON FUNCTION track_performance TO authenticated;
GRANT EXECUTE ON FUNCTION get_performance_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_setting TO authenticated;
GRANT EXECUTE ON FUNCTION set_setting TO authenticated;
GRANT EXECUTE ON FUNCTION check_admin_permission TO authenticated;

COMMIT;
