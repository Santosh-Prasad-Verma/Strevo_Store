import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { tracking_number, carrier } = await request.json()

    const { error } = await supabase
      .from("orders")
      .update({ 
        tracking_number, 
        carrier,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tracking" }, { status: 500 })
  }
}
