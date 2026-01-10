import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, subscribed")
      .eq("email", email)
      .single()

    if (existing) {
      // If exists but unsubscribed, resubscribe
      if (!existing.subscribed) {
        await supabase
          .from("newsletter_subscribers")
          .update({ subscribed: true })
          .eq("id", existing.id)
      }
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, subscribed: true })

    if (error) {
      console.error("Newsletter subscription error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Newsletter subscription error:", err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
