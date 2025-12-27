"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/types/database"

export function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sizeType, setSizeType] = useState<"none" | "clothing" | "shoes" | "onesize" | "numeric">(
    (product.size_type as "none" | "clothing" | "shoes" | "onesize" | "numeric") || "none"
  )
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>(() => {
    // Initialize with existing size stocks or default to 0
    if (product.size_stocks) {
      return product.size_stocks
    }
    const stocks: Record<string, number> = {}
    if (product.available_sizes) {
      product.available_sizes.forEach(size => {
        stocks[size] = 0
      })
    }
    return stocks
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      stock_quantity: sizeType === "none" 
        ? parseInt(formData.get("stock_quantity") as string)
        : Object.values(sizeStocks).reduce((sum, val) => sum + val, 0),
      category: formData.get("category"),
      gender: formData.get("gender"),
      brand: formData.get("brand"),
      size_type: sizeType,
      available_sizes: sizeType !== "none" ? Object.keys(sizeStocks) : [],
      size_stocks: sizeType !== "none" ? sizeStocks : null,
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/admin/products")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-gray-500 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium tracking-widest uppercase">Back to Products</span>
          </Link>

          <h1 className="text-3xl font-medium tracking-widest uppercase mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" defaultValue={product.name} required className="mt-2" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product.description || ""}
                required
                className="mt-2"
                rows={10}
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" defaultValue={product.brand || ""} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="size_type">Size Type</Label>
              <select 
                id="size_type" 
                name="size_type" 
                required 
                className="mt-2 w-full border rounded-md px-3 py-2"
                value={sizeType}
                onChange={(e) => setSizeType(e.target.value as "none" | "clothing" | "shoes" | "onesize" | "numeric")}
              >
                <option value="none">No Sizes</option>
                <option value="clothing">Clothing (XS, S, M, L, XL)</option>
                <option value="shoes">Shoes (UK Sizes)</option>
                <option value="numeric">Numeric (28, 30, 32...)</option>
              </select>
            </div>

            {sizeType === "none" ? (
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity (One Size)</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={product.stock_quantity}
                  required
                  className="mt-2"
                />
              </div>
            ) : (
              <div>
                <Label>Stock by Size</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    {sizeType === "clothing" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const sizes = ['XS', 'S', 'M', 'L', 'XL']
                          const stocks: Record<string, number> = {}
                          sizes.forEach(size => stocks[size] = sizeStocks[size] || 0)
                          setSizeStocks(stocks)
                        }}
                      >
                        Use Standard Sizes
                      </Button>
                    )}
                    {sizeType === "shoes" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const sizes = ['6', '7', '8', '9', '10', '11', '12']
                          const stocks: Record<string, number> = {}
                          sizes.forEach(size => stocks[size] = sizeStocks[size] || 0)
                          setSizeStocks(stocks)
                        }}
                      >
                        Use UK Sizes (6-12)
                      </Button>
                    )}
                    {sizeType === "numeric" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const sizes = ['28', '30', '32', '34', '36', '38', '40']
                          const stocks: Record<string, number> = {}
                          sizes.forEach(size => stocks[size] = sizeStocks[size] || 0)
                          setSizeStocks(stocks)
                        }}
                      >
                        Use Numeric Sizes
                      </Button>
                    )}
                  </div>
                  <Input 
                    placeholder="Enter custom sizes (comma separated): S,M,L,XL" 
                    defaultValue={product.available_sizes?.join(',') || ''}
                    onBlur={(e) => {
                      const sizes = e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
                      if (sizes.length > 0) {
                        const stocks: Record<string, number> = {}
                        sizes.forEach(size => {
                          stocks[size] = sizeStocks[size] || 0
                        })
                        setSizeStocks(stocks)
                      }
                    }}
                  />
                  {Object.keys(sizeStocks).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      {Object.keys(sizeStocks).map(size => (
                        <div key={size}>
                          <Label className="text-xs">{size}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={sizeStocks[size]}
                            onChange={(e) => setSizeStocks(prev => ({
                              ...prev,
                              [size]: parseInt(e.target.value) || 0
                            }))}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={product.category} required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" name="gender" defaultValue={product.gender || ""} className="mt-2" />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-black text-white hover:bg-gray-800">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
