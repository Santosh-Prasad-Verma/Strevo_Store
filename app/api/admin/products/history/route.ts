import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/actions/admin"

export async function GET(request: NextRequest) {
  try {
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    const supabase = await createClient()
    
    let query = supabase
      .from('product_history')
      .select('*')
      .order('created_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data: history, error } = await query.limit(100)

    if (error) throw error

    return NextResponse.json({ history })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}