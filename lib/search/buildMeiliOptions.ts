import type { SearchParams } from 'meilisearch';

interface FilterOptions {
  category?: string;
  subcategories?: string[];
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Build Meilisearch search options from filter parameters
 */
export function buildMeiliOptions(filters: FilterOptions, page = 1, limit = 24): SearchParams {
  const filterArray: string[] = [];
  
  // Always filter active products
  filterArray.push('is_active = true');
  
  // Category filter
  if (filters.category) {
    filterArray.push(`category = "${filters.category}"`);
  }
  
  // Subcategories filter (OR condition)
  if (filters.subcategories && filters.subcategories.length > 0) {
    const subcatFilter = filters.subcategories
      .map(sub => `subcategories = "${sub}"`)
      .join(' OR ');
    filterArray.push(`(${subcatFilter})`);
  }
  
  // Brands filter (OR condition)
  if (filters.brands && filters.brands.length > 0) {
    const brandFilter = filters.brands
      .map(brand => `brand = "${brand}"`)
      .join(' OR ');
    filterArray.push(`(${brandFilter})`);
  }
  
  // Colors filter (OR condition)
  if (filters.colors && filters.colors.length > 0) {
    const colorFilter = filters.colors
      .map(color => `colors = "${color}"`)
      .join(' OR ');
    filterArray.push(`(${colorFilter})`);
  }
  
  // Sizes filter (OR condition)
  if (filters.sizes && filters.sizes.length > 0) {
    const sizeFilter = filters.sizes
      .map(size => `sizes = "${size}"`)
      .join(' OR ');
    filterArray.push(`(${sizeFilter})`);
  }
  
  // Materials filter (OR condition)
  if (filters.materials && filters.materials.length > 0) {
    const materialFilter = filters.materials
      .map(mat => `materials = "${mat}"`)
      .join(' OR ');
    filterArray.push(`(${materialFilter})`);
  }
  
  // Price range filter
  if (filters.minPrice !== undefined) {
    filterArray.push(`price >= ${filters.minPrice}`);
  }
  if (filters.maxPrice !== undefined) {
    filterArray.push(`price <= ${filters.maxPrice}`);
  }
  
  // Stock filter
  if (filters.inStock) {
    filterArray.push('stock_quantity > 0');
  }
  
  const options: SearchParams = {
    filter: filterArray.length > 0 ? filterArray : undefined,
    facets: [
      'brand',
      'category',
      'subcategories',
      'colors',
      'sizes',
      'materials',
    ],
    attributesToRetrieve: [
      'id',
      'name',
      'slug',
      'brand',
      'price',
      'images',
      'category',
      'subcategories',
      'colors',
      'sizes',
      'stock_quantity',
    ],
    attributesToCrop: ['description'],
    cropLength: 100,
    attributesToHighlight: ['name', 'brand', 'description'],
    limit,
    offset: (page - 1) * limit,
  };
  
  return options;
}

/**
 * Build sort parameter for Meilisearch
 */
export function buildSortParam(sort?: string): string[] | undefined {
  switch (sort) {
    case 'price-asc':
      return ['price:asc'];
    case 'price-desc':
      return ['price:desc'];
    case 'newest':
      return ['created_at:desc'];
    case 'oldest':
      return ['created_at:asc'];
    default:
      return undefined;
  }
}
