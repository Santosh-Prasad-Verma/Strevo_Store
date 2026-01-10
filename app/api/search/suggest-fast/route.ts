import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeQuery } from '@/lib/utils/normalizeQuery'

interface Suggestion {
  id: string
  title: string
  slug: string
  price: number
  thumbnail_url: string
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  
  const query = searchParams.get('q')?.trim() || ''
  const limit = Math.min(Number(searchParams.get('limit')) || 6, 12)
  
  if (!query) {
    return getPopularProducts(limit, startTime)
  }
  
  const normalized = normalizeQuery(query)
  const supabase = await createClient()
  let suggestions: Suggestion[] = []
  let queryType = 'none'
  const dbStart = Date.now()
  
  try {
    // Strategy: Contains match (works for any part of the name)
    if (normalized.length >= 2) {
      // Split query into words and search for each
      const words = normalized.split(' ').filter(w => w.length > 0)
      
      let query = supabase
        .from('products')
        .select('id, name, slug, price, image_url')
        .eq('is_active', true)
      
      // Search for products containing any of the words
      if (words.length > 0) {
        const orConditions = words.map(word => `name.ilike.%${word}%`).join(',')
        query = query.or(orConditions)
      }
      
      const { data, error } = await query
        .order('stock_quantity', { ascending: false })
        .limit(limit)
      
      console.log('[SUGGEST] Search words:', JSON.stringify(words), 'Results:', data?.length, 'Error:', error?.message?.replace(/[\r\n]/g, ' '))
      
      if (data && data.length > 0) {
        suggestions = data.map(row => ({
          id: row.id,
          title: row.name,
          slug: row.slug,
          price: row.price,
          thumbnail_url: row.image_url
        }))
        queryType = 'word-match'
      }
    }
    
    const dbTime = Date.now() - dbStart
    const totalTime = Date.now() - startTime
    
    console.log('[SUGGEST] Final results:', suggestions.length, 'in', totalTime, 'ms')
    
    return NextResponse.json(
      { suggestions, query: normalized, queryType, timeMs: totalTime },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'Server-Timing': `db;dur=${dbTime}, total;dur=${totalTime}`,
          'X-Query-Type': queryType
        }
      }
    )
  } catch (error: any) {
    console.error('[SUGGEST] Error:', error.message?.replace(/[\r\n]/g, ' '))
    return NextResponse.json(
      { suggestions: [], error: 'Search failed', timeMs: Date.now() - startTime },
      { status: 500 }
    )
  }
}

async function getPopularProducts(limit: number, startTime: number) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, price, image_url')
      .eq('is_active', true)
      .order('stock_quantity', { ascending: false })
      .limit(limit)
    
    return NextResponse.json(
      { suggestions: data || [], query: '', queryType: 'popular', timeMs: Date.now() - startTime },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    )
  } catch (error) {
    return NextResponse.json({ suggestions: [], error: 'Failed' }, { status: 500 })
  }
}
