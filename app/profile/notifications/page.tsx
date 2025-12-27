"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Check } from "lucide-react"
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/profile"
import { toast } from "sonner"
import type { Notification } from "@/lib/types/database"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to load notifications", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead(id)
      loadNotifications()
    } catch (error) {
      toast.error("Failed to mark as read")
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead()
      toast.success("All notifications marked as read")
      loadNotifications()
    } catch (error) {
      toast.error("Failed to mark all as read")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h2>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="rounded-none">
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border rounded-none p-12 text-center">
          <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-none p-4 ${
                !notification.read ? "border-l-4 border-l-black" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{notification.title}</h4>
                  {notification.message && (
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
