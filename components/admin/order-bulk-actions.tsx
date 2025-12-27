"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Package } from "lucide-react"

export function OrderBulkActions({ selectedIds, onComplete }: { selectedIds: string[], onComplete: () => void }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleBulkUpdate = async () => {
    setLoading(true)
    await fetch("/api/admin/orders/bulk-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: selectedIds, status })
    })
    setOpen(false)
    onComplete()
    setLoading(false)
  }

  const printInvoices = () => {
    selectedIds.forEach(id => window.open(`/admin/orders/${id}/invoice`, '_blank'))
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => setOpen(true)} disabled={selectedIds.length === 0}>
        <Package className="mr-2 h-4 w-4" />
        Bulk Update ({selectedIds.length})
      </Button>
      
      <Button onClick={printInvoices} disabled={selectedIds.length === 0} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Print Invoices
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {selectedIds.length} Orders</DialogTitle>
          </DialogHeader>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleBulkUpdate} disabled={loading || !status}>
            {loading ? "Updating..." : "Update Orders"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}