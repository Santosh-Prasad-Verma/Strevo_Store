<div align="center">

![Strevo Store Banner](https://img.shields.io/badge/STREVO-STORE-FF6B6B?style=for-the-badge&labelColor=1a1a1a&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMyAzSDIxVjIxSDNWM1oiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==)

# 🛍️ **Strevo Store**

### ✨ Modern Streetwear E-Commerce Platform ✨

<p align="center">
  <em>Built with Next.js 14, Supabase, and cutting-edge web technologies</em>
</p>

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://supabase.com/">
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://stripe.com/">
    <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#️-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-support--documentation">Docs</a>
</p>

</div>

<br>

<div align="center">
  <img src="https://img.shields.io/github/license/Santosh-Prasad-Verma/Strevo_Store?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square" alt="Maintained" />
</div>

<br>

## 🚀 Quick Start

<div align="center">

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Santosh-Prasad-Verma/Strevo_Store.git
cd Strevo_Store

# 2️⃣ Install dependencies
npm install

# 3️⃣ Setup environment variables
cp .env.example .env.local
# Add your Supabase and Stripe credentials to .env.local

# 4️⃣ Run development server
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000) in your browser!**

</div>

## 🏗️ Tech Stack

<div align="center">

<table>
<tr>
<td align="center" width="20%">
<a href="https://nextjs.org/">
<img src="https://skillicons.dev/icons?i=nextjs" width="65" height="65" alt="Next.js" />
</a>
<br><strong>Next.js 14</strong>
<br><sub>App Router & RSC</sub>
</td>
<td align="center" width="20%">
<a href="https://www.typescriptlang.org/">
<img src="https://skillicons.dev/icons?i=typescript" width="65" height="65" alt="TypeScript" />
</a>
<br><strong>TypeScript</strong>
<br><sub>Type Safety</sub>
</td>
<td align="center" width="20%">
<a href="https://supabase.com/">
<img src="https://skillicons.dev/icons?i=supabase" width="65" height="65" alt="Supabase" />
</a>
<br><strong>Supabase</strong>
<br><sub>PostgreSQL + Auth</sub>
</td>
<td align="center" width="20%">
<a href="https://stripe.com/">
<img src="https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=256" width="65" height="65" alt="Stripe" />
</a>
<br><strong>Stripe</strong>
<br><sub>Secure Payments</sub>
</td>
<td align="center" width="20%">
<a href="https://tailwindcss.com/">
<img src="https://skillicons.dev/icons?i=tailwind" width="65" height="65" alt="Tailwind CSS" />
</a>
<br><strong>Tailwind CSS</strong>
<br><sub>+ shadcn/ui</sub>
</td>
</tr>
</table>

</div>

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

<div align="center">

### 🌟 What Makes Strevo Store Special?

</div>

<table>
<tr>
<td width="50%" valign="top">

### 🛒 **Customer Experience**

<br>

🎨 **Product Catalog** with advanced filters & search  
🛍️ **Shopping Cart** with real-time updates  
💳 **Secure Checkout** powered by Stripe  
🔐 **User Authentication** & profile management  
📦 **Order Tracking** & complete history  
📱 **Responsive Design** optimized for all devices  
⚡ **Lightning Fast** with Next.js 14 optimization  
🎭 **Beautiful UI** with Tailwind CSS & shadcn/ui  

</td>
<td width="50%" valign="top">

### 🎨 **Admin & Performance**

<br>

📊 **Admin Dashboard** with analytics  
✏️ **Product Management** full CRUD operations  
📋 **Order Management** & status tracking  
🚀 **Performance Optimized** with smart caching  
🔍 **SEO Friendly** with dynamic metadata  
🛡️ **Type-Safe** end-to-end with TypeScript  
💾 **Database** powered by Supabase PostgreSQL  
🔄 **Real-time Updates** with Supabase subscriptions  

</td>
</tr>
</table>

## 📁 Project Structure

