"use client"

import { useEffect, useState } from "react"
import { Truck, Zap, Store } from "lucide-react"

interface DeliveryOption {
  id: string
  name: string
  type: string
  price: number
  estimated_days: number
}

export function DeliveryOptions({ onSelect }: { onSelect: (id: string) => void }) {
  const [options, setOptions] = useState<DeliveryOption[]>([])
  const [selected, setSelected] = useState<string>("")

  useEffect(() => {
    fetch("/api/delivery-options")
      .then(r => r.json())
      .then(data => setOptions(data.options || []))
  }, [])

  const getIcon = (type: string) => {
    if (type === "express") return <Zap className="w-5 h-5" />
    if (type === "pickup") return <Store className="w-5 h-5" />
    return <Truck className="w-5 h-5" />
  }

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Delivery Method</h3>
      {options.map(option => (
        <div
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={`border rounded-lg p-4 cursor-pointer transition ${selected === option.id ? "border-black bg-neutral-50" : "border-neutral-200"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon(option.type)}
              <div>
                <p className="font-semibold">{option.name}</p>
                <p className="text-sm text-neutral-600">{option.estimated_days} days</p>
              </div>
            </div>
            <p className="font-bold">₹{option.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
