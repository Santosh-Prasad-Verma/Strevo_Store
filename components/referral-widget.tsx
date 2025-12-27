"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from "lucide-react"

export function ReferralWidget({ userId }: { userId: string }) {
  const [code, setCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/referrals/code/${userId}`)
      .then(r => r.json())
      .then(data => setCode(data.code))
  }, [userId])

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = `${window.location.origin}?ref=${code}`

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-6 h-6" />
        <h3 className="text-xl font-bold">Refer & Earn</h3>
      </div>
      
      <p className="text-sm opacity-90 mb-4">
        Share your code and get ₹100 off when your friend makes their first purchase!
      </p>

      <div className="flex gap-2">
        <Input 
          value={code} 
          readOnly 
          className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
        />
        <Button onClick={copyCode} variant="secondary" size="icon">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      <div className="mt-4 flex gap-2">
        <Button 
          onClick={() => window.open(`https://wa.me/?text=Join Strevo with my code ${code} and get ₹100 off! ${shareUrl}`)}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          WhatsApp
        </Button>
        <Button 
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join Strevo with my code ${code}!&url=${shareUrl}`)}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          Twitter
        </Button>
      </div>
    </div>
  )
}
