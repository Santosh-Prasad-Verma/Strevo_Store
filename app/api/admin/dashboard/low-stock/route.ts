import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("products")
    .select("*")
    .lte("stock", 10)
    .gt("stock", 0)
    .order("stock", { ascending: true })

  return NextResponse.json({ products: data || [] })
}
