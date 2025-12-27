"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { ProductVariant } from "@/lib/types/product-management"

interface ProductVariantsProps {
  productId: string
  variants: ProductVariant[]
  onUpdate: (variants: ProductVariant[]) => void
}

export function ProductVariants({ productId, variants, onUpdate }: ProductVariantsProps) {
  const [newVariant, setNewVariant] = useState({
    sku: '',
    size: '',
    color: '',
    price: 0,
    stock_quantity: 0
  })

  const addVariant = () => {
    if (!newVariant.sku) return

    const variant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId,
      sku: newVariant.sku,
      size: newVariant.size || undefined,
      color: newVariant.color || undefined,
      price: newVariant.price,
      stock_quantity: newVariant.stock_quantity,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    onUpdate([...variants, variant])
    setNewVariant({ sku: '', size: '', color: '', price: 0, stock_quantity: 0 })
  }

  const removeVariant = (id: string) => {
    onUpdate(variants.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    onUpdate(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Variant */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <div>
            <Label>SKU</Label>
            <Input
              value={newVariant.sku}
              onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="SKU"
            />
          </div>
          <div>
            <Label>Size</Label>
            <Input
              value={newVariant.size}
              onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
              placeholder="Size"
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input
              value={newVariant.color}
              onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
              placeholder="Color"
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={newVariant.price}
              onChange={(e) => setNewVariant(prev => ({ ...prev, price: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              value={newVariant.stock_quantity}
              onChange={(e) => setNewVariant(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addVariant} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Existing Variants */}
        <div className="space-y-2">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center gap-2 p-2 border rounded">
              <Badge variant="outline">{variant.sku}</Badge>
              {variant.size && <Badge>{variant.size}</Badge>}
              {variant.color && <Badge variant="secondary">{variant.color}</Badge>}
              <Input
                type="number"
                value={variant.price}
                onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                className="w-20"
              />
              <Input
                type="number"
                value={variant.stock_quantity}
                onChange={(e) => updateVariant(variant.id, 'stock_quantity', Number(e.target.value))}
                className="w-20"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeVariant(variant.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}