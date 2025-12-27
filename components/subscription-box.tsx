"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

const plans = [
  { id: "basic", name: "Basic Box", price: 1999, items: 3 },
  { id: "premium", name: "Premium Box", price: 3999, items: 5 },
  { id: "luxury", name: "Luxury Box", price: 5999, items: 7 }
]

export function SubscriptionBox() {
  const [selected, setSelected] = useState("")

  const subscribe = async (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    await fetch("/api/subscriptions", {
      method: "POST",
      body: JSON.stringify({ plan: planId, price: plan?.price })
    })
    setSelected(planId)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Package className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Monthly Subscription Box</h2>
        <p className="text-neutral-600">Curated fashion delivered to your door</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">₹{plan.price}<span className="text-sm text-neutral-500">/month</span></p>
            <p className="text-neutral-600 mb-6">{plan.items} curated items</p>
            <Button onClick={() => subscribe(plan.id)} className="w-full">
              {selected === plan.id ? "Subscribed" : "Subscribe"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
