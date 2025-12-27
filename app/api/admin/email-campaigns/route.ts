import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { name, subject, content } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase.from("email_campaigns").insert({
    name,
    subject,
    content,
    status: "draft"
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
