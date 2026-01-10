"use client"

import Link from "next/link"
import { User, LogOut } from "lucide-react"
import { motion } from "framer-motion"

interface MenuProfileProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
}

export function MenuProfile({ user, onLogout }: MenuProfileProps) {
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-6 border-b border-neutral-200"
      >
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 px-4 text-sm uppercase tracking-[0.1em] font-medium hover:bg-neutral-800 transition-colors"
        >
          <User className="w-4 h-4" />
          Sign In
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="px-6 py-6 border-b border-neutral-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  // Remove all children and render a React fallback if possible
                  while (parent.firstChild) parent.removeChild(parent.firstChild);
                  // Optionally, you could trigger a state to render <User /> fallback
                }
              }}
            />
          ) : (
            <User className="w-6 h-6 text-neutral-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user.name}</p>
          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href="/profile"
          className="flex-1 text-center py-2 px-3 text-xs uppercase tracking-wider border border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-1 py-2 px-3 text-xs uppercase tracking-wider border border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </motion.div>
  )
}
