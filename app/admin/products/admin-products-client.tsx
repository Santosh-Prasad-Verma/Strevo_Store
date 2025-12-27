"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Search, Filter, Download, Upload, Trash2, Edit, Eye, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BulkEdit } from "@/components/admin/bulk-edit"
import type { Product } from "@/lib/types/database"
import { formatINR } from "@/lib/utils/currency"
import { toast } from "sonner"

interface AdminProductsClientProps {
  initialProducts: Product[]
}

export function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && product.is_active) ||
                           (statusFilter === "inactive" && !product.is_active)
      
      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]
      
      if (sortBy === "price" || sortBy === "stock_quantity") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return
    
    if (!confirm(`Delete ${selectedProducts.length} products? This action cannot be undone.`)) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedProducts })
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)))
        setSelectedProducts([])
        toast.success(`Deleted ${selectedProducts.length} products`)
      } else {
        toast.error('Failed to delete products')
      }
    } catch (error) {
      toast.error('Failed to delete products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/products/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Products exported successfully')
    } catch (error) {
      toast.error('Failed to export products')
    }
  }

  const handleDuplicate = async (productId: string) => {
    try {
      const response = await fetch('/api/admin/products/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        const { product } = await response.json()
        setProducts(prev => [product, ...prev])
        toast.success('Product duplicated successfully')
      } else {
        toast.error('Failed to duplicate product')
      }
    } catch (error) {
      toast.error('Failed to duplicate product')
    }
  }

  const refreshProducts = () => {
    window.location.reload()
  }

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length
  const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-gray-500 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium tracking-widest uppercase">Back to Dashboard</span>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-medium tracking-widest uppercase mb-2">Product Management</h1>
                <p className="text-gray-500 text-sm tracking-wide">
                  {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href="/admin/products/bulk-upload">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </Link>
                <Link href="/admin/products/add">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={`${sortBy}:${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split(':')
                setSortBy(field)
                setSortOrder(order as "asc" | "desc")
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name:asc">Name A-Z</SelectItem>
                  <SelectItem value="name:desc">Name Z-A</SelectItem>
                  <SelectItem value="price:asc">Price Low-High</SelectItem>
                  <SelectItem value="price:desc">Price High-Low</SelectItem>
                  <SelectItem value="stock_quantity:asc">Stock Low-High</SelectItem>
                  <SelectItem value="stock_quantity:desc">Stock High-Low</SelectItem>
                  <SelectItem value="created_at:desc">Newest First</SelectItem>
                  <SelectItem value="created_at:asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <BulkEdit selectedProducts={selectedProducts} onComplete={refreshProducts} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="border-2 border-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-black">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className={isIndeterminate ? "data-[state=checked]:bg-blue-600" : ""}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 border border-gray-200">
                            <Image
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">ID: {product.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{formatINR(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${product.stock_quantity < 10 ? 'text-red-600 font-medium' : ''}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(product.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                ? "No products match your filters" 
                : "No products available"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}