"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

const sessionTypes = [
  { id: "virtual", name: "Virtual Consultation", duration: "30 min", price: 499 },
  { id: "instore", name: "In-Store Session", duration: "60 min", price: 999 },
  { id: "wardrobe", name: "Wardrobe Audit", duration: "90 min", price: 1999 }
]

export function StylistBooking() {
  const [selected, setSelected] = useState("")
  const [date, setDate] = useState("")

  const bookSession = async () => {
    await fetch("/api/stylist-sessions", {
      method: "POST",
      body: JSON.stringify({
        sessionType: selected,
        sessionDate: date
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Book a Personal Stylist</h2>
        <p className="text-neutral-600">Expert fashion advice tailored to you</p>
      </div>

      <div className="space-y-4">
        {sessionTypes.map(type => (
          <div
            key={type.id}
            onClick={() => setSelected(type.id)}
            className={`border rounded-lg p-4 cursor-pointer ${selected === type.id ? "border-black bg-neutral-50" : "border-neutral-200"}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{type.name}</p>
                <p className="text-sm text-neutral-600">{type.duration}</p>
              </div>
              <p className="font-bold">₹{type.price}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="space-y-4">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
          <Button onClick={bookSession} disabled={!date} className="w-full">
            Book Session
          </Button>
        </div>
      )}
    </div>
  )
}
