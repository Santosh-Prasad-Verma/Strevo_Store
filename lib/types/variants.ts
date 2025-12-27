export interface ProductVariant {
  id: string
  product_id: string
  size: string
  color: string
  stock_quantity: number
  price_adjustment?: number
  sku?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VariantCombination {
  size: string
  color: string
  stock: number
  priceAdjustment?: number
  sku?: string
}