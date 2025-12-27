"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Return {
  id: string
  order_id: string
  reason: string
  status: string
  created_at: string
}

export default function AdminReturns() {
  const [returns, setReturns] = useState<Return[]>([])

  useEffect(() => {
    fetch("/api/admin/returns")
      .then(r => r.json())
      .then(data => setReturns(data.returns || []))
  }, [])

  const approve = async (id: string) => {
    await fetch("/api/admin/returns/approve", {
      method: "POST",
      body: JSON.stringify({ returnId: id })
    })
    setReturns(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Returns Management</h1>
      <div className="space-y-4">
        {returns.map(ret => (
          <div key={ret.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">Order: {ret.order_id}</p>
              <p className="text-sm text-neutral-600">{ret.reason}</p>
              <p className="text-xs text-neutral-400">{new Date(ret.created_at).toLocaleDateString()}</p>
            </div>
            <Button onClick={() => approve(ret.id)} size="sm">Approve</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
