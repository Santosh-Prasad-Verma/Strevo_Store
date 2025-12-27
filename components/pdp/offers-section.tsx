"use client"

import { Tag, CreditCard, Truck, RotateCcw } from "lucide-react"

export function OffersSection() {
  const offers = [
    {
      icon: Tag,
      title: "Get Flat ₹200 OFF",
      description: "On orders above ₹1000. Use code: FLAT200",
    },
    {
      icon: CreditCard,
      title: "10% Instant Discount",
      description: "On HDFC Bank Credit Cards",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders above ₹500",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "15 days return policy",
    },
  ]

  return (
    <div className="space-y-3 border-t pt-6">
      <h3 className="text-sm font-medium uppercase tracking-wider">Offers & Discounts</h3>
      <div className="space-y-2">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <offer.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{offer.title}</p>
              <p className="text-xs text-muted-foreground">{offer.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
