"use server"

import { createClient } from "@/lib/supabase/server"
import { Vendor } from "@/lib/types/admin"

export async function getVendors(params: { page?: number; pageSize?: number; status?: string }) {
  const supabase = await createClient()
  const { page = 1, pageSize = 20, status } = params

  let query = supabase.from("vendors").select("*", { count: "exact" })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw error

  return {
    vendors: data as Vendor[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function updateVendorStatus(vendorId: string, status: Vendor["status"]) {
  const supabase = await createClient()

  const { error } = await supabase.from("vendors").update({ status, updated_at: new Date().toISOString() }).eq("id", vendorId)

  if (error) throw error

  await supabase.rpc("log_admin_action", {
    p_action: "UPDATE_VENDOR_STATUS",
    p_entity_type: "vendor",
    p_entity_id: vendorId,
    p_details: { status },
  })

  return { success: true }
}
