"use client"

import { useEffect, useState } from "react"
import { Award, Gift, TrendingUp } from "lucide-react"

export function LoyaltyCard({ userId }: { userId: string }) {
  const [loyalty, setLoyalty] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/loyalty/${userId}`)
      .then(r => r.json())
      .then(data => setLoyalty(data))
  }, [userId])

  if (!loyalty) return null

  const tierColors = {
    bronze: "bg-amber-700",
    silver: "bg-gray-400",
    gold: "bg-yellow-500",
    platinum: "bg-purple-600"
  }

  return (
    <div className={`${tierColors[loyalty.tier as keyof typeof tierColors]} text-white p-6 rounded-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-80">Loyalty Tier</p>
          <h3 className="text-2xl font-bold uppercase">{loyalty.tier}</h3>
        </div>
        <Award className="w-12 h-12 opacity-80" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-sm opacity-80">Available Points</p>
          <p className="text-3xl font-bold">{loyalty.points}</p>
        </div>
        <div>
          <p className="text-sm opacity-80">Lifetime Points</p>
          <p className="text-3xl font-bold">{loyalty.lifetime_points}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2 text-sm">
          <Gift className="w-4 h-4" />
          <span>1 point = ₹0.10 discount</span>
        </div>
      </div>
    </div>
  )
}
