import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: dataUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, url: dataUrl })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
