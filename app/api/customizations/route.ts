import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { productId, type, text, price } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase.from("product_customizations").insert({
    product_id: productId,
    customization_type: type,
    customization_text: text,
    price
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
