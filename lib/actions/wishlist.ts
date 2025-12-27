"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/database"

export async function getWishlistItems(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id, products(*)")
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching wishlist:", error)
      return []
    }

    return data?.map((item: any) => item.products).filter(Boolean) || []
  } catch (error) {
    console.error("Unexpected error fetching wishlist:", error)
    return []
  }
}

export async function addToWishlist(productId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to add items to wishlist" }
    }

    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: productId })

    if (error) {
      if (error.code === "23505") {
        return { error: "Item already in wishlist" }
      }
      return { error: "Failed to add to wishlist" }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error adding to wishlist:", error)
    return { error: "Failed to add to wishlist" }
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)

    if (error) {
      return { error: "Failed to remove from wishlist" }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error removing from wishlist:", error)
    return { error: "Failed to remove from wishlist" }
  }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}
