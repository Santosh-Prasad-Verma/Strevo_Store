"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Order } from "@/lib/types/database"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: Order["status"]
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: Order["status"]) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      toast({ title: "Status updated successfully" })
      router.refresh()
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" })
    }
  }

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px] rounded-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
        <SelectItem value="refunded">Refunded</SelectItem>
      </SelectContent>
    </Select>
  )
}
