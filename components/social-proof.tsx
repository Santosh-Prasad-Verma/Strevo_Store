"use client"

import { Eye } from "lucide-react"

export function SocialProof({ count }: { count?: number }) {
  const viewers = count || Math.floor(Math.random() * 50) + 10

  return (
    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded px-3 py-2">
      <Eye className="w-4 h-4" />
      <span className="font-semibold">{viewers} people viewing this right now</span>
    </div>
  )
}
