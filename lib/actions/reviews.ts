"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getReviews(productId?: string) {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from("reviews")
      .select(`
        *,
        products(name)
      `)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
    
    if (productId) {
      query = query.eq("product_id", productId)
    } else {
      query = query.limit(12)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export async function submitReview(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error("Not authenticated")

    const review = {
      customer_name: formData.get("name") as string,
      rating: parseInt(formData.get("rating") as string),
      comment: formData.get("comment") as string,
      product_id: formData.get("product_id") as string || null,
      product_name: formData.get("product_name") as string || null,
      image_url: formData.get("image_url") as string || null,
      user_id: user.id,
      is_approved: false
    }

    const { error } = await supabase.from("reviews").insert(review)
    if (error) throw error
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error submitting review:", error)
    return { success: false, error: "Failed to submit review" }
  }
}

export async function voteReview(reviewId: number) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error("Not authenticated")

    const { data: existing } = await supabase
      .from("review_votes")
      .select("id")
      .eq("review_id", reviewId)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      await supabase.from("review_votes").delete().eq("id", existing.id)
      await supabase.rpc("decrement_helpful", { review_id: reviewId })
    } else {
      await supabase.from("review_votes").insert({ review_id: reviewId, user_id: user.id })
      await supabase.rpc("increment_helpful", { review_id: reviewId })
    }
    
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function getPendingReviews() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products(name)
      `)
      .eq("is_approved", false)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching pending reviews:", error)
    return []
  }
}

export async function approveReview(reviewId: number) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", reviewId)

    if (error) throw error
    revalidatePath("/admin/reviews")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function rejectReview(reviewId: number) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)

    if (error) throw error
    revalidatePath("/admin/reviews")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
