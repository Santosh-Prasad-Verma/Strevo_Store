"use server"

import { createClient } from "@/lib/supabase/server"
import { Profile } from "@/lib/types/database"

export async function getUsers(params: { page?: number; pageSize?: number; search?: string }) {
  const supabase = await createClient()
  const { page = 1, pageSize = 20, search } = params

  let query = supabase.from("profiles").select("*", { count: "exact" })

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw error

  return {
    users: data as Profile[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId)

  if (error) throw error

  await supabase.rpc("log_admin_action", {
    p_action: isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
    p_entity_type: "user",
    p_entity_id: userId,
  })

  return { success: true }
}
