import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { pageUrl, x, y, element } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase.from("heatmap_clicks").insert({
    page_url: pageUrl,
    x_position: x,
    y_position: y,
    element
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
