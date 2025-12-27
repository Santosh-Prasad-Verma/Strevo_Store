"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Edit } from "lucide-react"
import { toast } from "sonner"

interface BulkEditProps {
  selectedProducts: string[]
  onComplete: () => void
}

export function BulkEdit({ selectedProducts, onComplete }: BulkEditProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updates, setUpdates] = useState({
    category: '',
    price: '',
    priceAction: 'set', // 'set', 'increase', 'decrease'
    stock_quantity: '',
    stockAction: 'set',
    is_active: undefined as boolean | undefined
  })

  const handleBulkEdit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected")
      return
    }

    setIsUpdating(true)

    const updateData: any = {}
    
    if (updates.category) updateData.category = updates.category
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active
    
    if (updates.price) {
      const priceValue = parseFloat(updates.price)
      if (updates.priceAction === 'set') {
        updateData.price = priceValue
      } else {
        updateData.priceModifier = {
          action: updates.priceAction,
          value: priceValue
        }
      }
    }

    if (updates.stock_quantity) {
      const stockValue = parseInt(updates.stock_quantity)
      if (updates.stockAction === 'set') {
        updateData.stock_quantity = stockValue
      } else {
        updateData.stockModifier = {
          action: updates.stockAction,
          value: stockValue
        }
      }
    }

    try {
      const response = await fetch('/api/admin/products/bulk-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts,
          updates: updateData
        })
      })

      if (response.ok) {
        toast.success(`Updated ${selectedProducts.length} products`)
        setIsOpen(false)
        onComplete()
      } else {
        toast.error('Bulk edit failed')
      }
    } catch (error) {
      toast.error('Bulk edit failed')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          disabled={selectedProducts.length === 0}
        >
          <Edit className="w-4 h-4 mr-2" />
          Bulk Edit ({selectedProducts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Edit Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={updates.category} onValueChange={(value) => 
              setUpdates(prev => ({ ...prev, category: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price</Label>
            <div className="flex gap-2">
              <Select value={updates.priceAction} onValueChange={(value) => 
                setUpdates(prev => ({ ...prev, priceAction: value }))
              }>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Set to</SelectItem>
                  <SelectItem value="increase">Increase by</SelectItem>
                  <SelectItem value="decrease">Decrease by</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={updates.price}
                onChange={(e) => setUpdates(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Stock</Label>
            <div className="flex gap-2">
              <Select value={updates.stockAction} onValueChange={(value) => 
                setUpdates(prev => ({ ...prev, stockAction: value }))
              }>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Set to</SelectItem>
                  <SelectItem value="increase">Increase by</SelectItem>
                  <SelectItem value="decrease">Decrease by</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity"
                value={updates.stock_quantity}
                onChange={(e) => setUpdates(prev => ({ ...prev, stock_quantity: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Active Status</Label>
            <Switch
              checked={updates.is_active ?? false}
              onCheckedChange={(checked) => setUpdates(prev => ({ ...prev, is_active: checked }))}
            />
          </div>

          <Button
            onClick={handleBulkEdit}
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating...' : `Update ${selectedProducts.length} Products`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}