import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { image_url, link_url } = await request.json()

    const adminClient = createAdminClient()
    
    // Check if poster exists
    const { data: existing } = await adminClient
      .from('product_poster')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      await adminClient
        .from('product_poster')
        .update({ image_url, link_url, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await adminClient
        .from('product_poster')
        .insert({ image_url, link_url, is_active: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Poster update error:', error)
    return NextResponse.json({ error: 'Failed to update poster' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    await adminClient.from('product_poster').delete().eq('is_active', true)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
