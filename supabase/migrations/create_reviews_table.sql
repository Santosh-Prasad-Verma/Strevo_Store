-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  product_name TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_reviews_approved ON reviews(is_approved, created_at DESC);

-- Insert sample data
INSERT INTO reviews (customer_name, rating, comment, product_name, is_approved) VALUES
('Rahul M.', 5, 'Perfect oversized fit. Love the quality!', 'Black Oversized Tee', true),
('Priya S.', 5, 'Quality feels premium for the price.', 'Cargo Pants', true),
('Arjun K.', 5, 'Strevo is my new go-to streetwear brand.', 'Denim Jacket', true),
('Neha R.', 5, 'Best streetwear I''ve ever owned.', 'Cropped Hoodie', true),
('Vikram P.', 5, 'Amazing quality and fast delivery.', 'Graphic Tee', true),
('Ananya D.', 5, 'Love the minimalist design.', 'Wide Leg Pants', true),
('Rohan T.', 5, 'Fits perfectly, great material.', 'Hoodie', true),
('Sneha K.', 4, 'Good quality, slightly expensive.', 'Jacket', true);
