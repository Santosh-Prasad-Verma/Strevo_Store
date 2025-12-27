import { getCart, getCartTotal } from "@/lib/actions/cart"
import { CartContent } from "@/components/cart/cart-content"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CartPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/cart")
  }

  const cartItems = await getCart()
  const total = await getCartTotal()

  return <CartContent initialItems={cartItems} initialTotal={total} />
}
