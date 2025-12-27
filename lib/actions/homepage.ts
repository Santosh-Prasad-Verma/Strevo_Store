"use server"

import { createClient } from "@/lib/supabase/server"

export interface HomepageContent {
  id: string
  section: string
  media_url: string
  media_type: "video" | "image"
  title: string | null
  description: string | null
  link_url: string | null
  button_text: string | null
  is_active: boolean
  display_order: number
}

export async function getHomepageContent() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .order("display_order")

    if (error) {
      console.error("Supabase error:", error)
      return []
    }
    return data as HomepageContent[]
  } catch (error) {
    console.error("Error fetching homepage content:", error)
    return []
  }
}

export async function updateHomepageContent(id: string, updates: Partial<HomepageContent>) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("homepage_content")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating homepage content:", error)
    throw error
  }
}
