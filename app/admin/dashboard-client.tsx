"use client"

import { KpiCard } from "@/components/admin/kpi-card"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DashboardStats, RevenueChartData, OrdersByStatus } from "@/lib/types/admin"

interface DashboardClientProps {
  stats: DashboardStats
  revenueChart: RevenueChartData[]
  ordersByStatus: OrdersByStatus[]
}

export function DashboardClient({ stats, revenueChart, ordersByStatus }: DashboardClientProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Revenue Today"
          value={`$${stats.revenue_today.toFixed(2)}`}
          icon={DollarSign}
        />
        <KpiCard
          title="Orders Today"
          value={stats.orders_today}
          icon={ShoppingCart}
        />
        <KpiCard
          title="Total Users"
          value={stats.total_users}
          icon={Users}
        />
        <KpiCard
          title="Pending Orders"
          value={stats.orders_pending}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-none">
          <h3 className="text-lg font-bold mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 rounded-none">
          <h3 className="text-lg font-bold mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
