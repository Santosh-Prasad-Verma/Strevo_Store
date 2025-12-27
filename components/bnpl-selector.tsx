"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"

const plans = [
  { months: 3, fee: 0 },
  { months: 6, fee: 2 },
  { months: 12, fee: 5 }
]

export function BNPLSelector({ amount, onSelect }: { amount: number; onSelect: (plan: any) => void }) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (months: number) => {
    const plan = plans.find(p => p.months === months)
    const total = amount + (amount * (plan?.fee || 0) / 100)
    const installment = total / months
    
    setSelected(months)
    onSelect({ months, installment, total })
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Buy Now Pay Later
      </h3>
      {plans.map(plan => {
        const total = amount + (amount * plan.fee / 100)
        const installment = total / plan.months
        
        return (
          <div
            key={plan.months}
            onClick={() => handleSelect(plan.months)}
            className={`border rounded-lg p-4 cursor-pointer transition ${selected === plan.months ? "border-black bg-neutral-50" : "border-neutral-200"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{plan.months} Monthly Installments</p>
                <p className="text-sm text-neutral-600">₹{installment.toFixed(2)}/month</p>
              </div>
              <p className="text-sm text-neutral-500">{plan.fee}% fee</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
