"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, MapPin, Settings, Bell, Wallet, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/profile", label: "Overview", icon: User },
  { href: "/profile/orders", label: "Orders", icon: Package },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
  { href: "/profile/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile/coupons", label: "Coupons", icon: Ticket },
  { href: "/profile/notifications", label: "Notifications", icon: Bell },
  { href: "/profile/settings", label: "Settings", icon: Settings },
]

export function ProfileNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-none transition-colors",
              isActive
                ? "bg-black text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
