<div align="center">

# 🛍️ Strevo Store

### Modern Streetwear E-Commerce Platform

*Built with Next.js 14, Supabase, and cutting-edge web technologies*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#️-tech-stack) • [Documentation](#-support)

</div>

---

## 🚀 Quick Start

<table>
<tr>
<td>

### 1️⃣ Install Dependencies
```bash
npm install
```

</td>
<td>

### 2️⃣ Setup Environment
```bash
cp .env.example .env.local
```
*Add your credentials to `.env.local`*

</td>
<td>

### 3️⃣ Run Development
```bash
npm run dev
```
*Visit [localhost:3000](http://localhost:3000)*

</td>
</tr>
</table>

## 🏗️ Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="48" height="48" alt="Next.js" />
<br><strong>Next.js 14</strong>
<br><sub>App Router</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br><strong>TypeScript</strong>
<br><sub>Type Safety</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="48" height="48" alt="Supabase" />
<br><strong>Supabase</strong>
<br><sub>PostgreSQL</sub>
</td>
<td align="center" width="20%">
<img src="https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=256" width="48" height="48" alt="Stripe" />
<br><strong>Stripe</strong>
<br><sub>Payments</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="48" height="48" alt="Tailwind" />
<br><strong>Tailwind CSS</strong>
<br><sub>+ shadcn/ui</sub>
</td>
</tr>
</table>

## 🌐 Environment Setup

<details>
<summary><strong>📝 Click to view required environment variables</strong></summary>

<br>

Create a `.env.local` file in the root directory:

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

> 💡 **Tip**: Get your Supabase credentials from [supabase.com/dashboard](https://supabase.com/dashboard) and Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com)

</details>

## 🎯 Features

<table>
<tr>
<td width="50%">

### 🛒 Customer Experience
- ✅ **Product Catalog** with advanced filters
- ✅ **Shopping Cart** with real-time updates
- ✅ **Secure Checkout** via Stripe
- ✅ **User Authentication** & profiles
- ✅ **Order Tracking** & history
- ✅ **Responsive Design** for all devices

</td>
<td width="50%">

### 🎨 Admin & Performance
- ✅ **Admin Dashboard** for management
- ✅ **Product Management** CRUD operations
- ✅ **Order Management** & analytics
- ✅ **Performance Optimized** with caching
- ✅ **SEO Friendly** with metadata
- ✅ **Type-Safe** with TypeScript

</td>
</tr>
</table>

## 📁 Project Structure

```
📦 Strevo Store
┣ 📂 app/
┃ ┣ 📂 api/              # API routes & webhooks
┃ ┣ 📂 admin/            # Admin dashboard pages
┃ ┣ 📂 products/         # Product catalog & details
┃ ┗ 📂 checkout/         # Checkout flow
┣ 📂 components/
┃ ┣ 📂 strevo/           # Custom brand components
┃ ┣ 📂 ui/               # Reusable UI components
┃ ┗ 📂 auth/             # Authentication components
┣ 📂 lib/
┃ ┣ 📂 actions/          # Server actions
┃ ┣ 📂 supabase/         # Database client & queries
┃ ┗ 📄 utils.ts          # Helper utilities
┗ 📂 public/             # Static assets
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server at `localhost:3000` |
| `npm run build` | 🏗️ Create optimized production build |
| `npm run start` | ▶️ Start production server |
| `npm run lint` | 🔍 Run ESLint for code quality |
| `npm run type-check` | ✅ Run TypeScript type checking |

## 📊 Admin Dashboard

<div align="center">

### 🔐 Access: `/admin`

</div>

<table>
<tr>
<td align="center" width="25%">
📦<br><strong>Product Management</strong><br><sub>Add, edit, delete products</sub>
</td>
<td align="center" width="25%">
📋<br><strong>Order Tracking</strong><br><sub>Monitor & manage orders</sub>
</td>
<td align="center" width="25%">
👥<br><strong>User Management</strong><br><sub>View customer data</sub>
</td>
<td align="center" width="25%">
📈<br><strong>Analytics</strong><br><sub>Sales & performance metrics</sub>
</td>
</tr>
</table>

## 🤝 Support & Documentation

<div align="center">

📚 **Documentation**: Check the `docs/` folder for detailed guides

💬 **Questions?** Open an issue for support

⭐ **Like this project?** Give it a star!

---

<sub>Built with ❤️ using Next.js and Supabase</sub>

</div>
