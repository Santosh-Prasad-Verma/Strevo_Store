-- Drop existing table if it exists
DROP TABLE IF EXISTS homepage_content CASCADE;

-- Create homepage_content table
CREATE TABLE homepage_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section text NOT NULL UNIQUE,
  media_url text NOT NULL,
  media_type text NOT NULL, -- 'video' or 'image'
  title text,
  description text,
  link_url text,
  button_text text,
  is_active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Insert default content
INSERT INTO homepage_content (section, media_url, media_type, title, description, link_url, button_text, display_order) VALUES
('hero_video', '/Hero_section.mp4', 'video', 'Defined by Precision', 'Technical Performance Wear', '/products', 'Shop Now', 1),
('video_section_left', 'https://vision-naire.com/cdn/shop/files/visionnaire-lookbook-7_1300x1300.jpg', 'image', '', 'See the whole collection', '/products', 'TO SEE', 2),
('video_section_right', 'https://www.youtube.com/embed/2gi7yT4lwkk', 'video', 'Experience Excellence', 'Discover our collection', '/products', 'Explore Collection', 3),
('two_column_left_1', 'https://vision-naire.com/cdn/shop/files/Visionnaire_ensemble_en_jean_brut_2_1300x1300.jpg', 'image', '', 'New beanies available in 3 colors', '/products', 'TO SEE', 4),
('two_column_right_1', 'https://vision-naire.com/cdn/shop/files/Visionnaire_echarpe_bonnet_85a4b6a2-6b77-4688-a5ed-f8ffc202645b_1300x1300.jpg', 'image', '', 'Long scarf available in 3 colors', '/products', 'TO SEE', 5),
('two_column_left_2', 'https://vision-naire.com/cdn/shop/files/visionnaire-lookbook-7_1300x1300.jpg', 'image', 'LOOKBOOK N°8', 'See the whole collection', '/products', 'TO SEE', 6),
('two_column_right_2', 'https://vision-naire.com/cdn/shop/files/visionnaire-lookbook-6_1300x1300.jpg', 'image', '', 'Visionary tracksuit, available in 4 colors.', '/products', 'TO SEE', 7)
ON CONFLICT (section) DO NOTHING;

-- Enable RLS
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Anyone can view homepage content" ON homepage_content FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage homepage content" ON homepage_content FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);
