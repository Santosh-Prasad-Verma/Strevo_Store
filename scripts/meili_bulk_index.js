const { MeiliSearch } = require('meilisearch');
const { createClient } = require('@supabase/supabase-js');

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700';
const MEILI_KEY = process.env.MEILI_ADMIN_KEY || 'masterKey';
const INDEX_VERSION = process.env.MEILI_INDEX_VERSION || 'v1';
const CHUNK_SIZE = 1000;

const meili = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function bulkIndex() {
  console.log('🚀 Starting bulk index...');
  const indexName = `products_${INDEX_VERSION}`;
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    console.log(`📦 Found ${products.length} products`);
    
    const documents = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand || 'Unknown',
      price: p.price,
      category: p.category,
      subcategories: p.subcategories || [],
      description: p.description,
      images: p.images || [],
      colors: p.colors || [],
      sizes: p.sizes || [],
      materials: p.materials || [],
      tags: p.tags || [],
      is_active: p.is_active,
      stock_quantity: p.stock_quantity || 0,
      created_at: p.created_at,
    }));
    
    const index = meili.index(indexName);
    
    for (let i = 0; i < documents.length; i += CHUNK_SIZE) {
      const chunk = documents.slice(i, i + CHUNK_SIZE);
      console.log(`📤 Indexing chunk ${i / CHUNK_SIZE + 1}/${Math.ceil(documents.length / CHUNK_SIZE)}`);
      
      const task = await index.addDocuments(chunk, { primaryKey: 'id' });
      await meili.waitForTask(task.taskUid);
    }
    
    console.log('✅ Bulk index complete!');
    console.log(`📊 Indexed ${documents.length} products to ${indexName}`);
    
  } catch (error) {
    console.error('❌ Bulk index failed:', error);
    process.exit(1);
  }
}

bulkIndex();
