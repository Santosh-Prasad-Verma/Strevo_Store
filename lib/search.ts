export function normalizeQuery(q: string): string {
  return q
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/-/g, ' ') // Hyphens to spaces
    .replace(/[^\w\s#+]/g, '') // Remove punctuation except # and +
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();
}

export function expandQueryVariants(q: string): string[] {
  const normalized = normalizeQuery(q);
  const variants = new Set<string>([normalized]);
  
  // Add hyphenated variant
  if (normalized.includes(' ')) {
    variants.add(normalized.replace(/\s+/g, '-'));
  }
  
  // Add concatenated variant
  if (normalized.includes(' ')) {
    variants.add(normalized.replace(/\s+/g, ''));
  }
  
  // Add original with spaces
  variants.add(q.toLowerCase().trim());
  
  return Array.from(variants);
}

export interface SearchFilters {
  brand?: string[];
  category?: string[];
  subcategory?: string[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  gender?: string;
}

export function buildMeiliSearchOptions(
  q: string,
  filters?: SearchFilters,
  page: number = 1,
  perPage: number = 20
) {
  const offset = (page - 1) * perPage;
  
  const filterParts: string[] = [];
  
  if (filters?.brand && filters.brand.length > 0) {
    filterParts.push(`brand IN [${filters.brand.map(b => `"${b}"`).join(', ')}]`);
  }
  
  if (filters?.category && filters.category.length > 0) {
    filterParts.push(`category IN [${filters.category.map(c => `"${c}"`).join(', ')}]`);
  }
  
  if (filters?.subcategory && filters.subcategory.length > 0) {
    filterParts.push(`subcategory IN [${filters.subcategory.map(s => `"${s}"`).join(', ')}]`);
  }
  
  if (filters?.minPrice !== undefined) {
    filterParts.push(`price >= ${filters.minPrice}`);
  }
  
  if (filters?.maxPrice !== undefined) {
    filterParts.push(`price <= ${filters.maxPrice}`);
  }
  
  if (filters?.colors && filters.colors.length > 0) {
    filterParts.push(`colors IN [${filters.colors.map(c => `"${c}"`).join(', ')}]`);
  }
  
  if (filters?.sizes && filters.sizes.length > 0) {
    filterParts.push(`sizes IN [${filters.sizes.map(s => `"${s}"`).join(', ')}]`);
  }
  
  if (filters?.inStock) {
    filterParts.push('in_stock = true');
  }
  
  if (filters?.gender) {
    filterParts.push(`gender = "${filters.gender}"`);
  }
  
  // Always filter active products
  filterParts.push('is_active = true');
  
  return {
    q: normalizeQuery(q),
    offset,
    limit: perPage,
    filter: filterParts.length > 0 ? filterParts.join(' AND ') : undefined,
    attributesToCrop: ['description:50'],
    attributesToHighlight: ['name', 'brand', 'category', 'description'],
    facets: ['brand', 'category', 'colors', 'sizes', 'price'],
    showMatchesPosition: true
  };
}

export function buildPostgresQuery(q: string, filters?: SearchFilters) {
  const normalized = normalizeQuery(q);
  const tsquery = normalized.split(' ').join(' & ');
  
  let sql = `
    SELECT 
      p.*,
      ts_rank(p.search_vector, to_tsquery('english', $1)) as rank,
      similarity(p.name, $2) as name_similarity
    FROM products p
    WHERE p.is_active = true
  `;
  
  const params: any[] = [tsquery, q];
  let paramIndex = 3;
  
  // Add filters
  if (filters?.brand && filters.brand.length > 0) {
    sql += ` AND p.brand = ANY($${paramIndex})`;
    params.push(filters.brand);
    paramIndex++;
  }
  
  if (filters?.category && filters.category.length > 0) {
    sql += ` AND p.category = ANY($${paramIndex})`;
    params.push(filters.category);
    paramIndex++;
  }
  
  if (filters?.minPrice !== undefined) {
    sql += ` AND p.price >= $${paramIndex}`;
    params.push(filters.minPrice);
    paramIndex++;
  }
  
  if (filters?.maxPrice !== undefined) {
    sql += ` AND p.price <= $${paramIndex}`;
    params.push(filters.maxPrice);
    paramIndex++;
  }
  
  if (filters?.inStock) {
    sql += ` AND p.stock_quantity > 0`;
  }
  
  if (filters?.gender) {
    sql += ` AND p.gender = $${paramIndex}`;
    params.push(filters.gender);
    paramIndex++;
  }
  
  sql += `
    AND (
      p.search_vector @@ to_tsquery('english', $1)
      OR p.name % $2
      OR p.brand % $2
    )
    ORDER BY rank DESC, name_similarity DESC
  `;
  
  return { sql, params };
}
