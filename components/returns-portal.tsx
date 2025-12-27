"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const reasons = [
  "Wrong size",
  "Defective product",
  "Not as described",
  "Changed mind",
  "Other"
]

export function ReturnsPortal({ orderId }: { orderId: string }) {
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    await fetch("/api/returns", {
      method: "POST",
      body: JSON.stringify({ orderId, reason, details })
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-bold mb-2">Return Request Submitted</h3>
        <p className="text-neutral-600">We'll process your return within 24 hours</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Request Return</h3>
      
      <div>
        <p className="text-sm font-semibold mb-2">Reason for return</p>
        <div className="space-y-2">
          {reasons.map(r => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Additional details</p>
        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Tell us more..."
          rows={4}
        />
      </div>

      <Button onClick={handleSubmit} disabled={!reason} className="w-full">
        Submit Return Request
      </Button>
    </div>
  )
}
