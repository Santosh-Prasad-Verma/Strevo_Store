import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json([])
    }

    const cacheKey = `wishlist:${user.id}`
    const { data: cached, hit } = await getCache(cacheKey)
    
    if (hit && cached) {
      return NextResponse.json(cached)
    }

    const { data: items, error } = await supabase
      .from('wishlist')
      .select('product_id, products(*)')
      .eq('user_id', user.id)
    
    if (error) {
      console.error("Wishlist query error:", error)
      return NextResponse.json([])
    }

    // Extract products from the nested structure
    const products = (items || [])
      .map(item => item.products)
      .filter(Boolean)
    
    await setCache(cacheKey, products, 300)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in wishlist API:", error)
    return NextResponse.json([])
  }
}
