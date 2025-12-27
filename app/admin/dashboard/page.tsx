"use client"

import { useEffect, useState } from "react"
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle, Eye } from "lucide-react"

interface Stats {
  revenue: number
  orders: number
  customers: number
  conversionRate: number
  liveVisitors: number
  activeCart: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    revenue: 0,
    orders: 0,
    customers: 0,
    conversionRate: 0,
    liveVisitors: 0,
    activeCart: 0
  })
  const [bestSellers, setBestSellers] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then(r => r.json())
      .then(setStats)

    fetch("/api/admin/dashboard/best-sellers")
      .then(r => r.json())
      .then(data => setBestSellers(data.products || []))

    fetch("/api/admin/dashboard/low-stock")
      .then(r => r.json())
      .then(data => setLowStock(data.products || []))
  }, [])

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-500">Revenue</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-500">Orders</span>
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{stats.orders}</p>
          <p className="text-sm text-blue-600 mt-1">+8% from last month</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-500">Customers</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{stats.customers}</p>
          <p className="text-sm text-purple-600 mt-1">+15% from last month</p>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Real-time Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Live Visitors</span>
              <span className="font-bold text-green-600">{stats.liveVisitors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Active Carts</span>
              <span className="font-bold text-orange-600">{stats.activeCart}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Conversion Rate</span>
              <span className="font-bold text-blue-600">{stats.conversionRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Total Products</span>
              <span className="font-bold">{bestSellers.length + lowStock.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Low Stock</span>
              <span className="font-bold text-orange-600">{lowStock.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Out of Stock</span>
              <span className="font-bold text-red-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-bold mb-4">Best Sellers</h3>
        <div className="space-y-3">
          {bestSellers.slice(0, 5).map((product, i) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-neutral-300">#{i + 1}</span>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-neutral-500">{product.sales || 0} sales</p>
                </div>
              </div>
              <p className="font-bold">₹{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900">
            <AlertTriangle className="w-5 h-5" />
            Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {lowStock.map(product => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-neutral-600">SKU: {product.sku || 'N/A'}</p>
                </div>
                <span className="bg-orange-500 text-white px-3 py-1 rounded font-bold">
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
