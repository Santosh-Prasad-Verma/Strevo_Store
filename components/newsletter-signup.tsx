"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    await fetch("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email })
    })

    setStatus("success")
    setEmail("")
  }

  return (
    <div className="bg-black text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="mb-6">Get exclusive deals and updates</p>
        {status === "success" ? (
          <p className="text-green-400">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white text-black"
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "..." : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
