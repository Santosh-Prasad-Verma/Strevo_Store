// Admin-specific types
export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPPORT'
  avatar_url: string | null
  is_active: boolean
  last_login: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  admin_id: string
  admin_email: string
  action: string
  entity_type: string
  entity_id: string | null
  details: any
  ip_address: string | null
  created_at: string
}

export interface DashboardStats {
  revenue_today: number
  revenue_month: number
  orders_today: number
  orders_pending: number
  total_users: number
  active_users: number
  total_products: number
  low_stock_products: number
}

export interface RevenueChartData {
  date: string
  revenue: number
  orders: number
}

export interface OrdersByStatus {
  status: string
  count: number
  percentage: number
}

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string | null
  status: 'pending' | 'approved' | 'rejected' | 'inactive'
  total_orders: number
  total_revenue: number
  rating: number | null
  created_at: string
  updated_at: string
}
