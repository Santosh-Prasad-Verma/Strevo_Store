import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', params.id)
      .eq('is_active', true)
      .order('size', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: variants })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { data: variant, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: params.id,
        size: body.size,
        color: body.color,
        color_hex: body.color_hex,
        sku: body.sku,
        price: body.price,
        stock_quantity: body.stock_quantity,
        is_active: body.is_active ?? true
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: variant })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}