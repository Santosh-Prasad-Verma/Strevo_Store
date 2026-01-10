"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Smartphone, Banknote, Lock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatINR } from "@/lib/utils/currency"
import type { CartItem, Product } from "@/lib/types/database"

interface PaymentMethodsProps {
  total: number
  shippingData: any
  cartItems: (CartItem & { products: Product })[]
  onPaymentMethodChange: (method: 'upi' | 'card' | 'cod') => void
}

export function PaymentMethods({ total, shippingData, cartItems, onPaymentMethodChange }: PaymentMethodsProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'cod'>('upi')

  const handleMethodChange = (newMethod: 'upi' | 'card' | 'cod') => {
    setMethod(newMethod)
    onPaymentMethodChange(newMethod)
  }
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const [upiId, setUpiId] = useState("")
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "", name: "" })

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingDetails: shippingData,
          cartItems,
          total,
          paymentMethod: method
        })
      })

      if (!res.ok) throw new Error()

      const { orderId } = await res.json()
      if (orderId && /^[a-zA-Z0-9-_]+$/.test(orderId)) {
        toast.success("Order placed successfully!")
        router.push(`/checkout/success?orderId=${orderId}`)
      } else {
        throw new Error('Invalid order ID')
      }
    } catch {
      toast.error("Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
          3
        </div>
        <h2 className="text-lg font-medium tracking-tight">PAYMENT METHOD</h2>
      </div>

      {/* Payment Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => handleMethodChange('upi')}
          className={`p-3 border rounded text-xs font-medium transition-all ${
            method === 'upi' ? 'border-black bg-black text-white' : 'border-neutral-300 hover:border-black'
          }`}
        >
          <Smartphone className="w-4 h-4 mx-auto mb-1" />
          UPI
        </button>
        <button
          onClick={() => handleMethodChange('card')}
          className={`p-3 border rounded text-xs font-medium transition-all ${
            method === 'card' ? 'border-black bg-black text-white' : 'border-neutral-300 hover:border-black'
          }`}
        >
          <CreditCard className="w-4 h-4 mx-auto mb-1" />
          CARD
        </button>
        <button
          onClick={() => handleMethodChange('cod')}
          className={`p-3 border rounded text-xs font-medium transition-all ${
            method === 'cod' ? 'border-black bg-black text-white' : 'border-neutral-300 hover:border-black'
          }`}
        >
          <Banknote className="w-4 h-4 mx-auto mb-1" />
          COD
        </button>
      </div>

      {/* Payment Forms */}
      <div className="mb-6">
        {method === 'upi' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value.replace(/[<>"']/g, '').slice(0, 50))}
                placeholder="yourname@upi"
                maxLength={50}
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <p className="text-xs text-neutral-500">Enter your UPI ID to complete payment</p>
          </motion.div>
        )}

        {method === 'card' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                CARD NUMBER
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  EXPIRY
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                  placeholder="123"
                  className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                CARDHOLDER NAME
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value.replace(/[<>"']/g, '').slice(0, 50) })}
                placeholder="Name on card"
                maxLength={50}
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </motion.div>
        )}

        {method === 'cod' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-neutral-50 border border-neutral-200 rounded"
          >
            <p className="text-sm text-neutral-700">
              Pay with cash when your order is delivered. Extra ₹50 COD charges apply.
            </p>
          </motion.div>
        )}

      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full bg-black text-white py-3.5 rounded font-medium text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        {isProcessing ? 'PROCESSING...' : `PLACE ORDER - ${formatINR(Number(total) || 0)}`}
      </button>

      <p className="text-xs text-center text-neutral-500 mt-3">
        By placing order, you agree to our Terms & Conditions
      </p>
    </motion.div>
  )
}
