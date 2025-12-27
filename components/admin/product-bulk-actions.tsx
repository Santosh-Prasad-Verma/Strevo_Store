"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BulkActionsProps {
  selectedIds: string[]
  onComplete: () => void
}

export function ProductBulkActions({ selectedIds, onComplete }: BulkActionsProps) {
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<string>("")
  const [value, setValue] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleBulkEdit = async () => {
    if (!action || !value) return
    
    setLoading(true)
    try {
      const updates: any = {}
      if (action === "price") updates.price = parseFloat(value)
      if (action === "status") updates.is_active = value === "active"
      if (action === "category") updates.category = value

      await fetch("/api/admin/products/bulk-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedIds, updates })
      })

      setOpen(false)
      onComplete()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={selectedIds.length === 0}>
        Bulk Edit ({selectedIds.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit {selectedIds.length} Products</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Action</Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Update Price</SelectItem>
                  <SelectItem value="status">Change Status</SelectItem>
                  <SelectItem value="category">Change Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {action === "price" && (
              <div>
                <Label>New Price</Label>
                <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="29.99" />
              </div>
            )}

            {action === "status" && (
              <div>
                <Label>Status</Label>
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {action === "category" && (
              <div>
                <Label>Category</Label>
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleBulkEdit} disabled={loading || !action || !value} className="w-full">
              {loading ? "Updating..." : "Apply Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}