const { MeiliSearch } = require('meilisearch');
const { createClient } = require('@supabase/supabase-js');
const Redis = require('ioredis');

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700';
const MEILI_KEY = process.env.MEILI_ADMIN_KEY;
const INDEX_VERSION = process.env.MEILI_INDEX_VERSION || 'v1';

const meili = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

async function syncProduct(product) {
  const indexName = `products_${INDEX_VERSION}`;
  const index = meili.index(indexName);
  
  const document = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand || 'Unknown',
    price: product.price,
    category: product.category,
    subcategories: product.subcategories || [],
    description: product.description,
    images: product.images || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
    materials: product.materials || [],
    tags: product.tags || [],
    is_active: product.is_active,
    stock_quantity: product.stock_quantity || 0,
    created_at: product.created_at,
  };
  
  await index.addDocuments([document], { primaryKey: 'id' });
  console.log(`✅ Synced product: ${product.name}`);
  
  if (redis) {
    const keys = await redis.keys('search:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️  Purged ${keys.length} cache keys`);
    }
  }
}

async function deleteProduct(productId) {
  const indexName = `products_${INDEX_VERSION}`;
  const index = meili.index(indexName);
  
  await index.deleteDocument(productId);
  console.log(`🗑️  Deleted product: ${productId}`);
  
  if (redis) {
    const keys = await redis.keys('search:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

async function startRealtimeSync() {
  console.log('🔄 Starting realtime sync...');
  
  const channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'products' },
      async (payload) => {
        console.log('📥 INSERT:', payload.new.name);
        await syncProduct(payload.new);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'products' },
      async (payload) => {
        console.log('📝 UPDATE:', payload.new.name);
        await syncProduct(payload.new);
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'products' },
      async (payload) => {
        console.log('🗑️  DELETE:', payload.old.id);
        await deleteProduct(payload.old.id);
      }
    )
    .subscribe();
  
  console.log('✅ Realtime sync active');
}

startRealtimeSync();
