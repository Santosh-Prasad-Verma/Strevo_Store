import { MeiliSearch } from 'meilisearch'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MEILI_HOST = process.env.MEILI_HOST || 'http://127.0.0.1:7700'
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const INDEX_NAME = 'products'

async function realtimeSync() {
  console.log('🔄 Starting Meilisearch realtime sync...')
  
  const meili = new MeiliSearch({
    host: MEILI_HOST,
    apiKey: MEILI_MASTER_KEY,
  })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const index = meili.index(INDEX_NAME)

  // Subscribe to product changes
  const channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      async (payload) => {
        console.log(`📡 Change detected: ${payload.eventType}`)

        try {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const product = payload.new
            const document = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.description || '',
              price: product.price,
              category: product.category || '',
              gender: product.gender || '',
              brand: product.brand || '',
              colors: product.colors || [],
              sizes: product.sizes || [],
              subcategories: product.subcategories || [],
              tags: product.tags || [],
              images: product.images,
              in_stock: product.in_stock ?? true,
              popularity: product.popularity || 0,
              created_at: new Date(product.created_at).getTime(),
            }

            await index.addDocuments([document], { primaryKey: 'id' })
            console.log(`✅ ${payload.eventType}: ${product.name}`)
          }

          if (payload.eventType === 'DELETE') {
            await index.deleteDocument(payload.old.id)
            console.log(`🗑️  DELETE: ${payload.old.id}`)
          }
        } catch (error) {
          console.error('❌ Sync error:', error)
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Subscribed to product changes')
      }
    })

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down realtime sync...')
    supabase.removeChannel(channel)
    process.exit(0)
  })
}

realtimeSync()
