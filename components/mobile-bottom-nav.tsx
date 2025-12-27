"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, User } from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Search, label: "Shop" },
    { href: "/cart", icon: ShoppingBag, label: "Cart" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t hidden z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname === href ? "text-black" : "text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
