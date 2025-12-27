"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { updateUserSettings } from "@/lib/actions/profile"
import { toast } from "sonner"
import type { UserSettings } from "@/lib/types/database"

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/profile/settings")
        const data = await res.json()
        setSettings(data)
      } catch (error) {
        console.error("Failed to load settings", error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    try {
      await updateUserSettings(settings)
      toast.success("Settings updated")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

      <div className="bg-white border rounded-none p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_notifications" className="cursor-pointer">
                Email Notifications
              </Label>
              <Switch
                id="email_notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, email_notifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms_notifications" className="cursor-pointer">
                SMS Notifications
              </Label>
              <Switch
                id="sms_notifications"
                checked={settings.sms_notifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, sms_notifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push_notifications" className="cursor-pointer">
                Push Notifications
              </Label>
              <Switch
                id="push_notifications"
                checked={settings.push_notifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, push_notifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing_emails" className="cursor-pointer">
                Marketing Emails
              </Label>
              <Switch
                id="marketing_emails"
                checked={settings.marketing_emails}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, marketing_emails: checked })
                }
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="two_factor_enabled" className="cursor-pointer">
              Two-Factor Authentication
            </Label>
            <Switch
              id="two_factor_enabled"
              checked={settings.two_factor_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, two_factor_enabled: checked })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving} className="rounded-none">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
