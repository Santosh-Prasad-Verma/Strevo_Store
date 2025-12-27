export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  brand?: string | null
  gender?: string | null
  image_url: string | null
  stock_quantity: number
  is_active: boolean
  size_type?: 'clothing' | 'shoes' | 'onesize' | 'none'
  available_sizes?: string[]
  size_stocks?: Record<string, number> | null
  has_variants: boolean
  created_at: string
  updated_at: string
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  color_hex?: string | null
  sku: string
  price: number
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id?: string | null
  quantity: number
  created_at: string
  updated_at: string
  products?: Product
  variant?: ProductVariant
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  shipping_full_name: string
  shipping_address_line1: string
  shipping_address_line2: string | null
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_country: string
  shipping_phone: string | null
  payment_method: string | null
  payment_status: "pending" | "paid" | "failed" | "refunded"
  stripe_payment_intent_id: string | null
  notes: string | null
  tracking_number: string | null
  carrier: string | null
  shipped_at: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id?: string | null
  product_name: string
  product_image_url: string | null
  variant_details?: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  address_type: "shipping" | "billing"
  full_name: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  is_admin: boolean
  is_active: boolean
  role?: string
  phone_verified: boolean
  email_verified: boolean
  last_login: string | null
  date_of_birth: string | null
  gender: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  payload: any
  read: boolean
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  two_factor_enabled: boolean
  language: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  currency: string
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  type: 'credit' | 'debit' | 'refund'
  amount: number
  description: string | null
  reference_id: string | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value: number | null
  max_discount: number | null
  valid_from: string
  valid_until: string
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  created_at: string
}

export interface UserCoupon {
  id: string
  user_id: string
  coupon_id: string
  used: boolean
  used_at: string | null
  created_at: string
  coupons?: Coupon
}

export interface ProfileSummary {
  orders_count: number
  active_orders: number
  wishlist_count: number
  wallet_balance: number
  coupons_count: number
  unread_notifications: number
}
