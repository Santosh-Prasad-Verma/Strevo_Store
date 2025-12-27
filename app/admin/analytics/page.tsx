"use client"

import { useEffect, useState } from "react"

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.json())
      .then(setStats)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6">
          <p className="text-neutral-500 text-sm">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-neutral-500 text-sm">Page Views</p>
          <p className="text-3xl font-bold">{stats.pageViews || 0}</p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-neutral-500 text-sm">Conversions</p>
          <p className="text-3xl font-bold">{stats.conversions || 0}</p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-neutral-500 text-sm">Newsletter Subs</p>
          <p className="text-3xl font-bold">{stats.subscribers || 0}</p>
        </div>
      </div>
    </div>
  )
}
