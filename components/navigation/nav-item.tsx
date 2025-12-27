"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuKey } from "@/lib/data/menu-data"

interface NavItemProps {
  label: string
  category: MenuKey
  isActive: boolean
  onToggle: (category: MenuKey | null) => void
  useDarkText?: boolean
}

export function NavItem({ label, category, isActive, onToggle, useDarkText = false }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true)
      onToggle(category)
    }, 100)
  }

  const handleClick = () => {
    onToggle(isActive ? null : category)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1 px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors",
        useDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        useDarkText ? "focus:ring-black" : "focus:ring-white",
        isActive && (useDarkText ? "text-black/70" : "text-white/70")
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={isActive}
      aria-haspopup="true"
      role="menuitem"
      suppressHydrationWarning
    >
      {label}
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform",
          isActive && "rotate-180"
        )}
      />
    </button>
  )
}
