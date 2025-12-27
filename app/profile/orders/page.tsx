"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ChevronRight } from "lucide-react"
import type { Order } from "@/lib/types/database"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error("Failed to load orders", error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border rounded-none p-12 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
        <Link href="/products">
          <Button className="rounded-none">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white border rounded-none p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-sm text-muted-foreground">#{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge className={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">₹{order.total.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{order.shipping_full_name}</p>
            </div>
            <Link href={`/orders/${order.id}`}>
              <Button variant="outline" className="rounded-none">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
