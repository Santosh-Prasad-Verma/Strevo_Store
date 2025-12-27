"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CartItem, Product } from "@/lib/types/database"
import { formatINR } from "@/lib/utils/currency"
import { useRouter } from "next/navigation"

interface CheckoutFormProps {
  cartItems: (CartItem & { products: Product })[]
  total: number
  user: any
}

export function CheckoutForm({ cartItems: initialCartItems, total: initialTotal, user }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [total, setTotal] = useState(initialTotal)
  const router = useRouter()

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

  // Shipping address state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    // Create order first
    try {
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingDetails,
          cartItems,
          total,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const { orderId } = await orderResponse.json()

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
      })

      if (error) {
        setMessage(error.message || "An unexpected error occurred.")
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      setMessage("An error occurred during checkout.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="border-2 border-black p-6">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Shipping Details</h2>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={shippingDetails.fullName}
                onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                required
                className="border-2 border-gray-300 focus:border-black"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={shippingDetails.addressLine1}
                onChange={(e) => setShippingDetails({ ...shippingDetails, addressLine1: e.target.value })}
                required
                className="border-2 border-gray-300 focus:border-black"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                value={shippingDetails.addressLine2}
                onChange={(e) => setShippingDetails({ ...shippingDetails, addressLine2: e.target.value })}
                className="border-2 border-gray-300 focus:border-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                  required
                  className="border-2 border-gray-300 focus:border-black"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingDetails.state}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                  required
                  className="border-2 border-gray-300 focus:border-black"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={shippingDetails.postalCode}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                  required
                  className="border-2 border-gray-300 focus:border-black"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  required
                  className="border-2 border-gray-300 focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-black p-6">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Payment</h2>
          <PaymentElement />
        </div>
      </div>

      <div>
        <div className="border-2 border-black p-6 sticky top-8">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty</p>
            ) : cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                  <img
                    src={item.products.image_url || "/placeholder.svg"}
                    alt={item.products.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium">{item.products.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium">
                    {formatINR(
                      (typeof item.products.price === "number"
                        ? item.products.price
                        : Number.parseFloat(String(item.products.price))) * item.quantity,
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          {message && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200">{message}</div>}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !stripe || !elements}
            className="w-full mt-6 bg-black text-white hover:bg-gray-800 text-xs font-medium tracking-widest uppercase py-3"
          >
            {isLoading ? "Processing..." : `Pay ${formatINR(total)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
