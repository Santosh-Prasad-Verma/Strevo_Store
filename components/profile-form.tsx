"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types/database"

interface ProfileFormProps {
  profile: Profile | null
  userId: string
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
        })
        .eq("id", userId)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="tracking-wide">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ""}
            disabled
            className="border-2 border-gray-300 bg-gray-50"
          />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fullName" className="tracking-wide">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border-2 border-gray-300 focus:border-black"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="tracking-wide">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="border-2 border-gray-300 focus:border-black"
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm tracking-wide ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {message.text}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-black text-white hover:bg-gray-800 text-xs font-medium tracking-widest uppercase"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="border-black text-black hover:bg-gray-100 text-xs font-medium tracking-widest uppercase bg-transparent"
        >
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
    </form>
  )
}
