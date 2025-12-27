"use client"

import { useEffect, useState } from "react"
import { Clock, Zap } from "lucide-react"
import Link from "next/link"

export function FlashSaleBanner() {
  const [sale, setSale] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    fetch("/api/flash-sales/active")
      .then(r => r.json())
      .then(data => setSale(data.sale))
  }, [])

  useEffect(() => {
    if (!sale) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(sale.end_time).getTime()
      const distance = end - now

      if (distance < 0) {
        setTimeLeft("ENDED")
        clearInterval(timer)
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(timer)
  }, [sale])

  if (!sale) return null

  return (
    <Link href="/flash-sale" className="block bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-4 hover:from-red-700 hover:to-orange-700 transition-all">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 animate-pulse" />
          <div>
            <p className="font-bold text-lg">{sale.name}</p>
            <p className="text-sm opacity-90">{sale.discount_percentage}% OFF</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-mono font-bold">{timeLeft}</span>
        </div>
      </div>
    </Link>
  )
}
