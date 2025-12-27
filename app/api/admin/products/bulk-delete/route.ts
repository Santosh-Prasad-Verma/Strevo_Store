import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { delCache } from '@/lib/cache/redis'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Product IDs required' }, { status: 400 })
    }

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()
    
    // Get product images before deleting
    const { data: products } = await adminClient
      .from('products')
      .select('image_url')
      .in('id', productIds)
    
    // Delete products from database
    const { error } = await adminClient
      .from('products')
      .delete()
      .in('id', productIds)

    if (error) throw error
    
    // Delete images from storage
    if (products) {
      for (const product of products) {
        if (product.image_url && product.image_url.includes('supabase.co/storage')) {
          const urlParts = product.image_url.split('/storage/v1/object/public/')
          if (urlParts[1]) {
            const [bucket, ...pathParts] = urlParts[1].split('/')
            const filePath = pathParts.join('/')
            await adminClient.storage.from(bucket).remove([filePath])
          }
        }
      }
    }

    // Invalidate caches
    await Promise.all([
      delCache('products:all'),
      delCache('admin:dashboard:stats'),
      ...productIds.map(id => delCache(`product:${id}`))
    ])

    // Revalidate pages
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return NextResponse.json({ 
      success: true, 
      message: `${productIds.length} product(s) deleted` 
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 })
  }
}
