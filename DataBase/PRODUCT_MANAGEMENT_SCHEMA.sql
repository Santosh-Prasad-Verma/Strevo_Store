-- Product Management Enhancement Schema
-- Adds support for variants, bulk operations, and product history

BEGIN;



-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  size text,
  color text,
  price numeric(10,2),
  stock_quantity integer DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Product History Table
CREATE TABLE IF NOT EXISTS product_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  change_type text NOT NULL, -- 'price_change', 'stock_update', 'status_change', etc.
  old_value jsonb,
  new_value jsonb,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW()
);

-- Bulk Upload Jobs Table
CREATE TABLE IF NOT EXISTS bulk_upload_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  file_name text NOT NULL,
  total_rows integer,
  processed_rows integer DEFAULT 0,
  successful_rows integer DEFAULT 0,
  failed_rows integer DEFAULT 0,
  status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  error_log jsonb,
  created_at timestamptz DEFAULT NOW(),
  completed_at timestamptz
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_history_product ON product_history(product_id);
CREATE INDEX IF NOT EXISTS idx_product_history_created ON product_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_jobs_user ON bulk_upload_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_jobs_status ON bulk_upload_jobs(status);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_upload_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
DROP POLICY IF EXISTS "Anyone can view variants" ON product_variants;
CREATE POLICY "Anyone can view variants" ON product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;
CREATE POLICY "Admins can manage variants" ON product_variants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- RLS Policies for product_history
DROP POLICY IF EXISTS "Admins can view history" ON product_history;
CREATE POLICY "Admins can view history" ON product_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- RLS Policies for bulk_upload_jobs
DROP POLICY IF EXISTS "Users can view own jobs" ON bulk_upload_jobs;
CREATE POLICY "Users can view own jobs" ON bulk_upload_jobs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all jobs" ON bulk_upload_jobs;
CREATE POLICY "Admins can view all jobs" ON bulk_upload_jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Function to log product changes
CREATE OR REPLACE FUNCTION log_product_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log price changes
    IF OLD.price != NEW.price THEN
      INSERT INTO product_history (product_id, change_type, old_value, new_value, changed_by)
      VALUES (NEW.id, 'price_change', 
        jsonb_build_object('price', OLD.price),
        jsonb_build_object('price', NEW.price),
        auth.uid()
      );
    END IF;
    
    -- Log stock changes
    IF OLD.stock_quantity != NEW.stock_quantity THEN
      INSERT INTO product_history (product_id, change_type, old_value, new_value, changed_by)
      VALUES (NEW.id, 'stock_update',
        jsonb_build_object('stock', OLD.stock_quantity),
        jsonb_build_object('stock', NEW.stock_quantity),
        auth.uid()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply trigger to products table
DROP TRIGGER IF EXISTS product_change_logger ON products;
CREATE TRIGGER product_change_logger
  AFTER UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION log_product_change();

-- Function to duplicate product
CREATE OR REPLACE FUNCTION duplicate_product(source_product_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_product_id uuid;
  source_product products%ROWTYPE;
BEGIN
  -- Get source product
  SELECT * INTO source_product FROM products WHERE id = source_product_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Insert duplicate
  INSERT INTO products (
    name, description, price, category, subcategory,
    image_url, stock_quantity
  ) VALUES (
    source_product.name || ' (Copy)',
    source_product.description,
    source_product.price,
    source_product.category,
    source_product.subcategory,
    source_product.image_url,
    0 -- Start with 0 stock
  ) RETURNING id INTO new_product_id;
  
  -- Copy variants if any
  INSERT INTO product_variants (
    product_id, sku, size, color, price, stock_quantity, image_url, is_active
  )
  SELECT 
    new_product_id, sku || '-COPY', size, color, price, 0, image_url, false
  FROM product_variants
  WHERE product_id = source_product_id;
  
  RETURN new_product_id;
END;
$$;

-- Function for bulk update
CREATE OR REPLACE FUNCTION bulk_update_products(
  product_ids uuid[],
  update_data jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer := 0;
BEGIN
  -- Update products based on provided data
  IF update_data ? 'price' THEN
    UPDATE products SET price = (update_data->>'price')::numeric
    WHERE id = ANY(product_ids);
    GET DIAGNOSTICS updated_count = ROW_COUNT;
  END IF;
  
  IF update_data ? 'category' THEN
    UPDATE products SET category = update_data->>'category'
    WHERE id = ANY(product_ids);
    GET DIAGNOSTICS updated_count = ROW_COUNT;
  END IF;
  
  IF update_data ? 'stock_quantity' THEN
    UPDATE products SET stock_quantity = (update_data->>'stock_quantity')::integer
    WHERE id = ANY(product_ids);
    GET DIAGNOSTICS updated_count = ROW_COUNT;
  END IF;
  
  RETURN updated_count;
END;
$$;

-- Grant permissions
GRANT SELECT ON product_variants TO authenticated, anon;
GRANT SELECT ON product_history TO authenticated;
GRANT SELECT ON bulk_upload_jobs TO authenticated;
GRANT EXECUTE ON FUNCTION duplicate_product TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_update_products TO authenticated;

COMMIT;