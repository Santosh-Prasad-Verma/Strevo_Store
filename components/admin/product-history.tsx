"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"
import { ProductHistory } from "@/lib/types/product-management"

interface ProductHistoryProps {
  productId: string
}

export function ProductHistoryComponent({ productId }: ProductHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<ProductHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/products/history?productId=${productId}`)
      const { history } = await response.json()
      setHistory(history || [])
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen, productId])

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'price': return 'bg-blue-100 text-blue-800'
      case 'stock': return 'bg-green-100 text-green-800'
      case 'status': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product History</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No history found</div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getChangeTypeColor(entry.change_type)}>
                      {entry.change_type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{entry.field_name}</span> changed from{' '}
                    <span className="text-red-600">{entry.old_value || 'null'}</span> to{' '}
                    <span className="text-green-600">{entry.new_value || 'null'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Changed by: {entry.changed_by}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}