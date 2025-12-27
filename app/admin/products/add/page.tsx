"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [sizeType, setSizeType] = useState("none")
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>({})

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files])
      
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    imageFiles.forEach((file, index) => {
      formData.append(`image_${index}`, file)
    })
    formData.append("imageCount", imageFiles.length.toString())

    try {
      const response = await fetch("/api/admin/products/create", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        router.push("/admin/products")
        router.refresh()
      } else {
        setError("Failed to create product")
      }
    } catch (error) {
      setError("An error occurred")
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

          <h1 className="text-3xl font-medium tracking-widest uppercase mb-8">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" required className="mt-2" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required className="mt-2" rows={4} placeholder="Product description..." />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" className="mt-2" placeholder="e.g., Nike, Adidas" />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" required className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category (Where to show)</Label>
                <select id="category" name="category" required className="mt-2 w-full border rounded-md px-3 py-2">
                  <option value="">Select Category</option>
                  <option value="Men">Men ( in Men section)</option>
                  <option value="Women">Women ( in Women section)</option>
                  <option value="Accessories">Accessories ( in Accessories section)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">For Unisex: Choose Men or Women</p>
              </div>
              <div>
                <Label htmlFor="gender">Gender (Who can wear)</Label>
                <select id="gender" name="gender" required className="mt-2 w-full border rounded-md px-3 py-2">
                  <option value="">Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <select id="subcategory" name="subcategory" required className="mt-2 w-full border rounded-md px-3 py-2">
                <option value="">Select Subcategory</option>
                <optgroup label="Clothing">
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirt">Shirt</option>
                  <option value="Tops">Tops</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Sweatshirt">Sweatshirt</option>
                  <option value="Dress">Dress</option>
                  <option value="Track Suit">Track Suit</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Trouser">Trouser</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Skirt">Skirt</option>
                </optgroup>
                <optgroup label="Accessories">
                  <option value="CAP">CAP</option>
                  <option value="Belt">Belt</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Bag">Bag</option>
                  <option value="Socks">Socks</option>
                </optgroup>
              </select>
            </div>

            <div>
              <Label htmlFor="size_type">Size Type</Label>
              <select 
                id="size_type" 
                name="size_type" 
                required 
                className="mt-2 w-full border rounded-md px-3 py-2"
                onChange={(e) => setSizeType(e.target.value)}
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
                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" required className="mt-2" />
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
                          sizes.forEach(size => stocks[size] = 0)
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
                          sizes.forEach(size => stocks[size] = 0)
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
                          sizes.forEach(size => stocks[size] = 0)
                          setSizeStocks(stocks)
                        }}
                      >
                        Use Numeric Sizes
                      </Button>
                    )}
                  </div>
                  <Input 
                    placeholder="Enter custom sizes (comma separated): S,M,L,XL" 
                    onBlur={(e) => {
                      const sizes = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
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
                  <input type="hidden" name="size_stocks" value={JSON.stringify(sizeStocks)} />
                  <input type="hidden" name="available_sizes" value={Object.keys(sizeStocks).join(',')} />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="image">Product Images</Label>
              <div className="mt-2 space-y-4">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                        <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <label htmlFor="image" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer block hover:border-gray-400">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images (multiple)</p>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    multiple
                    required={imagePreviews.length === 0}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
