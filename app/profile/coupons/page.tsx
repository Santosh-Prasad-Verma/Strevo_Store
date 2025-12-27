"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Ticket, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { UserCoupon } from "@/lib/types/database"

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<UserCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await fetch("/api/coupons")
        const data = await res.json()
        setCoupons(data)
      } catch (error) {
        console.error("Failed to load coupons", error)
      } finally {
        setLoading(false)
      }
    }
    loadCoupons()
  }, [])

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Coupon code copied!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">My Coupons</h2>

      {coupons.length === 0 ? (
        <div className="bg-white border rounded-none p-12 text-center">
          <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No coupons available</h3>
          <p className="text-muted-foreground">Check back later for exclusive offers</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((userCoupon) => {
            const coupon = userCoupon.coupons
            if (!coupon) return null

            const isExpired = new Date(coupon.valid_until) < new Date()
            const isUsed = userCoupon.used

            return (
              <div
                key={userCoupon.id}
                className={`bg-white border rounded-none p-6 ${
                  isUsed || isExpired ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-2xl font-bold tracking-wider">{coupon.code}</code>
                      {isUsed && <Badge variant="secondary">Used</Badge>}
                      {isExpired && <Badge variant="destructive">Expired</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-2">{coupon.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span>
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% OFF`
                          : `₹${coupon.discount_value} OFF`}
                      </span>
                      {coupon.min_order_value && (
                        <span className="text-muted-foreground">
                          Min order: ₹{coupon.min_order_value}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        Valid till {new Date(coupon.valid_until).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>
                  {!isUsed && !isExpired && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(coupon.code)}
                      className="rounded-none"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
