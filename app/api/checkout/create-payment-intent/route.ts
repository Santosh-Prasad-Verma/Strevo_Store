import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getCart, getCartTotal } from "@/lib/actions/cart"
import { rateLimit } from "@/lib/rate-limit"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request, 3, 60000)
  if (rateLimitResponse) return rateLimitResponse
  
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cartItems = await getCart()

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const total = await getCartTotal()
    
    if (total <= 0 || total > 999999) {
      return NextResponse.json({ error: "Invalid cart total" }, { status: 400 })
    }
    
    const amount = Math.round(total * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("[v0] Error creating payment intent:", error)
    return NextResponse.json({ error: "Error creating payment intent" }, { status: 500 })
  }
}
