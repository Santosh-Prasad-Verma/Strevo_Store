import { MeiliSearch } from 'meilisearch';

let meiliAdminInstance: MeiliSearch | null = null;
let meiliSearchInstance: MeiliSearch | null = null;

// Admin client (server-side only)
export const meiliAdmin = (() => {
  if (!meiliAdminInstance && process.env.MEILI_HOST && process.env.MEILI_ADMIN_KEY) {
    try {
      meiliAdminInstance = new MeiliSearch({
        host: process.env.MEILI_HOST,
        apiKey: process.env.MEILI_ADMIN_KEY,
      });
    } catch (error) {
      console.warn('[MeiliSearch] Admin client initialization failed:', error);
    }
  }
  return meiliAdminInstance;
})();

// Search-only client (can be exposed to client)
export const meiliSearch = (() => {
  if (!meiliSearchInstance && process.env.MEILI_HOST) {
    try {
      meiliSearchInstance = new MeiliSearch({
        host: process.env.MEILI_HOST,
        apiKey: process.env.MEILI_SEARCH_KEY || process.env.MEILI_ADMIN_KEY || '',
      });
    } catch (error) {
      console.warn('[MeiliSearch] Search client initialization failed:', error);
    }
  }
  return meiliSearchInstance;
})();

export const PRODUCTS_INDEX = 'products';
export const INDEX_VERSION = process.env.MEILI_INDEX_VERSION || 'v1';

/**
 * Get the current products index with version
 */
export function getProductsIndex(client: MeiliSearch | null = meiliSearch) {
  if (!client) {
    throw new Error('MeiliSearch client not initialized');
  }
  return client.index(`${PRODUCTS_INDEX}_${INDEX_VERSION}`);
}

/**
 * Initialize index with settings
 */
export async function initializeIndex() {
  if (!meiliAdmin) {
    throw new Error('MeiliSearch admin client not initialized');
  }
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
