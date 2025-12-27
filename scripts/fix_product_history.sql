-- Fix product_history table - make field_name nullable or drop the constraint
ALTER TABLE product_history ALTER COLUMN field_name DROP NOT NULL;

-- Add change_type column if missing
ALTER TABLE product_history ADD COLUMN IF NOT EXISTS change_type TEXT;