import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { exchangeId } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from("exchanges")
    .update({ status: "approved" })
    .eq("id", exchangeId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
