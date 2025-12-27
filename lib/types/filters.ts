export interface ProductFilters {
  category?: string
  subcategory?: string
  subcategories?: string[]
  brands?: string[]
  colors?: string[]
  sizes?: string[]
  materials?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  sort?: SortOption
  page?: number
  limit?: number
  collection?: string
  sale?: boolean
}

export type SortOption = 
  | 'newest' 
  | 'popular' 
  | 'price-asc' 
  | 'price-desc'
  | 'discount-desc'
  | 'name-asc'
  | 'name-desc'

export interface FilterFacets {
  categories: Record<string, number>
  subcategories: Record<string, number>
  brands: Record<string, number>
  colors: Record<string, number>
  sizes: Record<string, number>
  materials: Record<string, number>
  priceRange: { min: number; max: number }
}

export interface FilterResponse {
  products: any[]
  total: number
  pages: number
  facets: FilterFacets
  appliedFilters: ProductFilters
}
