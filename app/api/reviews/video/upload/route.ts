import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const productId = formData.get("productId") as string
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const fileName = `${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("media")
    .upload(`videos/${fileName}`, file)

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(uploadData.path)

  const { error } = await supabase.from("video_reviews").insert({
    product_id: productId,
    user_id: user.id,
    customer_name: user.email?.split("@")[0] || "Anonymous",
    video_url: publicUrl,
    approved: false
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
