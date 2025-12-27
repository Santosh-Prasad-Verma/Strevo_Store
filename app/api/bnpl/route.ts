import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { orderId, installments, amount } = await req.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const installmentAmount = amount / installments

  const { error } = await supabase.from("bnpl_plans").insert({
    order_id: orderId,
    user_id: user.id,
    total_amount: amount,
    installments,
    installment_amount: installmentAmount
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
