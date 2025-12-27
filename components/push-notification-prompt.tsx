"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function PushNotificationPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hasAsked = localStorage.getItem("push-asked")
    if (!hasAsked && "Notification" in window) {
      setTimeout(() => setShow(true), 5000)
    }
  }, [])

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
      })

      await fetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription)
      })
    }

    localStorage.setItem("push-asked", "true")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-6 max-w-sm z-50">
      <button onClick={() => setShow(false)} className="absolute top-2 right-2">
        <X className="w-4 h-4" />
      </button>
      <h3 className="font-bold mb-2">Stay Updated!</h3>
      <p className="text-sm text-neutral-600 mb-4">Get notified about new arrivals and exclusive deals</p>
      <div className="flex gap-2">
        <Button onClick={requestPermission} size="sm">Enable</Button>
        <Button onClick={() => setShow(false)} variant="ghost" size="sm">Later</Button>
      </div>
    </div>
  )
}
