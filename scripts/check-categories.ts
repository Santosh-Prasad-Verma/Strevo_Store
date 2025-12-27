import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkCategories() {
  const { data, error } = await supabase
    .from('products')
    .select('name, category, gender, brand, size_type, available_sizes, description')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Products with all fields:')
  console.log(JSON.stringify(data, null, 2))
}

checkCategories()
