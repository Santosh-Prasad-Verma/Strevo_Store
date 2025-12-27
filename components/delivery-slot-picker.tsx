"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const slots = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM"
]

export function DeliverySlotPicker({ onSelect }: { onSelect: (date: string, time: string) => void }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split("T")[0]
  })

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Choose Delivery Slot</h3>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Select Date</p>
        <div className="grid grid-cols-4 gap-2">
          {dates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`border rounded p-2 text-sm ${selectedDate === date ? "border-black bg-neutral-50" : "border-neutral-200"}`}
            >
              {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-neutral-600 mb-2">Select Time</p>
        <div className="grid grid-cols-2 gap-2">
          {slots.map(slot => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`border rounded p-2 text-sm ${selectedTime === slot ? "border-black bg-neutral-50" : "border-neutral-200"}`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleConfirm} disabled={!selectedDate || !selectedTime} className="w-full">
        Confirm Slot
      </Button>
    </div>
  )
}
