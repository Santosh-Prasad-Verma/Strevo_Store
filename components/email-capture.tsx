"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email })
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-green-600 font-semibold">✓ Thanks for subscribing!</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 text-center">
      <Mail className="w-12 h-12 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">Get 10% Off Your First Order</h3>
      <p className="mb-6 opacity-90">Subscribe to our newsletter for exclusive deals</p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white text-black"
        />
        <Button type="submit" variant="secondary">Subscribe</Button>
      </form>
    </div>
  )
}
