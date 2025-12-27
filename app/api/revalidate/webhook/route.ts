import { NextRequest, NextResponse } from 'next/server'
import { delPattern } from '@/lib/cache/redis-enhanced'
import { getInvalidationPattern } from '@/lib/cache/cache-keys-v2'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id } = body

    console.log(`[WEBHOOK] Revalidation: ${type}`, id)

    switch (type) {
      case 'product':
        await delPattern(getInvalidationPattern('PRODUCT'))
        revalidateTag('products')
        break
      case 'category':
        await delPattern(getInvalidationPattern('CATEGORY'))
        revalidateTag('categories')
        break
      case 'search':
        await delPattern(getInvalidationPattern('SEARCH'))
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true, invalidated: type })
  } catch (error) {
    console.error('[WEBHOOK] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
