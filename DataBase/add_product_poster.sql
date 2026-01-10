-- Create product_poster table
CREATE TABLE IF NOT EXISTS product_poster (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default poster
INSERT INTO product_poster (image_url, link_url, is_active) 
VALUES ('', '/products', true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE product_poster ENABLE ROW LEVEL SECURITY;

-- Public can view active posters
CREATE POLICY "Anyone can view active posters"
  ON product_poster FOR SELECT
  USING (is_active = true);

-- Admins can manage posters
CREATE POLICY "Admins can manage posters"
  ON product_poster FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );