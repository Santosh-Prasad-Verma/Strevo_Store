import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { plan, price } = await req.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const nextDelivery = new Date()
  nextDelivery.setMonth(nextDelivery.getMonth() + 1)

  const { error } = await supabase.from("subscription_boxes").insert({
    user_id: user.id,
    plan,
    price,
    next_delivery: nextDelivery.toISOString().split("T")[0]
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
