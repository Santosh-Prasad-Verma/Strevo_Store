"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResults(null)
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const product: any = {}
      
      headers.forEach((header, index) => {
        product[header] = values[index] || ''
      })
      
      return product
    })
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const text = await file.text()
      const products = parseCSV(text)

      const response = await fetch('/api/admin/products/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      })

      const result = await response.json()
      setResults(result)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `name,description,price,category,image_url,stock_quantity,size_type,available_sizes
Sample Product,Product description,29.99,clothing,https://example.com/image.jpg,100,clothing,"S,M,L,XL"
Another Product,Another description,49.99,accessories,,50,onesize,`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-black">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold mt-2">Bulk Product Upload</h1>
        <p className="text-gray-600">Import multiple products from CSV file</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Download the CSV template with the required columns and format.
            </p>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              />
            </div>
            
            {file && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">{file.name}</span>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="bg-black text-white"
                >
                  {uploading ? "Uploading..." : "Upload Products"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.errors?.length > 0 ? (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                Upload Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">{results.imported}</div>
                    <div className="text-sm text-green-700">Products Imported</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded">
                    <div className="text-2xl font-bold text-red-600">{results.errors?.length || 0}</div>
                    <div className="text-sm text-red-700">Errors</div>
                  </div>
                </div>

                {results.errors?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Errors:</h4>
                    <div className="space-y-2">
                      {results.errors.map((error: any, index: number) => (
                        <div key={index} className="p-2 bg-red-50 rounded text-sm">
                          <strong>Row {error.row}:</strong> {error.error}
                          {error.product && <span className="text-gray-600"> ({error.product})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}