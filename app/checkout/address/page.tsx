"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { CheckoutHeader } from "@/components/checkout/checkout-header"

export default function AddressPage() {
  const router = useRouter()
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard')

  return (
    <div className="min-h-screen bg-neutral-50">
      <CheckoutHeader currentStep={2} />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ShippingForm 
          onComplete={(data) => {
            sessionStorage.setItem('shippingData', JSON.stringify(data))
            sessionStorage.setItem('deliveryOption', deliveryOption)
            router.push('/checkout/payment')
          }}
          deliveryOption={deliveryOption}
          onDeliveryChange={setDeliveryOption}
        />
      </div>
    </div>
  )
}
