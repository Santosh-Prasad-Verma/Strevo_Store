# 🔐 Authentication System - Complete Setup Guide

## Overview

Production-ready authentication system for Strevo with:
- Email/password login & registration
- OAuth (Google, Apple, Facebook)
- Magic link sign-in
- Secure session management
- Password strength validation
- Accessible forms with WCAG compliance

## Environment Variables

Add to `.env.local`:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # SERVER ONLY - Never expose to client

# Optional: reCAPTCHA (for bot protection)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET=your_secret_key
```

## Supabase Dashboard Setup

### 1. Enable Auth Providers

Go to **Authentication > Providers** in Supabase dashboard:

**Email Provider:**
- Enable "Email" provider
- Enable "Confirm email" if you want email verification
- Customize email templates

**Google OAuth:**
- Enable "Google" provider
- Add OAuth credentials from Google Cloud Console
- Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

**Apple OAuth (optional):**
- Enable "Apple" provider
- Configure Apple Developer credentials

### 2. Configure Redirect URLs

Go to **Authentication > URL Configuration**:

Add these redirect URLs:
```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
https://your-domain.vercel.app/auth/callback
```

### 3. Email Templates

Customize email templates in **Authentication > Email Templates**:
- Confirmation email
- Magic link email
- Password reset email

Use Strevo brand voice: minimal, premium, technical.

## Installation

```bash
# Install dependencies (if not already installed)
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js framer-motion lucide-react
```

## Usage

### 1. Wrap App with AuthProvider

Update `app/layout.tsx`:

```tsx
import { AuthProvider } from '@/components/auth/auth-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Use Auth in Components

```tsx
'use client'
import { useAuth } from '@/components/auth/auth-provider'

export function ProfileButton() {
  const { user, signOut, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <Link href="/auth/login">Sign In</Link>
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### 3. Protect Routes

Create middleware for protected routes:

```tsx
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protect /profile and /orders routes
  if (!session && (req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/orders'))) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/profile/:path*', '/orders/:path*']
}
```

## Security Features

### 1. Rate Limiting

Implement rate limiting using Vercel Edge Middleware or Upstash:

```bash
npm install @upstash/ratelimit @upstash/redis
```

```tsx
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests per 10 seconds
})
```

### 2. CSRF Protection

Built-in with Supabase Auth and SameSite cookies.

### 3. Input Sanitization

All inputs are sanitized using `sanitizeInput()` from validators.

### 4. Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

## Testing

### Unit Tests

```bash
npm run test
```

Example test file created at `tests/auth/login.test.tsx`

### E2E Tests

```bash
npm run cypress:open
```

Example E2E test at `tests/auth/auth-flow.cy.ts`

## Deployment to Vercel

### 1. Set Environment Variables

In Vercel dashboard, add all environment variables from `.env.local`

**CRITICAL:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is only set in Vercel (server-side), never commit to git.

### 2. Update Supabase Redirect URLs

Add your Vercel domain to Supabase redirect URLs:
```
https://your-app.vercel.app/auth/callback
```

### 3. Deploy

```bash
vercel --prod
```

## Observability

Auth events are logged with prefixes:
- `[AUTH] login_success`
- `[AUTH] login_failure`
- `[AUTH] signup_success`
- `[AUTH] signup_failure`
- `[AUTH] oauth_callback_received`

Integrate with Sentry or Datadog for production monitoring.

## Migration & Rollback

### Incremental Rollout

Use feature flags to gradually enable new auth:

```tsx
const NEW_AUTH_ENABLED = process.env.NEXT_PUBLIC_NEW_AUTH === 'true'

if (NEW_AUTH_ENABLED) {
  return <NewLoginForm />
} else {
  return <OldLoginForm />
}
```

### Rollback Plan

1. Set `NEXT_PUBLIC_NEW_AUTH=false` in Vercel
2. Redeploy previous version
3. Sessions remain valid (Supabase handles this)

## QA Checklist

- [ ] Create account with email/password
- [ ] Verify email (if enabled)
- [ ] Login with email/password
- [ ] Logout
- [ ] Login with Google OAuth
- [ ] Send magic link
- [ ] Click magic link and verify login
- [ ] Password strength validation works
- [ ] Error messages display correctly
- [ ] Form validation prevents invalid submissions
- [ ] Sessions persist across page reloads
- [ ] Protected routes redirect to login
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces errors
- [ ] Mobile responsive design
- [ ] Password show/hide toggle works
- [ ] Remember me checkbox works

## Troubleshooting

### OAuth not working
- Check redirect URLs in Supabase dashboard
- Verify OAuth credentials are correct
- Check browser console for errors

### Sessions not persisting
- Verify cookies are being set (check DevTools > Application > Cookies)
- Check `persistSession: true` in Supabase client config

### Email not sending
- Check Supabase email settings
- Verify email templates are configured
- Check spam folder

## Support

For issues, check:
1. Supabase logs (Dashboard > Logs)
2. Browser console errors
3. Network tab for failed requests
4. Vercel function logs

## Next Steps

- [ ] Add password reset flow
- [ ] Add email change flow
- [ ] Add 2FA/MFA
- [ ] Add social profile sync
- [ ] Add session management page
- [ ] Add account deletion
