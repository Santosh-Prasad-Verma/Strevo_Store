"use server"

import { createClient } from "@/lib/supabase/server"
import { DashboardStats, RevenueChartData, OrdersByStatus } from "@/lib/types/admin"

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [revenueToday, revenueMonth, ordersToday, ordersPending, totalUsers, totalProducts] = await Promise.all([
    supabase.from("orders").select("total").eq("payment_status", "paid").gte("created_at", today),
    supabase.from("orders").select("total").eq("payment_status", "paid").gte("created_at", startOfMonth),
    supabase.from("orders").select("id", { count: "exact" }).gte("created_at", today),
    supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("products").select("id", { count: "exact" }),
  ])

  return {
    revenue_today: revenueToday.data?.reduce((sum, o) => sum + o.total, 0) || 0,
    revenue_month: revenueMonth.data?.reduce((sum, o) => sum + o.total, 0) || 0,
    orders_today: ordersToday.count || 0,
    orders_pending: ordersPending.count || 0,
    total_users: totalUsers.count || 0,
    active_users: totalUsers.count || 0,
    total_products: totalProducts.count || 0,
    low_stock_products: 0,
  }
}

export async function getRevenueChart(days: number = 7): Promise<RevenueChartData[]> {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data } = await supabase
    .from("orders")
    .select("created_at, total")
    .eq("payment_status", "paid")
    .gte("created_at", startDate.toISOString())
    .order("created_at")

  const chartData: Record<string, { revenue: number; orders: number }> = {}

  data?.forEach((order) => {
    const date = order.created_at.split("T")[0]
    if (!chartData[date]) {
      chartData[date] = { revenue: 0, orders: 0 }
    }
    chartData[date].revenue += order.total
    chartData[date].orders += 1
  })

  return Object.entries(chartData).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }))
}

export async function getOrdersByStatus(): Promise<OrdersByStatus[]> {
  const supabase = await createClient()

  const { data, count } = await supabase.from("orders").select("status", { count: "exact" })

  const statusCounts: Record<string, number> = {}
  data?.forEach((order) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
  })

  const total = count || 1

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: (count / total) * 100,
  }))
}
