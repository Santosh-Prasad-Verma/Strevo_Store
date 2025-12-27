"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import type { VariantCombination } from "@/lib/types/variants"

interface VariantManagerProps {
  variants: VariantCombination[]
  onChange: (variants: VariantCombination[]) => void
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")

  const addVariant = () => {
    if (!newSize || !newColor) return
    
    const exists = variants.some(v => v.size === newSize && v.color === newColor)
    if (exists) return

    onChange([...variants, {
      size: newSize,
      color: newColor,
      stock: 0,
      priceAdjustment: 0
    }])
    
    setNewSize("")
    setNewColor("")
  }

  const updateVariant = (index: number, field: keyof VariantCombination, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Size (S, M, L, XL)"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
          />
          <Input
            placeholder="Color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
          />
          <Button onClick={addVariant}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded">
              <Badge variant="outline">{variant.size}</Badge>
              <Badge variant="outline">{variant.color}</Badge>
              <Input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Price ±"
                value={variant.priceAdjustment || 0}
                onChange={(e) => updateVariant(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeVariant(index)}
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