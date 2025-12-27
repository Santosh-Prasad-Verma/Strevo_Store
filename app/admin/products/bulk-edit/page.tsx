"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { getAllProducts, bulkUpdateProducts } from "@/lib/actions/admin"
import type { Product } from "@/lib/types/database"

export default function BulkEditPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [bulkChanges, setBulkChanges] = useState<Partial<Product> & { priceAdjustment?: number }>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await getAllProducts()
    setProducts(data)
    setLoading(false)
  }

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const selectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)))
    }
  }

  const handleBulkUpdate = async () => {
    if (selectedProducts.size === 0 || Object.keys(bulkChanges).length === 0) return

    setSaving(true)
    try {
      const { priceAdjustment, ...productUpdates } = bulkChanges;

      let updates;

      if (priceAdjustment !== undefined) {
        updates = Array.from(selectedProducts).map(id => {
          const product = products.find(p => p.id === id);
          if (!product) return null;
          
          const newPrice = product.price * (1 + priceAdjustment / 100);
          
          return {
            id,
            data: {
              ...productUpdates,
              price: Math.round(newPrice * 100) / 100,
            }
          };
        }).filter(Boolean);
      } else {
        updates = Array.from(selectedProducts).map(id => ({
          id,
          data: productUpdates
        }));
      }

      if(updates.length > 0) {
        const result = await bulkUpdateProducts(updates as { id: string, data: Partial<Product> }[]);
      
        if (result.success) {
          await loadProducts()
          setSelectedProducts(new Set())
          setBulkChanges({})
        }
      }

    } catch (error) {
      console.error('Bulk update failed:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-black">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold mt-2">Bulk Edit Products</h1>
        <p className="text-gray-600">Select products and apply changes to multiple items at once</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Bulk Changes
              </span>
              <span className="text-sm font-normal text-gray-500">
                {selectedProducts.size} products selected
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select onValueChange={(value) => setBulkChanges({...bulkChanges, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Adjustment (%)</label>
                <Input
                  type="number"
                  placeholder="e.g., 10 for +10%, -5 for -5%"
                  onChange={(e) => {
                    const adjustment = parseFloat(e.target.value)
                    if (!isNaN(adjustment)) {
                      setBulkChanges({...bulkChanges, priceAdjustment: adjustment})
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Stock Quantity</label>
                <Input
                  type="number"
                  placeholder="Set stock quantity"
                  onChange={(e) => {
                    const stock = parseInt(e.target.value)
                    if (!isNaN(stock)) {
                      setBulkChanges({...bulkChanges, stock_quantity: stock})
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={bulkChanges.is_active === true}
                  onCheckedChange={(checked) => 
                    setBulkChanges({...bulkChanges, is_active: checked as boolean})
                  }
                />
                <span className="text-sm">Set as Active</span>
              </label>

              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={bulkChanges.is_active === false}
                  onCheckedChange={(checked) => 
                    setBulkChanges({...bulkChanges, is_active: !checked})
                  }
                />
                <span className="text-sm">Set as Inactive</span>
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleBulkUpdate}
                disabled={selectedProducts.size === 0 || Object.keys(bulkChanges).length === 0 || saving}
                className="bg-black text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : `Apply to ${selectedProducts.size} Products`}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setBulkChanges({})}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button variant="outline" onClick={selectAll}>
                {selectedProducts.size === products.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={selectedProducts.size === products.length && products.length > 0}
                        onCheckedChange={selectAll}
                      />
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Product</th>
                    <th className="p-3 text-left text-sm font-medium">Category</th>
                    <th className="p-3 text-left text-sm font-medium">Price</th>
                    <th className="p-3 text-left text-sm font-medium">Stock</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img src={product.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{product.category}</td>
                      <td className="p-3 text-sm">${product.price}</td>
                      <td className="p-3 text-sm">{product.stock_quantity}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}