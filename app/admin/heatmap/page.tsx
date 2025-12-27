"use client"

import { useEffect, useState } from "react"

export default function HeatmapViewer() {
  const [clicks, setClicks] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/heatmap")
      .then(r => r.json())
      .then(data => setClicks(data.clicks || []))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Heatmap Analytics</h1>
      <div className="border rounded-lg p-6">
        <p className="text-neutral-500 mb-4">Total Clicks: {clicks.length}</p>
        <div className="space-y-2">
          {clicks.slice(0, 20).map((click, i) => (
            <div key={i} className="flex items-center justify-between text-sm border-b pb-2">
              <span>{click.page_url}</span>
              <span className="text-neutral-500">({click.x_position}, {click.y_position})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
