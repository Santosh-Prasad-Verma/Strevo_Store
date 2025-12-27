"use client"

import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { FilterBar } from "@/components/admin/filter-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types/database"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface OrdersClientProps {
  initialOrders: Order[]
  initialTotal: number
  initialTotalPages: number
}

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
}

export function OrdersClient({ initialOrders, initialTotal, initialTotalPages }: OrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fetchOrders = async (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      ...(status !== "all" && { status }),
      ...(search && { search }),
    })

    const res = await fetch(`/api/admin/orders?${params}`)
    const data = await res.json()

    setOrders(data.orders)
    setTotalPages(data.totalPages)
    setCurrentPage(page)
    setIsLoading(false)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    fetchOrders(1)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    fetchOrders(1)
  }

  const columns = [
    { key: "order_number", label: "Order #" },
    { key: "shipping_full_name", label: "Customer" },
    {
      key: "status",
      label: "Status",
      render: (order: Order) => (
        <Badge className={`${statusColors[order.status]} rounded-none`}>{order.status}</Badge>
      ),
    },
    {
      key: "total",
      label: "Amount",
      render: (order: Order) => `$${order.total.toFixed(2)}`,
    },
    {
      key: "created_at",
      label: "Date",
      render: (order: Order) => new Date(order.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (order: Order) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/orders/${order.id}`)}
          className="rounded-none"
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={search}
        onSearchChange={handleSearch}
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: handleStatusChange,
            options: [
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ],
          },
        ]}
        onReset={() => {
          setSearch("")
          setStatus("all")
          fetchOrders(1)
        }}
      />

      <DataTable
        data={orders}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchOrders}
        isLoading={isLoading}
      />
    </div>
  )
}
