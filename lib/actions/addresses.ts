"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Address } from "@/lib/types/database"

export async function getAddresses(): Promise<Address[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return data || []
}

export async function createAddress(address: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  // If this is set as default, unset other defaults
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
  }

  const { error } = await supabase
    .from("addresses")
    .insert({ ...address, user_id: user.id })

  if (error) throw error

  revalidatePath("/profile/addresses")
  return { success: true }
}

export async function updateAddress(id: string, address: Partial<Address>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  // If this is set as default, unset other defaults
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .neq("id", id)
  }

  const { error } = await supabase
    .from("addresses")
    .update({ ...address, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/profile/addresses")
  return { success: true }
}

export async function deleteAddress(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/profile/addresses")
  return { success: true }
}

export async function setDefaultAddress(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  // Unset all defaults
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id)

  // Set new default
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw error

  revalidatePath("/profile/addresses")
  return { success: true }
}
