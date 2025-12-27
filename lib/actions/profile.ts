"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Profile, ProfileSummary, UserSettings, Notification } from "@/lib/types/database"

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
}

export async function getProfileSummary(): Promise<ProfileSummary | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const [orders, wishlist, wallet, coupons, notifications] = await Promise.all([
    supabase.from("orders").select("id, status", { count: "exact" }).eq("user_id", user.id),
    supabase.from("wishlist").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("wallet").select("balance").eq("user_id", user.id).single(),
    supabase.from("user_coupons").select("id", { count: "exact" }).eq("user_id", user.id).eq("used", false),
    supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false),
  ])

  const activeOrders = orders.data?.filter(o => ["pending", "processing", "shipped"].includes(o.status)).length || 0

  return {
    orders_count: orders.count || 0,
    active_orders: activeOrders,
    wishlist_count: wishlist.count || 0,
    wallet_balance: wallet.data?.balance || 0,
    coupons_count: coupons.count || 0,
    unread_notifications: notifications.count || 0,
  }
}

export async function updateProfile(data: Partial<Profile>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error

  // Clear cache
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cache/clear?key=profile:${user.id}`, {
      method: 'POST'
    })
  } catch (e) {
    console.error('Failed to clear cache:', e)
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function updateAvatar(avatarUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) throw error

  // Clear cache
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cache/clear?key=profile:${user.id}`, {
      method: 'POST'
    })
  } catch (e) {
    console.error('Failed to clear cache:', e)
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return data
}

export async function updateUserSettings(settings: Partial<UserSettings>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("user_settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/profile/settings")
  return { success: true }
}

export async function getNotifications(limit = 20): Promise<Notification[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  return data || []
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/profile/notifications")
  return { success: true }
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)

  if (error) throw error

  revalidatePath("/profile/notifications")
  return { success: true }
}
