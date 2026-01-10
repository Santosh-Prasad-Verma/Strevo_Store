-- Set your user as admin
-- Replace 'your-email@example.com' with your actual email

UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Or if you want to set the first user as admin:
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM profiles LIMIT 1);
