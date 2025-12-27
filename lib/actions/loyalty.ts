"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getLoyaltyPoints(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", userId)
    .single()
  
  return data || { points: 0, lifetime_points: 0, tier: 'bronze' }
}

export async function addLoyaltyPoints(userId: string, points: number, type: string, description: string) {
  const supabase = await createClient()
  
  // Get or create loyalty account
  let { data: account } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", userId)
    .single()
  
  if (!account) {
    const { data: newAccount } = await supabase
      .from("loyalty_points")
      .insert({ user_id: userId, points: 0, lifetime_points: 0 })
      .select()
      .single()
    account = newAccount
  }
  
  // Update points
  await supabase
    .from("loyalty_points")
    .update({
      points: (account?.points || 0) + points,
      lifetime_points: (account?.lifetime_points || 0) + Math.abs(points),
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
  
  // Log transaction
  await supabase.from("loyalty_transactions").insert({
    user_id: userId,
    points,
    type,
    description
  })
  
  revalidatePath("/profile")
  return { success: true }
}

export async function redeemPoints(userId: string, points: number) {
  const account = await getLoyaltyPoints(userId)
  
  if (account.points < points) {
    return { success: false, error: "Insufficient points" }
  }
  
  await addLoyaltyPoints(userId, -points, "redeem", `Redeemed ${points} points`)
  return { success: true, discount: points * 0.1 } // 1 point = ₹0.10
}
