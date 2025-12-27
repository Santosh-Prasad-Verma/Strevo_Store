import { getDashboardStats, getRevenueChart, getOrdersByStatus } from "@/lib/actions/admin/dashboard"
import { DashboardClient } from "./dashboard-client"
import { requireAdmin } from "@/lib/auth/admin-guard"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const [stats, revenueChart, ordersByStatus] = await Promise.all([
    getDashboardStats(),
    getRevenueChart(7),
    getOrdersByStatus(),
  ])

  return <DashboardClient stats={stats} revenueChart={revenueChart} ordersByStatus={ordersByStatus} />
}
