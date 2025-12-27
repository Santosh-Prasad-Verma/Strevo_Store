import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("heatmap_clicks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  return NextResponse.json({ clicks: data || [] })
}
