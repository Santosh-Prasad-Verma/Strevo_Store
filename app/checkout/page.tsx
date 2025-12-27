import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCart, getCartTotal } from "@/lib/actions/cart"
import { CheckoutContainer } from "@/components/checkout/checkout-container"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/checkout")
  }

  const cartItems = await getCart()
  if (cartItems.length === 0) {
    redirect("/cart")
  }

  const total = await getCartTotal()

  return <CheckoutContainer cartItems={cartItems} total={total} user={user} />
}
