"use server"

import { createClient } from "@/lib/supabase/server"
import { Order } from "@/lib/types/database"

export async function getOrders(params: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
}) {
  const supabase = await createClient()
  const { page = 1, pageSize = 20, status, search } = params

  let query = supabase.from("orders").select("*", { count: "exact" })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (search) {
    query = query.or(`order_number.ilike.%${search}%,shipping_full_name.ilike.%${search}%`)
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw error

  return {
    orders: data as Order[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function getOrderById(id: string) {
  const supabase = await createClient()

  const [orderResult, itemsResult] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ])

  if (orderResult.error) throw orderResult.error

  return {
    order: orderResult.data as Order,
    items: itemsResult.data || [],
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const supabase = await createClient()

  const updateData: any = { status, updated_at: new Date().toISOString() }
  
  if (status === "shipped") {
    updateData.shipped_at = new Date().toISOString()
  } else if (status === "delivered") {
    updateData.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase.from("orders").update(updateData).eq("id", id)

  if (error) throw error

  await supabase.rpc("log_admin_action", {
    p_action: "UPDATE_ORDER_STATUS",
    p_entity_type: "order",
    p_entity_id: id,
    p_details: { status },
  })

  return { success: true }
}
