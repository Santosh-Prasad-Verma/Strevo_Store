"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { formatINR } from "@/lib/utils/currency"
import type { CartItem, Product } from "@/lib/types/database"
import { Tag } from "lucide-react"

interface OrderSummaryProps {
  items: (CartItem & { products: Product })[]
  subtotal: number
  discount: number
  delivery: number
  codCharge: number
  total: number
}

export function OrderSummary({ items, subtotal, discount, delivery, codCharge, total }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg border border-neutral-200 p-6 sticky top-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium tracking-tight">ORDER SUMMARY</h2>
        <span className="text-xs text-neutral-500">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-20 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.products.image_url || "/placeholder.svg"}
                alt={item.products.name}
                width={64}
                height={80}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{item.products.name}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Size: {item.variant?.size || 'M'} | Qty: {item.quantity}
              </p>
              <p className="text-sm font-medium mt-1">
                {formatINR(item.products.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-medium">{formatINR(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Discount (10% OFF)</span>
            <span className="font-medium text-green-600">-{formatINR(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Platform Fee</span>
          <span className="font-medium">{formatINR(18)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Delivery</span>
          <span className="font-medium">
            {delivery === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatINR(delivery)
            )}
          </span>
        </div>

        {codCharge > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">COD Charges</span>
            <span className="font-medium">{formatINR(codCharge)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-200">
        <span className="text-base font-medium">TOTAL</span>
        <span className="text-xl font-bold">{formatINR(total)}</span>
      </div>

      {discount > 0 && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-600" />
          <p className="text-xs text-green-700 font-medium">
            You save {formatINR(discount + (subtotal >= 999 ? 79 : 0))}
          </p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-neutral-200 text-center">
        <div className="text-xs text-neutral-600">
          <div className="text-lg mb-1">🔒</div>
          <div>Secure</div>
        </div>
        <div className="text-xs text-neutral-600">
          <div className="text-lg mb-1">📦</div>
          <div>Original</div>
        </div>
        <div className="text-xs text-neutral-600">
          <div className="text-lg mb-1">↩️</div>
          <div>Returns</div>
        </div>
      </div>
    </motion.div>
  )
}
