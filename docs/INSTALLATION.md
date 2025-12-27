# 🚀 Profile Module - Installation Instructions

## Prerequisites

- Node.js 20+ installed
- Supabase account and project
- Git installed
- Code editor (VS Code recommended)

---

## Step-by-Step Installation

### 1️⃣ Install Dependencies

```bash
npm install zod date-fns
```

For testing (optional):
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

---

### 2️⃣ Run Database Migrations

**Option A: Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste content from `scripts/007_profile_module_schema.sql`
5. Click **Run**
6. Repeat for `scripts/008_profile_seed_data.sql`

**Option B: Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

### 3️⃣ Verify Database Setup

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'notifications',
  'user_settings',
  'wallet',
  'wallet_transactions',
  'coupons',
  'user_coupons',
  'profile_audit'
);

-- Should return 7 rows
```

---

### 4️⃣ Environment Variables

Your `.env.local` should already have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://aqntafbibqwkiqmihpws.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

---

### 5️⃣ Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/profile

---

### 6️⃣ Test the Features

**Create a Test User:**

1. Go to http://localhost:3000/auth/sign-up
2. Create an account
3. Verify email (check Supabase Auth)
4. Login

**Test Profile Module:**

1. Visit http://localhost:3000/profile
2. Click "Edit Profile" - update your name
3. Go to "Addresses" - add a new address
4. Check "Wallet" - should show ₹0.00
5. View "Coupons" - should show seeded coupons
6. Check "Settings" - toggle notifications

---

## 🔍 Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Database migrations completed
- [ ] All 7 new tables created
- [ ] RLS policies active
- [ ] Development server running
- [ ] Can access /profile page
- [ ] Can edit profile information
- [ ] Can add/edit/delete addresses
- [ ] Wallet page loads
- [ ] Coupons page shows data
- [ ] Settings page works
- [ ] No console errors

---

## 🐛 Troubleshooting

### Issue: "Module not found: zod"
```bash
npm install zod date-fns
```

### Issue: "Table does not exist"
**Solution:** Run database migrations in Supabase SQL Editor

### Issue: "Unauthorized" errors
**Solution:** 
1. Check if user is logged in
2. Verify Supabase connection
3. Check RLS policies are active

### Issue: Profile page shows loading forever
**Solution:**
1. Open browser console
2. Check for API errors
3. Verify `/api/profile` endpoint works
4. Check Supabase connection

### Issue: Can't add address
**Solution:**
1. Check `addresses` table exists
2. Verify RLS policies
3. Check form validation

---

## 🧪 Run Tests (Optional)

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 🐳 Docker Setup (Optional)

### Local Development with Docker

```bash
# Build and start
docker-compose up --build

# Access at http://localhost:3000
```

### Stop Docker

```bash
docker-compose down
```

---

## 📊 Verify Installation

Run this checklist:

```bash
# 1. Check if files exist
ls app/profile/
# Should show: layout.tsx, page.tsx, orders/, addresses/, etc.

# 2. Check components
ls components/profile/
# Should show: profile-header.tsx, quick-tiles.tsx, etc.

# 3. Check API routes
ls app/api/profile/
# Should show: route.ts, summary/, settings/

# 4. Check dependencies
npm list zod date-fns
# Should show installed versions
```

---

## 🎯 Next Steps After Installation

1. **Customize Branding**
   - Update colors in `tailwind.config.ts`
   - Modify component styles

2. **Add Sample Data**
   - Create test orders
   - Add wallet transactions
   - Assign coupons to users

3. **Configure Notifications**
   - Set up email templates
   - Configure notification triggers

4. **Deploy to Production**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Set up monitoring

---

## 📞 Need Help?

1. Check `PROFILE_MODULE_README.md` for features
2. See `DEVELOPER_GUIDE.md` for code examples
3. Review `DEPLOYMENT_GUIDE.md` for deployment
4. Check Supabase logs for errors
5. Review browser console for frontend errors

---

## ✅ Installation Complete!

If all checks pass, you're ready to use the Profile module!

**Test URL:** http://localhost:3000/profile

**What to do next:**
- Explore all profile pages
- Test CRUD operations
- Customize to your needs
- Deploy to production

---

**Happy Building! 🎉**
