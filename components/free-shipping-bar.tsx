"use client"

import { Truck } from "lucide-react"

export function FreeShippingBar({ cartTotal, threshold = 999 }: { cartTotal: number; threshold?: number }) {
  const remaining = threshold - cartTotal
  const progress = Math.min((cartTotal / threshold) * 100, 100)

  if (remaining <= 0) {
    return (
      <div className="bg-green-500 text-white px-4 py-3 text-center font-semibold">
        <Truck className="w-5 h-5 inline mr-2" />
        You've unlocked FREE shipping! 🎉
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 px-4 py-3">
      <p className="text-center text-sm font-semibold mb-2">
        Add ₹{remaining} more for FREE shipping!
      </p>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
