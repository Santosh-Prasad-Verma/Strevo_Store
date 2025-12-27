"use client"

import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"

export function UserNav() {
  const { user } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (user) {
      router.push("/profile")
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <button onClick={handleClick} className="cursor-pointer hover:text-gray-500 transition-colors">
      <User className="w-4 h-4 text-black" />
    </button>
  )
}
