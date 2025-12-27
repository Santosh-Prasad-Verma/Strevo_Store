"use client"

import { useEffect, useState } from "react"
import { TrendingUp, DollarSign, Users, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InfluencerDashboard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<any>(null)
  const [code, setCode] = useState("")

  useEffect(() => {
    fetch(`/api/influencer/${userId}`)
      .then(r => r.json())
      .then(data => {
        setStats(data.stats)
        setCode(data.code)
      })
  }, [userId])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Influencer Dashboard</h2>
        <p className="opacity-90">Track your performance and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-neutral-600">Total Earnings</p>
              <p className="text-2xl font-bold">₹{stats.total_commission}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-neutral-600">Total Sales</p>
              <p className="text-2xl font-bold">₹{stats.total_sales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-neutral-600">Conversions</p>
              <p className="text-2xl font-bold">{stats.conversions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-bold mb-4">Your Influencer Code</h3>
        <div className="flex gap-2">
          <input
            value={code}
            readOnly
            className="flex-1 p-3 border rounded-lg bg-neutral-50"
          />
          <Button onClick={() => navigator.clipboard.writeText(code)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          Share this code with your followers to earn {stats.commission_rate}% commission on every sale!
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-bold mb-4">Recent Sales</h3>
        <div className="space-y-2">
          {stats.recent_sales?.map((sale: any, i: number) => (
            <div key={i} className="flex justify-between items-center p-3 bg-neutral-50 rounded">
              <div>
                <p className="font-medium">Order #{sale.order_id?.slice(0, 8)}</p>
                <p className="text-sm text-neutral-600">{new Date(sale.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{sale.sale_amount}</p>
                <p className="text-sm text-green-600">+₹{sale.commission_amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
