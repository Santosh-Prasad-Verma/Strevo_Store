"use client"

import { useEffect, useState } from "react"
import { Package, Truck, CheckCircle } from "lucide-react"

interface TrackingUpdate {
  status: string
  location: string
  notes: string
  created_at: string
}

export function OrderTracking({ orderId }: { orderId: string }) {
  const [tracking, setTracking] = useState<TrackingUpdate[]>([])

  useEffect(() => {
    fetch(`/api/orders/${orderId}/tracking`)
      .then(r => r.json())
      .then(data => setTracking(data.tracking || []))
  }, [orderId])

  const getIcon = (status: string) => {
    if (status === "delivered") return <CheckCircle className="w-6 h-6 text-green-500" />
    if (status === "in_transit") return <Truck className="w-6 h-6 text-blue-500" />
    return <Package className="w-6 h-6 text-neutral-500" />
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Track Your Order</h3>
      <div className="space-y-4">
        {tracking.map((update, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0">{getIcon(update.status)}</div>
            <div className="flex-1">
              <p className="font-semibold capitalize">{update.status.replace("_", " ")}</p>
              <p className="text-sm text-neutral-600">{update.location}</p>
              {update.notes && <p className="text-sm text-neutral-500">{update.notes}</p>}
              <p className="text-xs text-neutral-400">{new Date(update.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
