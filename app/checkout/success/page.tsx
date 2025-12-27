"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { OrderSuccessAnimation } from "@/components/animations/order-success"
import { Package, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [orderNumber, setOrderNumber] = useState<string>('')

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrderNumber(data.order_number))
        .catch(() => setOrderNumber('N/A'))
    }
  }, [orderId])

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-md w-full"
      >
        {/* Animation */}
        <div className="mb-8" role="status" aria-live="polite" aria-label="Order placed successfully">
          <OrderSuccessAnimation />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            Order Placed Successfully
          </h1>
          
          <p className="text-neutral-600 text-sm leading-relaxed">
            Thank you for choosing Strevo. Your order is now confirmed and will be processed shortly.
          </p>

          {orderNumber && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg">
              <Package className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-medium text-neutral-700">
                Order #{orderNumber}
              </span>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-8 space-y-3"
        >
          <Link
            href={`/orders/${orderId}`}
            className="block w-full bg-black text-white text-center py-3 rounded-lg font-medium text-sm hover:bg-neutral-800 transition-colors"
          >
            View Order Details
          </Link>
          
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 w-full border border-neutral-300 text-center py-3 rounded-lg font-medium text-sm hover:border-black transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500"
        >
          <p>Order confirmation sent to your email</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
