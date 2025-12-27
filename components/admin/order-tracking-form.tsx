"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface OrderTrackingFormProps {
  orderId: string
  currentTracking?: string
  currentCarrier?: string
}

export function OrderTrackingForm({ orderId, currentTracking, currentCarrier }: OrderTrackingFormProps) {
  const [tracking, setTracking] = useState(currentTracking || "")
  const [carrier, setCarrier] = useState(currentCarrier || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_number: tracking, carrier }),
      })

      if (!res.ok) throw new Error("Failed to update tracking")

      toast({ title: "Tracking information updated" })
      router.refresh()
    } catch (error) {
      toast({ title: "Failed to update tracking", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Carrier</Label>
        <Select value={carrier} onValueChange={setCarrier}>
          <SelectTrigger className="rounded-none">
            <SelectValue placeholder="Select carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Delhivery">Delhivery</SelectItem>
            <SelectItem value="Blue Dart">Blue Dart</SelectItem>
            <SelectItem value="DTDC">DTDC</SelectItem>
            <SelectItem value="FedEx">FedEx</SelectItem>
            <SelectItem value="DHL">DHL</SelectItem>
            <SelectItem value="India Post">India Post</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Tracking Number</Label>
        <Input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Enter tracking number"
          className="rounded-none"
        />
      </div>
      <Button type="submit" disabled={loading || !tracking || !carrier} className="rounded-none">
        {loading ? "Updating..." : "Update Tracking"}
      </Button>
    </form>
  )
}
