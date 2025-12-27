"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PaymentMethods } from "@/components/checkout/payment-methods"
import { OrderSummary } from "@/components/checkout/order-summary"
import { CheckoutHeader } from "@/components/checkout/checkout-header"

export default function PaymentPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [shippingData, setShippingData] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi')

  useEffect(() => {
    const shipping = sessionStorage.getItem('shippingData')
    if (!shipping) {
      router.push('/checkout/address')
      return
    }
    setShippingData(JSON.parse(shipping))

    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCartItems(data.items)
        setTotal(data.total)
      })
  }, [router])

  const deliveryOption = sessionStorage.getItem('deliveryOption') || 'standard'
  const deliveryCharge = deliveryOption === 'express' ? 99 : (total >= 999 ? 0 : 79)
  const discount = 0
  const codCharge = paymentMethod === 'cod' ? 50 : 0
  const finalTotal = total - discount + deliveryCharge + 18 + codCharge

  if (!shippingData) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      <CheckoutHeader currentStep={3} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <PaymentMethods 
              total={finalTotal}
              shippingData={shippingData}
              cartItems={cartItems}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>
          
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
        </div>
      </div>
    </div>
  )
}
