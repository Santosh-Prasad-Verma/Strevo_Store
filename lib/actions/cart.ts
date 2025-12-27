"use server"

import { createClient } from "@/lib/supabase/server"
import type { CartItem, Product } from "@/lib/types/database"

export async function getCart(): Promise<(CartItem & { products: Product })[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching cart:", error)
    return []
  }

  return (data as any) || []
}

export async function addToCart(productId: string, quantity = 1) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to add items to cart" }
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existingItem) {
    // Update quantity if item exists
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating cart item:", error)
      return { error: "Failed to update cart" }
    }

    return { data, success: true }
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding to cart:", error)
      return { error: "Failed to add to cart" }
    }

    return { data, success: true }
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  if (quantity <= 0) {
    return removeFromCart(cartItemId)
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating cart quantity:", error)
    return { error: "Failed to update quantity" }
  }

  return { data, success: true }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error removing from cart:", error)
    return { error: "Failed to remove from cart" }
  }

  return { success: true }
}

export async function clearCart() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error clearing cart:", error)
    return { error: "Failed to clear cart" }
  }

  return { success: true }
}

export async function getCartCount(): Promise<number> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { data, error } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error fetching cart count:", error)
    return 0
  }

  return data.reduce((total, item) => total + item.quantity, 0)
}

export async function getCartTotal(): Promise<number> {
  const cart = await getCart()
  return cart.reduce((total, item) => {
    const price =
      typeof item.products.price === "number" ? item.products.price : Number.parseFloat(String(item.products.price))
    return total + price * item.quantity
  }, 0)
}
