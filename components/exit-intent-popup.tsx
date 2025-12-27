"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem("exit-popup-shown")) {
        setShow(true)
        localStorage.setItem("exit-popup-shown", "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md relative">
        <button onClick={() => setShow(false)} className="absolute top-4 right-4">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-2">Wait! Don't Go Yet!</h2>
        <p className="text-neutral-600 mb-4">Get 10% off your first order</p>
        <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded p-4 text-center mb-4">
          <p className="text-2xl font-bold">FIRST10</p>
        </div>
        <Button onClick={() => setShow(false)} className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
