import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("order_tracking")
    .select("*")
    .eq("order_id", params.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tracking: data })
}
