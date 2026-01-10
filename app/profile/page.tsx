"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileHeader } from "@/components/profile/profile-header"
import { QuickTiles } from "@/components/profile/quick-tiles"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { AvatarUploadDialog } from "@/components/profile/avatar-upload-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { Profile, ProfileSummary } from "@/lib/types/database"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [summary, setSummary] = useState<ProfileSummary | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [profileRes, summaryRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/profile/summary"),
      ])
      
      if (profileRes.status === 401 || summaryRes.status === 401) {
        router.push("/auth/login?redirect=/profile")
        return
      }
      
      const profileData = await profileRes.json()
      const summaryData = await summaryRes.json()
      
      if (profileData.error) {
        console.error("Profile error:", profileData.error)
        return
      }
      
      setProfile(profileData)
      setSummary(summaryData)
    } catch (error) {
      console.error("Failed to load profile", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!profile || !summary) return null

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        onEditClick={() => setEditOpen(true)}
        onAvatarClick={() => setAvatarOpen(true)}
      />
      <QuickTiles summary={summary} />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} profile={profile} />
      <AvatarUploadDialog open={avatarOpen} onOpenChange={setAvatarOpen} onSuccess={loadData} />
    </div>
  )
}
