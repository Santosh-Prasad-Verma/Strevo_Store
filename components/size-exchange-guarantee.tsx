"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function SizeExchangeGuarantee({ orderId, productId }: { orderId: string; productId: string }) {
  const requestExchange = async () => {
    await fetch("/api/size-exchange", {
      method: "POST",
      body: JSON.stringify({ orderId, productId })
    })
  }

  return (
    <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <RefreshCw className="w-8 h-8 text-green-600 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Free Size Exchange Guarantee</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Wrong size? No problem! Exchange for free within 30 days. We'll send the new size and pick up the old one at no extra cost.
          </p>
          <Button onClick={requestExchange} variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
            Request Size Exchange
          </Button>
        </div>
      </div>
    </div>
  )
}
