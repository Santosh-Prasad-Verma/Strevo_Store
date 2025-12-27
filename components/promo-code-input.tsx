"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag, Check, X } from "lucide-react"

interface PromoCodeInputProps {
  cartTotal: number
  onApply: (discount: number, code: string) => void
}

export function PromoCodeInput({ cartTotal, onApply }: PromoCodeInputProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  const handleApply = async () => {
    if (!code.trim()) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartTotal })
      })

      const data = await res.json()

      if (data.valid) {
        setMessage({ type: 'success', text: `₹${data.discount} discount applied!` })
        setAppliedCode(code)
        onApply(data.discount, code)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Failed to apply code" })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setCode("")
    setAppliedCode(null)
    setMessage(null)
    onApply(0, "")
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="pl-10"
            disabled={!!appliedCode}
          />
        </div>
        {appliedCode ? (
          <Button onClick={handleRemove} variant="outline" size="icon">
            <X className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleApply} disabled={loading || !code.trim()}>
            {loading ? "..." : "Apply"}
          </Button>
        )}
      </div>

      {message && (
        <div className={`flex items-center gap-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}
