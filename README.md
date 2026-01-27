# 🛍️ Strevo Store

Modern streetwear e-commerce platform built with Next.js 14, Supabase, and advanced caching.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **UI**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## 🌐 Environment Setup

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
REVALIDATE_SECRET=your-secret-key
```

## 🎯 Features

- ✅ Product catalog with filters
- ✅ Shopping cart & checkout
- ✅ User authentication
- ✅ Order management
- ✅ Admin dashboard
- ✅ Stripe payments
- ✅ Responsive design
- ✅ Performance optimized

## 📁 Key Directories

```
app/
├── api/          # API routes
├── admin/        # Admin dashboard
├── products/     # Product pages
└── checkout/     # Checkout flow

components/
├── strevo/       # Brand components
├── ui/           # UI components
└── auth/         # Auth components

lib/
├── actions/      # Server actions
├── supabase/     # Database client
└── utils.ts      # Utilities
```

## 🔧 Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
```

## 📊 Admin Access

Visit `/admin` to access the admin dashboard for:
- Product management
- Order tracking
- User management
- Analytics

## 🤝 Support

For setup help, check the documentation in the `docs/` folder.
