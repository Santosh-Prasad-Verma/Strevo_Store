import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cacheKey = `profile:${user.id}`
    const cached = await getCache(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
    
    await setCache(cacheKey, profile, 120)
    
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
