export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  size?: string
  color?: string
  price: number
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductHistory {
  id: string
  product_id: string
  field_name: string
  old_value: string | null
  new_value: string | null
  changed_by: string
  change_type: 'price' | 'stock' | 'status' | 'details'
  created_at: string
}

export interface BulkUploadResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    message: string
  }>
}

export interface ProductFilter {
  category?: string
  status?: 'active' | 'inactive'
  priceMin?: number
  priceMax?: number
  stockMin?: number
  stockMax?: number
}

export interface BulkEditData {
  productIds: string[]
  updates: {
    category?: string
    price?: number
    stock_quantity?: number
    is_active?: boolean
  }
}