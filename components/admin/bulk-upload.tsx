"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Download, FileText } from "lucide-react"
import { toast } from "sonner"

export function BulkUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a CSV or Excel file")
      return
    }

    setFile(selectedFile)
  }

  const uploadProducts = async () => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/products/bulk-upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Uploaded ${result.success} products successfully`)
        if (result.failed > 0) {
          toast.warning(`${result.failed} products failed to upload`)
        }
        setFile(null)
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `name,description,price,category,stock_quantity,size_type,available_sizes,image_url
"Sample Product","Product description",29.99,"men",100,"clothing","S,M,L,XL","https://example.com/image.jpg"`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Product Upload</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload CSV or Excel file
              </p>
            </label>
          </div>

          {file && (
            <div className="text-sm text-gray-600">
              Selected: {file.name}
            </div>
          )}

          <Button
            onClick={uploadProducts}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Products'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}