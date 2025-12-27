import { MeiliSearch } from 'meilisearch'

const MEILI_HOST = process.env.MEILI_HOST || 'http://127.0.0.1:7700'
const MEILI_SEARCH_KEY = process.env.MEILI_SEARCH_KEY || ''

let searchClient: MeiliSearch | null = null
let productsIndex: any = null

// Meilisearch disabled - uncomment to enable
// /*
// try {
//   if (MEILI_HOST && MEILI_SEARCH_KEY) {
//     searchClient = new MeiliSearch({
//       host: MEILI_HOST,
//       apiKey: MEILI_SEARCH_KEY,
//     })
//     productsIndex = searchClient.index('products')
//   }
// } catch (error) {
//   console.warn('[Meilisearch] Client initialization failed:', error)
// }
// */

export { searchClient, productsIndex }

export interface SearchFilters {
  category?: string[]
  gender?: string[]
  brand?: string[]
  colors?: string[]
  sizes?: string[]
  priceMin?: number
  priceMax?: number
  inStock?: boolean
}

export interface SearchOptions {
  query?: string
  filters?: SearchFilters
  sort?: string[]
  page?: number
  perPage?: number
}

export async function searchProducts(options: SearchOptions) {
  if (!productsIndex) {
    return {
      hits: [],
      total: 0,
      facets: {},
      page: 1,
      perPage: 24,
      totalPages: 0,
    }
  }

  const {
    query = '',
    filters = {},
    sort = ['popularity:desc'],
    page = 1,
    perPage = 24,
  } = options

  const filterParts: string[] = []

  if (filters.category?.length) {
    filterParts.push(`category IN [${filters.category.map(c => `"${c}"`).join(', ')}]`)
  }
  if (filters.gender?.length) {
    filterParts.push(`gender IN [${filters.gender.map(g => `"${g}"`).join(', ')}]`)
  }
  if (filters.brand?.length) {
    filterParts.push(`brand IN [${filters.brand.map(b => `"${b}"`).join(', ')}]`)
  }
  if (filters.colors?.length) {
    filterParts.push(`colors IN [${filters.colors.map(c => `"${c}"`).join(', ')}]`)
  }
  if (filters.sizes?.length) {
    filterParts.push(`sizes IN [${filters.sizes.map(s => `"${s}"`).join(', ')}]`)
  }
  if (filters.priceMin !== undefined) {
    filterParts.push(`price >= ${filters.priceMin}`)
  }
  if (filters.priceMax !== undefined) {
    filterParts.push(`price <= ${filters.priceMax}`)
  }
  if (filters.inStock !== undefined) {
    filterParts.push(`in_stock = ${filters.inStock}`)
  }

  const filterString = filterParts.join(' AND ')

  const results = await productsIndex.search(query, {
    filter: filterString || undefined,
    sort,
    limit: perPage,
    offset: (page - 1) * perPage,
    facets: ['category', 'gender', 'brand', 'colors', 'sizes'],
  })

  return {
    hits: results.hits,
    total: results.estimatedTotalHits || 0,
    facets: results.facetDistribution || {},
    page,
    perPage,
    totalPages: Math.ceil((results.estimatedTotalHits || 0) / perPage),
  }
}
