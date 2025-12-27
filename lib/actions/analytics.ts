"use server"

import { createClient } from "@/lib/supabase/server"

export async function trackEvent(eventType: string, eventData?: any, pageUrl?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from("user_activity").insert({
    user_id: user?.id,
    event_type: eventType,
    event_data: eventData,
    page_url: pageUrl
  })
}

export async function getUserBrowsingHistory(userId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("user_activity")
    .select("event_data")
    .eq("user_id", userId)
    .eq("event_type", "product_view")
    .order("created_at", { ascending: false })
    .limit(20)

  return data?.map(d => d.event_data) || []
}

export async function getPersonalizedProducts(userId: string) {
  const history = await getUserBrowsingHistory(userId)
  const categories = [...new Set(history.map((h: any) => h.category).filter(Boolean))]
  
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .in("category", categories)
    .limit(12)

  return data || []
}
