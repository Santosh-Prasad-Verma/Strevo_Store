import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ impact: null })

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sustainability_impact")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) return NextResponse.json({ impact: { co2_saved: 0, water_saved: 0, trees_planted: 0 } })
  return NextResponse.json({ impact: data })
}
