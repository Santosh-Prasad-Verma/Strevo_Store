import { MeiliSearch } from 'meilisearch'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MEILI_HOST = process.env.MEILI_HOST || 'http://127.0.0.1:7700'
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const INDEX_NAME = 'products'
const BATCH_SIZE = 1000

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: string | null
  gender: string | null
  brand: string | null
  colors: string[]
  sizes: string[]
  subcategories: string[]
  tags: string[]
  images: any
  in_stock: boolean
  popularity: number
  created_at: string
}

async function bulkSync() {
  console.log('🚀 Starting Meilisearch bulk sync...')
  
  const meili = new MeiliSearch({
    host: MEILI_HOST,
    apiKey: MEILI_MASTER_KEY,
  })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    // Load index settings
    const settingsPath = path.join(process.cwd(), 'meilisearch', 'index-settings.json')
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))

    // Create or get index
    console.log(`📦 Setting up index: ${INDEX_NAME}`)
    const index = meili.index(INDEX_NAME)
    
    // Update settings
    await index.updateSettings(settings)
    console.log('✅ Index settings updated')

    // Fetch all products
    console.log('📥 Fetching products from Supabase...')
    let allProducts: Product[] = []
    let page = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1)

      if (error) throw error

      if (data && data.length > 0) {
        allProducts = allProducts.concat(data as Product[])
        console.log(`  Fetched ${data.length} products (total: ${allProducts.length})`)
        page++
      } else {
        hasMore = false
      }
    }

    if (allProducts.length === 0) {
      console.log('⚠️  No products found in database')
      return
    }

    // Transform products for Meilisearch
    const documents = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      category: p.category || '',
      gender: p.gender || '',
      brand: p.brand || '',
      colors: p.colors || [],
      sizes: p.sizes || [],
      subcategories: p.subcategories || [],
      tags: p.tags || [],
      images: p.images,
      in_stock: p.in_stock ?? true,
      popularity: p.popularity || 0,
      created_at: new Date(p.created_at).getTime(),
    }))

    // Index documents in batches
    console.log(`📤 Indexing ${documents.length} products...`)
    const taskUids: number[] = []
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE)
      const task = await index.addDocuments(batch, { primaryKey: 'id' })
      taskUids.push(task.taskUid)
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: Task ${task.taskUid} enqueued`)
    }

    // Wait for indexing to complete
    console.log('⏳ Waiting for indexing to complete...')
    await meili.waitForTasks(taskUids)

    // Get stats
    const stats = await index.getStats()
    console.log(`✅ Sync complete! Indexed ${stats.numberOfDocuments} documents`)

  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

bulkSync()
