"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShippingForm } from "./shipping-form"
import { OrderSummary } from "./order-summary"
import { PaymentMethods } from "./payment-methods"
import { CheckoutHeader } from "./checkout-header"
import type { CartItem, Product } from "@/lib/types/database"

interface CheckoutContainerProps {
  cartItems: (CartItem & { products: Product })[]
  total: number
  user: any
}

export function CheckoutContainer({ cartItems: initial, total: initialTotal, user }: CheckoutContainerProps) {
  const [cartItems, setCartItems] = useState(initial)
  const [total, setTotal] = useState(initialTotal)
  const [step, setStep] = useState(1)
  const [shippingData, setShippingData] = useState<any>(null)
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi')

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCartItems(data.items)
        setTotal(data.total)
      }
    }
    fetchCart()
  }, [])

  const offerStartDate = new Date('2025-01-22T00:00:00')
  const offerEndDate = new Date('2025-01-31T23:59:59')
  const now = new Date()
  const isOfferActive = now >= offerStartDate && now <= offerEndDate
  
  const deliveryCharge = deliveryOption === 'express' ? 99 : (total >= 999 ? 0 : 79)
  const discount = isOfferActive ? total * 0.1 : 0
  const codCharge = paymentMethod === 'cod' ? 50 : 0
  const finalTotal = total - discount + deliveryCharge + 18 + codCharge

  return (
    <div className="min-h-screen bg-neutral-50">
      <CheckoutHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Left: Forms */}
          <div className="lg:col-span-3 space-y-6">
            <ShippingForm 
              onComplete={(data) => {
                setShippingData(data)
                setStep(2)
              }}
              deliveryOption={deliveryOption}
              onDeliveryChange={setDeliveryOption}
            />
            
            {shippingData && (
              <PaymentMethods 
                total={finalTotal}
                shippingData={shippingData}
                cartItems={cartItems}
                onPaymentMethodChange={setPaymentMethod}
              />
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <OrderSummary 
              items={cartItems}
              subtotal={total}
              discount={discount}
              delivery={deliveryCharge}
              codCharge={codCharge}
              total={finalTotal}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
