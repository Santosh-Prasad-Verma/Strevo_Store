import { MeiliSearch } from 'meilisearch';

// Admin client (server-side only)
export const meiliAdmin = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_ADMIN_KEY || 'masterKey',
});

// Search-only client (can be exposed to client)
export const meiliSearch = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_SEARCH_KEY || process.env.MEILI_ADMIN_KEY || 'masterKey',
});

export const PRODUCTS_INDEX = 'products';
export const INDEX_VERSION = process.env.MEILI_INDEX_VERSION || 'v1';

/**
 * Get the current products index with version
 */
export function getProductsIndex(client: MeiliSearch = meiliSearch) {
  return client.index(`${PRODUCTS_INDEX}_${INDEX_VERSION}`);
}

/**
 * Initialize index with settings
 */
export async function initializeIndex() {
  const index = getProductsIndex(meiliAdmin);
  
  await index.updateSettings({
    searchableAttributes: [
      'name',
      'brand',
      'category',
      'subcategories',
      'tags',
      'description',
      'variants.sku',
      'variants.color',
      'variants.size',
    ],
    filterableAttributes: [
      'brand',
      'category',
      'subcategories',
      'price',
      'colors',
      'sizes',
      'materials',
      'is_active',
      'stock_quantity',
    ],
    sortableAttributes: [
      'price',
      'created_at',
      'stock_quantity',
    ],
    rankingRules: [
      'typo',
      'words',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],
    synonyms: {
      't-shirt': ['t shirt', 'tshirt', 'tee', 'tee shirt'],
      'hoodie': ['hoodies', 'sweatshirt', 'pullover'],
      'jeans': ['denim', 'pants'],
      'sneakers': ['shoes', 'trainers', 'kicks'],
    },
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
    },
    pagination: {
      maxTotalHits: 10000,
    },
  });
  
  console.log('✅ Meilisearch index initialized');
}
