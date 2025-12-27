"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface ProductDuplicationProps {
  productId: string
  onComplete: () => void
}

export function ProductDuplication({ productId, onComplete }: ProductDuplicationProps) {
  const [isDuplicating, setIsDuplicating] = useState(false)

  const duplicateProduct = async () => {
    setIsDuplicating(true)

    try {
      const response = await fetch('/api/admin/products/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        toast.success('Product duplicated successfully')
        onComplete()
      } else {
        toast.error('Duplication failed')
      }
    } catch (error) {
      toast.error('Duplication failed')
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={duplicateProduct}
      disabled={isDuplicating}
    >
      <Copy className="w-4 h-4 mr-2" />
      {isDuplicating ? 'Duplicating...' : 'Duplicate'}
    </Button>
  )
}