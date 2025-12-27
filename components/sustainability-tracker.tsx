"use client"

import { useEffect, useState } from "react"
import { Leaf, Droplet, TreePine } from "lucide-react"

interface Impact {
  co2_saved: number
  water_saved: number
  trees_planted: number
}

export function SustainabilityTracker({ userId }: { userId?: string }) {
  const [impact, setImpact] = useState<Impact>({ co2_saved: 0, water_saved: 0, trees_planted: 0 })

  useEffect(() => {
    if (!userId) return
    fetch(`/api/sustainability?userId=${userId}`)
      .then(r => r.json())
      .then(data => setImpact(data.impact || impact))
  }, [userId])

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-green-900">Your Eco Impact</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Leaf className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-900">{impact.co2_saved}kg</p>
          <p className="text-sm text-green-700">CO₂ Saved</p>
        </div>
        
        <div className="text-center">
          <Droplet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-green-900">{impact.water_saved}L</p>
          <p className="text-sm text-green-700">Water Saved</p>
        </div>
        
        <div className="text-center">
          <TreePine className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-900">{impact.trees_planted}</p>
          <p className="text-sm text-green-700">Trees Planted</p>
        </div>
      </div>
    </div>
  )
}
