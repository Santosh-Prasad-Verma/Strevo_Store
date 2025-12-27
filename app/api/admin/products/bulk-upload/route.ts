import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const text = await file.text()
    const lines = text.split("\n").filter(line => line.trim())
    if (lines.length < 2) return NextResponse.json({ error: "Empty file" }, { status: 400 })

    const headers = lines[0].split(",").map(h => h.trim())
    let successful = 0, failed = 0
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map(v => v.trim())
        const product: any = {}
        headers.forEach((h, idx) => product[h] = values[idx] || null)

        if (!product.name || !product.price || !product.category) {
          errors.push(`Row ${i + 1}: Missing required fields`)
          failed++
          continue
        }

        const { data: newProduct, error } = await supabase.from("products").insert({
          name: product.name,
          description: product.description || "",
          price: parseFloat(product.price),
          category: product.category,
          subcategory: product.subcategory || null,
          image_url: product.image_url || null,
          stock_quantity: parseInt(product.stock_quantity) || 0,
          is_active: true
        }).select().single()

        if (error) {
          errors.push(`Row ${i + 1}: ${error.message}`)
          failed++
          continue
        }

        if (product.size || product.color) {
          await supabase.from("product_variants").insert({
            product_id: newProduct.id,
            sku: product.sku || `${newProduct.id}-${product.size || 'default'}`,
            size: product.size || null,
            color: product.color || null,
            price: parseFloat(product.price),
            stock_quantity: parseInt(product.stock_quantity) || 0,
            is_active: true
          })
        }
        successful++
      } catch (error: any) {
        errors.push(`Row ${i + 1}: ${error.message}`)
        failed++
      }
    }

    return NextResponse.json({ successful, failed, total: lines.length - 1, errors: errors.slice(0, 10) })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}