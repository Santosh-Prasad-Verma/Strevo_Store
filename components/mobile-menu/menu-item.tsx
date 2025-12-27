"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface MenuItemProps {
  href: string
  label: string
  icon?: LucideIcon
  badge?: string
  delay?: number
  onClick?: () => void
}

export function MenuItem({ href, label, icon: Icon, badge, delay = 0, onClick }: MenuItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          <span className="text-sm uppercase tracking-[0.15em] font-medium">{label}</span>
        </div>
        {badge && (
          <span className="bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </Link>
    </motion.div>
  )
}
