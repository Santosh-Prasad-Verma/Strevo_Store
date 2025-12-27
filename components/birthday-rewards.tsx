"use client"

import { useEffect, useState } from "react"
import { Gift } from "lucide-react"

interface Reward {
  discount_code: string
  discount_percent: number
  valid_until: string
}

export function BirthdayRewards({ userId }: { userId?: string }) {
  const [reward, setReward] = useState<Reward | null>(null)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/birthday-rewards?userId=${userId}`)
      .then(r => r.json())
      .then(data => setReward(data.reward))
  }, [userId])

  if (!reward) return null

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
      <div className="flex items-center gap-4">
        <Gift className="w-12 h-12" />
        <div>
          <h3 className="text-xl font-bold mb-1">🎉 Happy Birthday!</h3>
          <p className="mb-2">Here's a special gift for you</p>
          <div className="bg-white text-black px-4 py-2 rounded font-mono font-bold inline-block">
            {reward.discount_code}
          </div>
          <p className="text-sm mt-2 opacity-90">
            {reward.discount_percent}% off • Valid until {new Date(reward.valid_until).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
