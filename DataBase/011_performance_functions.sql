-- Performance Optimization Functions
-- Run this in Supabase SQL Editor

-- Function to get cart count efficiently
CREATE OR REPLACE FUNCTION get_cart_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(quantity), 0)
  INTO v_count
  FROM cart_items
  WHERE user_id = p_user_id;
  
  RETURN v_count;
END;
$$;

-- Function to get cart total efficiently
CREATE OR REPLACE FUNCTION get_cart_total(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(p.price * c.quantity), 0)
  INTO v_total
  FROM cart_items c
  JOIN products p ON p.id = c.product_id
  WHERE c.user_id = p_user_id;
  
  RETURN v_total;
END;
$$;

-- Function to batch update product stock
CREATE OR REPLACE FUNCTION batch_update_stock(
  p_product_ids INTEGER[],
  p_quantities INTEGER[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  FOR i IN 1..array_length(p_product_ids, 1) LOOP
    UPDATE products
    SET stock_quantity = stock_quantity - p_quantities[i]
    WHERE id = p_product_ids[i];
  END LOOP;
END;
$$;

-- Add unique constraint for cart items if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cart_items_user_product_unique'
  ) THEN
    ALTER TABLE cart_items 
    ADD CONSTRAINT cart_items_user_product_unique 
    UNIQUE (user_id, product_id);
  END IF;
END $$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_cart_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_cart_total(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION batch_update_stock(INTEGER[], INTEGER[]) TO authenticated;
