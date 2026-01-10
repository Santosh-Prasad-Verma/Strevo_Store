"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/database"



export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching products:", error.message?.replace(/[\r\n]/g, ' '))
      return []
    }

    return data || []
  } catch (error: any) {
    console.error("[v0] Unexpected error fetching products:", error.message?.replace(/[\r\n]/g, ' '))
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("is_active", true).single()

    if (error) {
      console.error("[v0] Error fetching product:", error.message?.replace(/[\r\n]/g, ' '))
      return null
    }

    return data
  } catch (error: any) {
    console.error("[v0] Unexpected error fetching product:", error.message?.replace(/[\r\n]/g, ' '))
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching products by category:", error.message?.replace(/[\r\n]/g, ' '))
      return []
    }

    return data || []
  } catch (error: any) {
    console.error("[v0] Unexpected error fetching products by category:", error.message?.replace(/[\r\n]/g, ' '))
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const sanitizedQuery = query.replace(/[%_]/g, '\\$&').substring(0, 100)

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, image_url, category, brand, stock_quantity")
      .or(`name.ilike.%${sanitizedQuery}%,brand.ilike.%${sanitizedQuery}%`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Error searching products:", error.message?.replace(/[\r\n]/g, ' '))
      return []
    }

    return data || []
  } catch (error: any) {
    console.error("[v0] Unexpected error searching products:", error.message?.replace(/[\r\n]/g, ' '))
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching product by slug:", error.message?.replace(/[\r\n]/g, ' '))
      return null
    }

    return data
  } catch (error: any) {
    console.error("Unexpected error fetching product by slug:", error.message?.replace(/[\r\n]/g, ' '))
    return null
  }
}

export async function getRelatedProducts(category: string, excludeId: number, limit = 4): Promise<Product[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", excludeId)
      .eq("is_active", true)
      .limit(limit)

    if (error) {
      console.error("Error fetching related products:", error.message?.replace(/[\r\n]/g, ' '))
      return []
    }

    return data || []
  } catch (error: any) {
    console.error("Unexpected error fetching related products:", error.message?.replace(/[\r\n]/g, ' '))
    return []
  }
}
