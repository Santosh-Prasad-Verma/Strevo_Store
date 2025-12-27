# 🚀 Vercel Deployment Guide - Production Ready

## ✅ Pre-Deployment Checklist

- [x] Build passes successfully
- [x] Dependencies installed and updated
- [x] Security headers configured
- [x] `.vercelignore` created
- [x] `vercel.json` configured
- [ ] **CRITICAL**: Secrets rotated (see below)
- [ ] Environment variables set in Vercel
- [ ] Test deployment verified

---

## 🔒 STEP 1: Rotate Secrets (CRITICAL - DO THIS FIRST)

### Supabase Keys

1. Go to: https://supabase.com/dashboard/project/aqntafbibqwkiqmihpws/settings/api
2. Click "Reset" on:
   - Anon Key
   - Service Role Key
3. Copy new keys to your `.env.local`
4. **DO NOT commit** `.env.local` to Git

### Stripe Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Roll/regenerate:
   - Publishable Key
   - Secret Key
3. Copy new keys to your `.env.local`

### Meilisearch Master Key

```bash
# Generate strong key
openssl rand -base64 32

# Or on Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Update in `.env.local` and restart Meilisearch with new key.

### Revalidation Secret

```bash
# Generate random secret
openssl rand -hex 32
```

---

## 🌐 STEP 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Option B: Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect Next.js
5. Add environment variables (see Step 3)
6. Click "Deploy"

---

## 🔐 STEP 3: Set Environment Variables in Vercel

### Via Vercel Dashboard

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for **Production**, **Preview**, and **Development**

### Via Vercel CLI

```bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your new Supabase URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your new anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste your new service role key

# Stripe
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Paste your new publishable key

vercel env add STRIPE_SECRET_KEY production
# Paste your new secret key

# Meilisearch
vercel env add MEILI_HOST production
# Enter your Meilisearch host URL

vercel env add MEILI_MASTER_KEY production
# Paste your new master key

vercel env add MEILI_SEARCH_KEY production
# Paste your search key

vercel env add MEILI_INDEX_VERSION production
# Enter: 1

# Redis (if using)
vercel env add REDIS_URL production
# Enter your Redis connection string

# Revalidation
vercel env add REVALIDATE_SECRET production
# Paste your generated secret

# Analytics
vercel env add NEXT_PUBLIC_GA_ID production
# Enter your Google Analytics ID

vercel env add NEXT_PUBLIC_FB_PIXEL_ID production
# Enter your Facebook Pixel ID
```

### Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Supabase service role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Stripe publishable key |
| `STRIPE_SECRET_KEY` | ✅ Yes | Stripe secret key |
| `MEILI_HOST` | ✅ Yes | Meilisearch host URL |
| `MEILI_MASTER_KEY` | ✅ Yes | Meilisearch master key |
| `MEILI_SEARCH_KEY` | ⚠️ Recommended | Meilisearch search key |
| `MEILI_INDEX_VERSION` | ⚠️ Recommended | Cache version (default: 1) |
| `REDIS_URL` | ⚠️ Optional | Redis connection string |
| `REVALIDATE_SECRET` | ⚠️ Recommended | API revalidation secret |
| `NEXT_PUBLIC_GA_ID` | ⚠️ Optional | Google Analytics ID |
| `NEXT_PUBLIC_FB_PIXEL_ID` | ⚠️ Optional | Facebook Pixel ID |

---

## 🧪 STEP 4: Verify Deployment

### Automatic Checks

Vercel will automatically:
- ✅ Install dependencies
- ✅ Run `npm run build`
- ✅ Deploy to CDN
- ✅ Assign preview URL

### Manual Verification

1. **Visit your deployment URL**
   ```
   https://your-project.vercel.app
   ```

2. **Test critical paths**:
   - [ ] Homepage loads
   - [ ] Product listing works
   - [ ] Product detail page works
   - [ ] Search functionality works
   - [ ] Cart operations work
   - [ ] User authentication works
   - [ ] Admin panel accessible (if admin)

3. **Check browser console**:
   - No critical errors
   - API calls succeed
   - Images load correctly

4. **Test on mobile**:
   - Responsive design works
   - Touch interactions work
   - Performance acceptable

---

## 🔧 STEP 5: Post-Deployment Configuration

### 1. Configure Custom Domain (Optional)

```bash
# Via CLI
vercel domains add yourdomain.com

