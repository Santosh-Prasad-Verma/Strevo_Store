"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/types/database"
import { revalidateTag } from "next/cache"

export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    return profile?.is_admin || false
  } catch {
    return false
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function createProduct(productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("products")
      .insert(productData)
      .select()
      .single()

    if (error) throw error
    
    revalidateTag("products")
    return { success: true, product: data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
    
    revalidateTag("products")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("products")
      .delete()
      .eq("id", id)

    if (error) throw error
    
    revalidateTag("products")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function duplicateProduct(id: string): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const adminClient = createAdminClient()
    
    const { data: original, error: fetchError } = await adminClient
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    const { id: _, created_at, updated_at, ...productData } = original
    const duplicatedProduct = {
      ...productData,
      name: `${productData.name} (Copy)`,
    }

    const { data, error } = await adminClient
      .from("products")
      .insert(duplicatedProduct)
      .select()
      .single()

    if (error) throw error
    
    revalidateTag("products")
    return { success: true, product: data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function bulkUpdateProducts(updates: { id: string; data: Partial<Product> }[]): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient()
    
    for (const update of updates) {
      const { error } = await adminClient
        .from("products")
        .update({ ...update.data, updated_at: new Date().toISOString() })
        .eq("id", update.id)
      
      if (error) throw error
    }
    
    revalidateTag("products")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) throw error
    
    revalidateTag("orders")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}