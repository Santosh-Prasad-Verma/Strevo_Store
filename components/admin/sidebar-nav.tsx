"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Users, Settings, BarChart, ShoppingBag, Bell } from "lucide-react"

export function SidebarNav() {
  const pathname = usePathname()

  const links = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <aside className="hidden md:flex w-64 bg-white border-r min-h-screen flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
