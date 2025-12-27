"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react"

const methods = [
  { id: "upi", name: "UPI", icon: Smartphone },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "wallet", name: "Wallets", icon: Wallet },
  { id: "cod", name: "Cash on Delivery", icon: Banknote }
]

export function PaymentMethods({ onSelect }: { onSelect: (method: string) => void }) {
  const [selected, setSelected] = useState("")

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Payment Method</h3>
      {methods.map(method => {
        const Icon = method.icon
        return (
          <div
            key={method.id}
            onClick={() => handleSelect(method.id)}
            className={`border rounded-lg p-4 cursor-pointer transition ${selected === method.id ? "border-black bg-neutral-50" : "border-neutral-200"}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{method.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
