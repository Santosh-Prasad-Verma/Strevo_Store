"use client"

import Link from "next/link"
import { Package, Heart, Wallet, Ticket, RotateCcw } from "lucide-react"
import type { ProfileSummary } from "@/lib/types/database"

interface QuickTilesProps {
  summary: ProfileSummary
}

export function QuickTiles({ summary }: QuickTilesProps) {
  const tiles = [
    {
      icon: Package,
      label: "Orders",
      count: summary.orders_count,
      badge: summary.active_orders > 0 ? `${summary.active_orders} active` : null,
      href: "/profile/orders",
    },
    {
      icon: Heart,
      label: "Wishlist",
      count: summary.wishlist_count,
      href: "/wishlist",
    },
    {
      icon: Wallet,
      label: "Wallet",
      count: `₹${summary.wallet_balance.toFixed(0)}`,
      href: "/profile/wallet",
    },
    {
      icon: Ticket,
      label: "Coupons",
      count: summary.coupons_count,
      href: "/profile/coupons",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tiles.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="bg-white border rounded-none p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex flex-col items-center text-center gap-3">
            <tile.icon className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <p className="text-2xl font-bold">{tile.count}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{tile.label}</p>
              {tile.badge && (
                <p className="text-xs text-primary mt-1">{tile.badge}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
