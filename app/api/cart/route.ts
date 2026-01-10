import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCache, setCache } from '@/lib/cache/redis'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ items: [], total: 0 })
    }

    const cacheKey = `cart:${user.id}`
    const { data: cached, hit } = await getCache(cacheKey)
    
    if (hit && cached) {
      const response = NextResponse.json(cached)
      response.headers.set('X-Cache-Status', 'HIT')
      return response
    }

    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*, products(id, name, price, image_url)')
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Cart fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
    }
    
    const total = items?.reduce((sum, item) => sum + (item.products.price * item.quantity), 0) || 0
    const result = { items: items || [], total }
    
    await setCache(cacheKey, result, 30)
    
    const response = NextResponse.json(result)
    response.headers.set('X-Cache-Status', 'MISS')
    response.headers.set('Cache-Control', 'private, max-age=30')
    return response
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
