"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        setStatus(newStatus)
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className={`px-3 py-1 text-xs font-medium uppercase tracking-wider border-2 border-gray-300 focus:border-black outline-none ${
        status === "delivered"
          ? "bg-green-100 text-green-800"
          : status === "shipped"
            ? "bg-blue-100 text-blue-800"
            : status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  )
}
