import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCache, setCache } from "@/lib/cache/redis"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cacheKey = `profile:${user.id}`
    const { data: cached, hit } = await getCache(cacheKey)
    
    if (hit && cached) {
      return NextResponse.json(cached)
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error || !profile) {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
        })
        .select()
        .single()
      
      if (createError || !newProfile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }
      
      await setCache(cacheKey, newProfile, 120)
      return NextResponse.json(newProfile)
    }
    
    await setCache(cacheKey, profile, 120)
    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
