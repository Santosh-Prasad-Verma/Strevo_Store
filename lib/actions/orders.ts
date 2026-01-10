"use server"

import { createClient } from "@/lib/supabase/server"
import type { Order, OrderItem } from "@/lib/types/database"

export async function getUserOrders(): Promise<Order[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching user orders:", error.message?.replace(/[\r\n]/g, ' '))
    return []
  }

  return data || []
}

export async function getOrderById(orderId: string): Promise<(Order & { order_items: OrderItem[] }) | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("[v0] Error fetching order:", error.message?.replace(/[\r\n]/g, ' '))
    return null
  }

  return data
}
