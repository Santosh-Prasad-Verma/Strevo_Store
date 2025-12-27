"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle2 } from "lucide-react"
import type { Profile } from "@/lib/types/database"

interface ProfileHeaderProps {
  profile: Profile
  onEditClick: () => void
  onAvatarClick: () => void
}

export function ProfileHeader({ profile, onEditClick, onAvatarClick }: ProfileHeaderProps) {
  const initials = profile.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative group cursor-pointer" onClick={onAvatarClick}>
            <Avatar className="h-24 w-24 border-2">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "User"} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{profile.full_name || "User"}</h1>
              {profile.email_verified && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{profile.email}</p>
            {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
          </div>

          <Button onClick={onEditClick} variant="outline" className="rounded-none">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
