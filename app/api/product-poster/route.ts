import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('product_poster')
      .select('*')
      .eq('is_active', true)
      .single()

    return NextResponse.json(data || {})
  } catch (error) {
    return NextResponse.json({})
  }
}
