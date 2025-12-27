"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function WaitlistButton({ productId, productName }: { productId: string, productName: string }) {
  const [email, setEmail] = useState("")
  const [size, setSize] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email, size })
      })
      setSuccess(true)
    } catch (error) {
      alert("Failed to join waitlist")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Bell className="w-4 h-4 mr-2" />
          Notify When Available
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Waitlist - {productName}</DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-semibold mb-2">✓ You're on the list!</p>
            <p className="text-sm text-neutral-600">We'll email you when this item is back in stock.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Size (Optional)</label>
              <Input 
                value={size} 
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., M, L, XL"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
