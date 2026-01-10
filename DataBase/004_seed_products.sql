-- Insert the existing Nike products from the template
INSERT INTO products (id, name, description, price, category, image_url, stock_quantity, is_active)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Nike ZoomX Vomero Plus',
    'Premium running shoes with ZoomX foam technology for maximum comfort and performance',
    180.00,
    'RUNNING SHOES',
    '/products/nike-vomero.jpeg',
    50,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Nike Club Cap',
    'Classic baseball cap with Nike logo, perfect for everyday wear',
    25.00,
    'ACCESSORIES',
    '/products/nike-cap.jpeg',
    100,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Nike Tech Woven Pants',
    'Camo tracksuit with modern tech fabric for style and comfort',
    120.00,
    'MEN''S PANTS',
    '/products/nike-tech-set.jpeg',
    30,
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Jordan Fleece Hoodie',
    'Premium hoodie with signature Jordan graphics and fleece lining',
    85.00,
    'MEN''S HOODIE',
    '/products/jordan-hoodie.jpeg',
    75,
    true
  )
ON CONFLICT (id) DO NOTHING;
