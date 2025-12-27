"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Exchange {
  id: string
  order_id: string
  reason: string
  status: string
  created_at: string
}

export default function AdminExchanges() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])

  useEffect(() => {
    fetch("/api/admin/exchanges")
      .then(r => r.json())
      .then(data => setExchanges(data.exchanges || []))
  }, [])

  const approve = async (id: string) => {
    await fetch("/api/admin/exchanges/approve", {
      method: "POST",
      body: JSON.stringify({ exchangeId: id })
    })
    setExchanges(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Exchanges Management</h1>
      <div className="space-y-4">
        {exchanges.map(exc => (
          <div key={exc.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">Order: {exc.order_id}</p>
              <p className="text-sm text-neutral-600">{exc.reason}</p>
              <p className="text-xs text-neutral-400">{new Date(exc.created_at).toLocaleDateString()}</p>
            </div>
            <Button onClick={() => approve(exc.id)} size="sm">Approve</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
