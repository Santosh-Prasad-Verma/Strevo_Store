# 🔐 Strevo Authentication System

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run development server
npm run dev

# 4. Visit auth pages
# Login: http://localhost:3000/auth/login
# Register: http://localhost:3000/auth/register
```

## Features

✅ **Email/Password Authentication**
- Secure password validation (8+ chars, uppercase, number, special char)
- Password strength meter with visual feedback
- Show/hide password toggle
- Remember me functionality

✅ **OAuth Providers**
- Google Sign-In (configured)
- Apple Sign-In (ready to configure)
- Facebook Sign-In (ready to configure)

✅ **Magic Link Sign-In**
- Passwordless authentication via email
- One-click sign-in from email

✅ **Security**
- HttpOnly cookies for session storage
- CSRF protection with SameSite cookies
- Input sanitization
- Rate limiting guidance
- Server-side validation

✅ **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- ARIA labels and live regions
- High contrast focus states

✅ **UX Features**
- Loading states with spinners
- Error messages with animations
- Success notifications
- Mobile-first responsive design
- Framer Motion animations

## File Structure

```
app/
├── auth/
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   └── callback/page.tsx       # OAuth callback handler
├── api/
│   └── auth/
│       └── set-session/route.ts # Secure session API

components/
├── auth/
│   ├── auth-provider.tsx       # Auth context provider
│   ├── login-form.tsx          # Login form component
│   ├── register-form.tsx       # Registration form
│   ├── oauth-buttons.tsx       # OAuth buttons
│   └── password-strength.tsx   # Password strength meter

lib/
├── auth/
│   ├── supabase-client.ts      # Client-side Supabase
│   ├── supabase-server.ts      # Server-side Supabase
│   └── validators.ts           # Form validation utilities

tests/
└── auth/
    ├── login.test.tsx          # Unit tests
    └── auth-flow.cy.ts         # E2E tests
```

## Environment Variables

Required in `.env.local`:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET=your_secret_key
```

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and keys to `.env.local`

### 2. Enable Auth Providers

**Email/Password:**
- Already enabled by default
- Configure email templates in Dashboard

**Google OAuth:**
1. Go to Authentication > Providers > Google
2. Enable Google provider
3. Add OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
4. Set authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### 3. Configure Redirect URLs

Add these URLs in Authentication > URL Configuration:

```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
https://your-domain.vercel.app/auth/callback
```

### 4. Customize Email Templates

Go to Authentication > Email Templates and customize:
- Confirmation email
- Magic link email  
- Password reset email

Use Strevo brand voice: minimal, premium, technical.

## Usage Examples

### Wrap App with AuthProvider

```tsx
// app/layout.tsx
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

### Use Auth in Components

```tsx
'use client'
import { useAuth } from '@/components/auth/auth-provider'

export function UserMenu() {
  const { user, signOut, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <Link href="/auth/login">Sign In</Link>
  }

  return (
    <div>
      <p>{user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protect Routes with Middleware

```tsx
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/profile/:path*', '/orders/:path*']
}
```

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
# Install Cypress
npm install -D cypress

# Open Cypress
npm run cypress:open

# Run headless
npm run cypress:run
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Set Environment Variables in Vercel

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all variables from `.env.local`

**CRITICAL:** Never commit `.env.local` to git!

### Update Supabase Redirect URLs

Add your production domain to Supabase:
```
https://your-app.vercel.app/auth/callback
```

## Security Best Practices

### ✅ Implemented

- HttpOnly cookies for session storage
- CSRF protection with SameSite=Lax
- Input sanitization on all forms
- Password strength requirements
- Server-side validation
- Service role key never exposed to client

### 🔄 Recommended Additions

**Rate Limiting:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**reCAPTCHA on Signup:**
```bash
npm install react-google-recaptcha
```

**2FA/MFA:**
- Enable in Supabase dashboard
- Add TOTP support

## Accessibility Checklist

- [x] Keyboard navigation (Tab, Enter, Escape)
- [x] Screen reader support (ARIA labels)
- [x] Focus management
- [x] Error announcements (aria-live)
- [x] High contrast focus states
- [x] Reduced motion support
- [x] Semantic HTML
- [x] Form validation feedback

## QA Manual Testing

- [ ] Register new account
- [ ] Verify email (if enabled)
- [ ] Login with email/password
- [ ] Logout
- [ ] Login with Google OAuth
- [ ] Send magic link
- [ ] Click magic link and verify login
- [ ] Test password strength meter
- [ ] Test form validation errors
- [ ] Test on mobile device
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Verify sessions persist on reload
- [ ] Test protected route redirects

## Troubleshooting

### OAuth not working
- Check redirect URLs match exactly
- Verify OAuth credentials in Supabase
- Check browser console for errors

### Sessions not persisting
- Check cookies in DevTools
- Verify `persistSession: true` in config
- Check for cookie blocking extensions

### Emails not sending
- Check Supabase email settings
- Verify email templates configured
- Check spam folder
- Check Supabase logs

## Support & Documentation

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Detailed setup guide

## Next Steps

- [ ] Add password reset flow
- [ ] Add email change functionality
- [ ] Add 2FA/MFA support
- [ ] Add session management page
- [ ] Add account deletion
- [ ] Integrate with user profile
- [ ] Add social profile sync
- [ ] Add analytics tracking

## License

Private - Strevo Store
