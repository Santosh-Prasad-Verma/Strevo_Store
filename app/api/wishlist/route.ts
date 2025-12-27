import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json([])
    }

    const cacheKey = `wishlist:${user.id}`
    const cached = await getCache(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    const { data: items } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', user.id)
    
    await setCache(cacheKey, items || [], 300)
    
    return NextResponse.json(items || [])
  } catch (error) {
    console.error("Error in wishlist API:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}