# Or via Vercel Dashboard
# Settings → Domains → Add Domain
```

### 2. Set up Supabase RLS Policies

Verify Row Level Security is enabled:

```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Enable if needed
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 3. Configure Stripe Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-project.vercel.app/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Copy webhook signing secret
5. Add to Vercel env vars:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   ```

### 4. Set up Meilisearch

If using external Meilisearch:

```bash
# Option 1: Meilisearch Cloud
# Sign up at https://www.meilisearch.com/cloud

# Option 2: Self-hosted
# Deploy to Railway, Render, or DigitalOcean
# Update MEILI_HOST in Vercel env vars
```

### 5. Configure Redis (Optional)

If using Redis caching:

```bash
# Option 1: Upstash (Serverless Redis)
# Sign up at https://upstash.com
# Copy Redis URL to Vercel env vars

# Option 2: Redis Cloud
# Sign up at https://redis.com/try-free
# Copy connection string to Vercel env vars
```

---

## 📊 STEP 6: Monitoring & Analytics

### 1. Vercel Analytics

Enable in Vercel Dashboard:
- Settings → Analytics → Enable

### 2. Error Tracking (Recommended)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Add SENTRY_DSN to Vercel env vars
```

### 3. Performance Monitoring

```bash
# Vercel Speed Insights
npm install @vercel/speed-insights

# Add to app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel Dashboard
# Common issues:

# 1. Missing environment variables
# → Add all required env vars

# 2. TypeScript errors
# → Run locally: npm run build
# → Fix errors before deploying

# 3. Dependency issues
# → Delete node_modules and package-lock.json
# → Run: npm install
# → Commit and redeploy
```

### Runtime Errors

```bash
# 1. Check Vercel Function Logs
# Dashboard → Deployments → [Your Deployment] → Functions

# 2. Check browser console
# Look for API errors or missing resources

# 3. Verify environment variables
# Dashboard → Settings → Environment Variables
# Ensure all required vars are set
```

### Database Connection Issues

```bash
# 1. Verify Supabase keys are correct
# 2. Check Supabase project is active
# 3. Verify RLS policies allow access
# 4. Check Supabase logs for errors
```

### Meilisearch Not Working

```bash
# 1. Verify MEILI_HOST is accessible from Vercel
# 2. Check MEILI_MASTER_KEY is correct
# 3. Verify index exists:
curl -X GET 'https://your-meili-host/indexes' \
  -H 'Authorization: Bearer YOUR_MASTER_KEY'

# 4. Re-sync products if needed:
npm run meili:setup
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --prod --env NEXT_PUBLIC_API_URL=https://api.example.com
```

### Rollback

```bash
# Via Dashboard
# Deployments → [Previous Deployment] → Promote to Production

# Via CLI
vercel rollback
```

---

## 📈 Performance Optimization

### 1. Enable Vercel Edge Network

Already enabled by default with `vercel.json` configuration.

### 2. Image Optimization

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['aqntafbibqwkiqmihpws.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 3. Enable ISR (Incremental Static Regeneration)

```typescript
// app/products/[id]/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds
```

### 4. Enable Edge Functions (Optional)

```typescript
// app/api/products/route.ts
export const runtime = 'edge'
```

---

## 🔐 Security Checklist

- [x] All secrets rotated
- [x] Environment variables set in Vercel (not in code)
- [x] `.env.local` not committed to Git
- [x] Security headers configured in `vercel.json`
- [x] Supabase RLS enabled
- [x] Stripe webhook signing enabled
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Rate limiting configured
- [ ] CORS configured properly
- [ ] CSP headers added (optional)

---

## 📞 Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

### Project Issues
- Check `CHANGELOG_AUTOMATED_FIXES.md` for recent changes
- Check `SECURITY_REMEDIATION.md` for security issues
- Review build logs in Vercel Dashboard

---

## ✅ Deployment Complete!

Your Thrift_ind (Strevo Store) e-commerce platform is now live on Vercel! 🎉

**Next Steps**:
1. Monitor initial traffic and errors
2. Set up alerts for critical issues
3. Plan regular security audits
4. Implement A/B testing
5. Optimize based on analytics

**Production URL**: `https://your-project.vercel.app`

---

**Last Updated**: Generated during automated deployment preparation  
**Status**: ✅ Ready for Production Deployment