<details>
<summary><strong>📂 Click to explore the project structure</strong></summary>

<br>

```
📦 Strevo Store
┣ 📂 app/                    # Next.js 14 App Directory
┃ ┣ 📂 api/                  # API routes & webhooks
┃ ┃ ┣ 📂 stripe/             # Stripe payment webhooks
┃ ┃ ┗ 📂 revalidate/         # Cache revalidation
┃ ┣ 📂 admin/                # Admin dashboard pages
┃ ┃ ┣ 📂 products/           # Product management
┃ ┃ ┗ 📂 orders/             # Order management
┃ ┣ 📂 products/             # Product catalog & details
┃ ┣ 📂 checkout/             # Checkout flow
┃ ┣ 📂 auth/                 # Authentication pages
┃ ┗ 📄 layout.tsx            # Root layout
┣ 📂 components/             # React components
┃ ┣ 📂 strevo/               # Custom brand components
┃ ┣ 📂 ui/                   # Reusable UI components (shadcn/ui)
┃ ┗ 📂 auth/                 # Authentication components
┣ 📂 lib/                    # Utility libraries
┃ ┣ 📂 actions/              # Server actions
┃ ┣ 📂 supabase/             # Database client & queries
┃ ┣ 📄 stripe.ts             # Stripe configuration
┃ ┗ 📄 utils.ts              # Helper utilities
┣ 📂 public/                 # Static assets
┃ ┣ 📂 images/               # Product images
┃ ┗ 📂 icons/                # App icons
┣ 📄 .env.local              # Environment variables
┣ 📄 next.config.js          # Next.js configuration
┣ 📄 tailwind.config.ts      # Tailwind CSS configuration
┗ 📄 tsconfig.json           # TypeScript configuration
```

</details>

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

<br>

<table>
<tr>
<td align="center" width="25%">
<br>
📦
<br><br>
<strong>Product Management</strong>
<br><br>
<sub>Add, edit, delete products<br>Manage inventory & pricing</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
📋
<br><br>
<strong>Order Tracking</strong>
<br><br>
<sub>Monitor & manage orders<br>Update order status</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
👥
<br><br>
<strong>User Management</strong>
<br><br>
<sub>View customer data<br>Manage user accounts</sub>
<br><br>
</td>
<td align="center" width="25%">
<br>
📈
<br><br>
<strong>Analytics</strong>
<br><br>
<sub>Sales & performance metrics<br>Revenue insights</sub>
<br><br>
</td>
</tr>
</table>

</div>

## 🤝 Contributing

<div align="center">

Contributions are always welcome! Feel free to open issues and pull requests.

</div>

## 📄 License

<div align="center">

This project is licensed under the MIT License.

</div>

## 💬 Support & Documentation

<div align="center">

<table>
<tr>
<td align="center">
<br>
📚
<br><br>
<strong>Documentation</strong>
<br><br>
<sub>Check the <code>docs/</code> folder<br>for detailed guides</sub>
<br><br>
</td>
<td align="center">
<br>
💬
<br><br>
<strong>Questions?</strong>
<br><br>
<sub>Open an issue<br>for support</sub>
<br><br>
</td>
<td align="center">
<br>
⭐
<br><br>
<strong>Like this project?</strong>
<br><br>
<sub>Give it a star<br>on GitHub!</sub>
<br><br>
</td>
</tr>
</table>

<br>

---

<br>

### Made with ❤️ by [Santosh Prasad Verma](https://github.com/Santosh-Prasad-Verma)

<sub>Built with Next.js 14, Supabase, Stripe, and Tailwind CSS</sub>

<br>

[![GitHub followers](https://img.shields.io/github/followers/Santosh-Prasad-Verma?style=social)](https://github.com/Santosh-Prasad-Verma)
[![GitHub stars](https://img.shields.io/github/stars/Santosh-Prasad-Verma/Strevo_Store?style=social)](https://github.com/Santosh-Prasad-Verma/Strevo_Store)

</div>
