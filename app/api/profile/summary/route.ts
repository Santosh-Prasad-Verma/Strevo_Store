import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [orders, wishlist, wallet, coupons, notifications] = await Promise.all([
      supabase.from("orders").select("id, status", { count: "exact" }).eq("user_id", user.id),
      supabase.from("wishlist").select("id", { count: "exact" }).eq("user_id", user.id),
      supabase.from("wallet").select("balance").eq("user_id", user.id).single(),
      supabase.from("user_coupons").select("id", { count: "exact" }).eq("user_id", user.id).eq("used", false),
      supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false),
    ])

    const activeOrders = orders.data?.filter(o => ["pending", "processing", "shipped"].includes(o.status)).length || 0

    const summary = {
      orders_count: orders.count || 0,
      active_orders: activeOrders,
      wishlist_count: wishlist.count || 0,
      wallet_balance: wallet.data?.balance || 0,
      coupons_count: coupons.count || 0,
      unread_notifications: notifications.count || 0,
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Profile summary error:", error)
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 })
  }
}
