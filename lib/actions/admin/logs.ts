"use server"

import { createClient } from "@/lib/supabase/server"
import { AuditLog } from "@/lib/types/admin"

export async function getAuditLogs(params: {
  page?: number
  pageSize?: number
  entityType?: string
  adminId?: string
}) {
  const supabase = await createClient()
  const { page = 1, pageSize = 50, entityType, adminId } = params

  let query = supabase.from("audit_logs").select("*", { count: "exact" })

  if (entityType && entityType !== "all") {
    query = query.eq("entity_type", entityType)
  }

  if (adminId) {
    query = query.eq("admin_id", adminId)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw error

  return {
    logs: data as AuditLog[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}
