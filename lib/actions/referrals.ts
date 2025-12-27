"use server"

import { createClient } from "@/lib/supabase/server"

export async function generateReferralCode(userId: string) {
  const supabase = await createClient()
  
  const { data: existing } = await supabase
    .from("referrals")
    .select("referral_code")
    .eq("referrer_id", userId)
    .limit(1)
    .single()
  
  if (existing) return existing.referral_code
  
  const code = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  
  await supabase.from("referrals").insert({
    referrer_id: userId,
    referral_code: code
  })
  
  return code
}

export async function applyReferralCode(refereeId: string, code: string) {
  const supabase = await createClient()
  
  const { data: referral } = await supabase
    .from("referrals")
    .select("*")
    .eq("referral_code", code)
    .eq("status", "pending")
    .single()
  
  if (!referral) return { success: false, error: "Invalid code" }
  
  await supabase
    .from("referrals")
    .update({
      referee_id: refereeId,
      status: "completed",
      completed_at: new Date().toISOString(),
      reward_amount: 100
    })
    .eq("id", referral.id)
  
  return { success: true, discount: 100 }
}
