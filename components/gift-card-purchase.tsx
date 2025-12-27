"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"

const AMOUNTS = [500, 1000, 2000, 5000]

export function GiftCardPurchase() {
  const [amount, setAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/gift-cards/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: customAmount || amount,
          recipientEmail,
          recipientName,
          message
        })
      })

      const data = await res.json()

      if (data.success) {
        alert(`Gift card purchased! Code: ${data.code}`)
        // Reset form or redirect to payment
      }
    } catch (error) {
      alert("Failed to purchase gift card")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Purchase Gift Card</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Select Amount</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {AMOUNTS.map(amt => (
              <button
                key={amt}
                onClick={() => { setAmount(amt); setCustomAmount("") }}
                className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                  amount === amt && !customAmount
                    ? "border-purple-600 bg-purple-50"
                    : "border-neutral-200 hover:border-purple-300"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Recipient Email</Label>
          <Input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="recipient@email.com"
          />
        </div>

        <div>
          <Label>Recipient Name</Label>
          <Input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label>Personal Message (Optional)</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Happy Birthday! Enjoy shopping..."
            rows={3}
          />
        </div>

        <Button onClick={handlePurchase} disabled={loading} className="w-full" size="lg">
          {loading ? "Processing..." : `Purchase ₹${customAmount || amount} Gift Card`}
        </Button>
      </div>
    </div>
  )
}
