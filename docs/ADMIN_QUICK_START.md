# Admin Dashboard - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migration

Open Supabase SQL Editor and run:

```sql
-- Copy and paste from scripts/009_admin_dashboard_schema.sql
```

### Step 2: Set Your User as Admin

```sql
UPDATE profiles 
SET is_admin = true, role = 'SUPER_ADMIN' 
WHERE email = 'your-email@example.com';
```

### Step 3: Access Dashboard

```bash
npm run dev
```

Navigate to: **http://localhost:3000/admin**

---

## 📊 What You Get

### Dashboard (`/admin`)
- Revenue today & monthly
- Orders count & pending
- Total users & products
- Revenue chart (7 days)
- Orders by status chart

### Orders (`/admin/orders`)
- List all orders with pagination
- Filter by status
- Search by order number or customer
- View order details
- Update order status
- All changes logged

### Users (`/admin/users`)
- List all users
- Search by email/name
- Activate/deactivate users

### Vendors (`/admin/vendors`)
- List all vendors
- Filter by status
- Approve/reject vendors
- View vendor stats

### Logs (`/admin/logs`)
- Complete audit trail
- Filter by entity type
- See who did what and when

### Settings (`/admin/settings`)
- Admin management
- Store configuration

---

## 🎨 Design

- **Black & White** aesthetic matching Thrift_ind
- **Responsive** - works on desktop, tablet, mobile
- **Sharp edges** - rounded-none everywhere
- **Clean layout** - sidebar + topbar + content

---

## 🔐 Security

- ✅ Admin-only access (RLS policies)
- ✅ Auth protection on all routes
- ✅ Audit logging for all actions
- ✅ Role-based access ready

---

## 📁 File Structure

```
/app/admin/
  ├── layout.tsx              → Auth guard + layout
  ├── page.tsx                → Dashboard
  ├── dashboard-client.tsx    → Dashboard UI
  ├── orders/
  │   ├── page.tsx
  │   ├── orders-client.tsx
  │   └── [id]/page.tsx       → Order detail
  ├── users/page.tsx
  ├── vendors/page.tsx
  ├── logs/page.tsx
  └── settings/page.tsx

/components/admin/
  ├── sidebar.tsx             → Navigation
  ├── topbar.tsx              → Header
  ├── kpi-card.tsx            → Metric cards
  ├── data-table.tsx          → Reusable table
  └── filter-bar.tsx          → Search + filters

/lib/actions/admin/
  ├── dashboard.ts            → Dashboard data
  ├── orders.ts               → Order operations
  ├── users.ts                → User operations
  ├── vendors.ts              → Vendor operations
  └── logs.ts                 → Audit logs

/app/api/admin/
  ├── orders/route.ts
  ├── users/route.ts
  ├── vendors/route.ts
  └── logs/route.ts
```

---

## 🛠️ Customization

### Add New KPI

```typescript
<KpiCard
  title="Your Metric"
  value="123"
  icon={YourIcon}
/>
```

### Add New Page

1. Create: `/app/admin/your-page/page.tsx`
2. Add to sidebar: `components/admin/sidebar.tsx`
3. Add title: `app/admin/layout.tsx`

### Add New Filter

```typescript
filters={[
  {
    key: "yourFilter",
    label: "Your Filter",
    value: filterValue,
    onChange: setFilterValue,
    options: [
      { value: "all", label: "All" },
      { value: "option1", label: "Option 1" },
    ],
  },
]}
```

---

## 🐛 Troubleshooting

**Can't access /admin**
→ Check `is_admin = true` in profiles table

**Charts not showing**
→ Recharts already installed, check data format

**"Not authorized" error**
→ Run database migration script

**Pagination not working**
→ Check API returns `total` and `totalPages`

---

## 📚 Full Documentation

See `ADMIN_DASHBOARD_README.md` for complete guide.

---

## ✨ Next Steps

1. ✅ Dashboard with KPIs & charts
2. ✅ Orders management with status updates
3. ✅ Users management
4. ✅ Vendors management
5. ✅ Audit logs
6. ⬜ Product CRUD in admin
7. ⬜ Role-based permissions
8. ⬜ Export to CSV
9. ⬜ Real-time notifications
10. ⬜ Advanced analytics

---

**Built with**: Next.js 14 + TypeScript + Tailwind CSS + Supabase + Recharts
