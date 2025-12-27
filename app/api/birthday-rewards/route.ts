import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ reward: null })

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("birthday_rewards")
    .select("*")
    .eq("user_id", userId)
    .eq("used", false)
    .gte("valid_until", new Date().toISOString().split("T")[0])
    .single()

  if (error) return NextResponse.json({ reward: null })
  return NextResponse.json({ reward: data })
}
