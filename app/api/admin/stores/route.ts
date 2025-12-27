import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { name, address, city, state, pincode, phone, hours } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase.from("store_locations").insert({
    name,
    address,
    city,
    state,
    pincode,
    phone,
    hours,
    active: true
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
