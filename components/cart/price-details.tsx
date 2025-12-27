"use client"

import { useState } from "react"
import { formatINR } from "@/lib/utils/currency"
import { Tag, Shield, Package, RotateCcw } from "lucide-react"
import type { CartItem, Product } from "@/lib/types/database"
import { toast } from "sonner"

interface PriceDetailsProps {
  items: (CartItem & { products: Product })[]
}

export function PriceDetails({ items }: PriceDetailsProps) {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const offerStartDate = new Date('2025-01-22T00:00:00')
  const offerEndDate = new Date('2025-01-31T23:59:59')
  const now = new Date()
  const isOfferActive = now >= offerStartDate && now <= offerEndDate
  const discountPercent = 10

  const totalMRP = items.reduce((sum, item) => sum + (item.products.price * item.quantity), 0)
  const discountOnMRP = isOfferActive ? totalMRP * (discountPercent / 100) : 0
  const couponDiscount = appliedCoupon ? 200 : 0
  const platformFee = 18
  const deliveryCharges = totalMRP >= 999 ? 0 : 79
  const totalAmount = totalMRP - discountOnMRP - couponDiscount + platformFee + deliveryCharges
  const totalSavings = discountOnMRP + couponDiscount + (totalMRP >= 999 ? 79 : 0)

  return (
    <div className="sticky top-4">
      <div className="bg-white rounded shadow-sm p-6">
        <h2 className="text-sm font-bold uppercase mb-1">PRICE DETAILS</h2>
        <p className="text-xs text-neutral-500 mb-4">({items.length} {items.length === 1 ? 'item' : 'items'})</p>

        <div className="space-y-3 mb-4 pb-4 border-b border-neutral-200">
          <div className="flex justify-between text-sm">
            <span>Total MRP</span>
            <span>{formatINR(totalMRP)}</span>
          </div>
          
          {isOfferActive && (
            <div className="flex justify-between text-sm">
              <span>Discount on MRP</span>
              <span className="text-green-600">-{formatINR(discountOnMRP)}</span>
            </div>
          )}

          {appliedCoupon && (
            <div className="flex justify-between text-sm">
              <span>Coupon Discount</span>
              <span className="text-green-600">-{formatINR(couponDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Platform Fee</span>
            <span>{formatINR(platformFee)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Delivery Charges</span>
            <span>
              {deliveryCharges === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                formatINR(deliveryCharges)
              )}
            </span>
          </div>
          
          {totalMRP < 999 && (
            <p className="text-xs text-neutral-500">Free delivery on orders above ₹999</p>
          )}
        </div>

        <div className="flex justify-between text-base font-bold mb-2">
          <span>Total Amount</span>
          <span>{formatINR(totalAmount)}</span>
        </div>

        {totalSavings > 0 && (
          <p className="text-sm text-green-600 font-medium mb-4">
            You will save {formatINR(totalSavings)} on this order
          </p>
        )}

        {/* Coupon Section */}
        <div className="mb-4 pb-4 border-b border-neutral-200">
          {!appliedCoupon ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (couponCode === "STREVO200") {
                    setAppliedCoupon(couponCode)
                    toast.success("Coupon applied successfully!")
                  } else {
                    toast.error("Invalid coupon code")
                  }
                }}
                className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                APPLY
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Coupon {appliedCoupon} applied</span>
              </div>
              <button
                type="button"
                onClick={() => setAppliedCoupon(null)}
                className="text-xs text-red-600 font-medium hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Place Order Button */}
        <button 
          type="button"
          onClick={() => {
            toast.success("Proceeding to checkout...")
            window.location.href = '/checkout/address'
          }}
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-neutral-800 transition-colors mb-4"
        >
          PLACE ORDER
        </button>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <Shield className="w-5 h-5 text-neutral-600" />
            <span className="text-xs text-neutral-600">Secure Payments</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Package className="w-5 h-5 text-neutral-600" />
            <span className="text-xs text-neutral-600">100% Original</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="w-5 h-5 text-neutral-600" />
            <span className="text-xs text-neutral-600">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  )
}
