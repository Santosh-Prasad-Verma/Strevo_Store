import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeQuery } from '@/lib/search/normalizeQuery'
import { getCache, setCache } from '@/lib/cache/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Suggestion {
  id: string
  title: string
  slug: string
  price: number
  thumbnail_url: string | null
  score?: number
}

export async function GET(request: NextRequest) {
  const startTime = performance.now()
  const searchParams = request.nextUrl.searchParams
  
  const rawQuery = searchParams.get('q')?.trim() || ''
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 6, 1), 12)
  const isPrefetch = searchParams.get('prefetch') === '1'
  
  // Timing tracking
  const timings: Record<string, number> = {}
  
  try {
    // Handle empty query - return popular products
    if (!rawQuery) {
      const cacheKey = `suggest:popular:l${limit}:v3`
      const cached = await getCache<Suggestion[]>(cacheKey)
      
      if (cached.hit && cached.data) {
        const totalTime = performance.now() - startTime
        return createResponse(cached.data, 'HIT', totalTime, timings)
      }
      
      const supabase = await createClient()
      const dbStart = performance.now()
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)
      
      timings.db = performance.now() - dbStart
      
      if (error) throw error
      
      const suggestions = formatSuggestions(data || [])
      await setCache(cacheKey, suggestions, 600) // 10 min for popular
      
      const totalTime = performance.now() - startTime
      return createResponse(suggestions, 'MISS', totalTime, timings)
    }
    
    // Normalize query
    const normalized = normalizeQuery(rawQuery)
    if (!normalized) {
      return createResponse([], 'MISS', performance.now() - startTime, timings)
    }
    
    // Check cache
    const cacheKey = `suggest:${normalized}:l${limit}:v3`
    const cacheStart = performance.now()
    const cached = await getCache<Suggestion[]>(cacheKey)
    timings.cache = performance.now() - cacheStart
    
    if (cached.hit && cached.data) {
      const totalTime = performance.now() - startTime
      return createResponse(cached.data, 'HIT', totalTime, timings)
    }
    
    const supabase = await createClient()
    let suggestions: Suggestion[] = []
    
    // Strategy 1: Fast prefix match on materialized view
    const prefixStart = performance.now()
    try {
      const { data: prefixResults, error: prefixError } = await supabase
        .rpc('search_suggestions_prefix', {
          search_term: normalized,
          result_limit: limit
        })
      
      timings.prefix = performance.now() - prefixStart
      
      if (!prefixError && prefixResults && prefixResults.length > 0) {
        suggestions = formatSuggestions(prefixResults)
      }
    } catch (e) {
      // Fallback if RPC doesn't exist - use direct query
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('is_active', true)
        .ilike('name', `${rawQuery}%`)
        .order('stock_quantity', { ascending: false })
        .limit(limit)
      
      timings.prefix = performance.now() - prefixStart
      
      if (!error && data && data.length > 0) {
        suggestions = formatSuggestions(data)
      }
    }
    
    // Strategy 2: Trigram similarity fallback
    if (suggestions.length === 0) {
      const trigramStart = performance.now()
      
      try {
        const { data: trigramResults, error: trigramError } = await supabase
          .rpc('search_suggestions_trigram', {
            search_term: normalized,
            result_limit: limit
          })
        
        timings.trigram = performance.now() - trigramStart
        
        if (!trigramError && trigramResults && trigramResults.length > 0) {
          suggestions = formatSuggestions(trigramResults)
        }
      } catch (e) {
        // Fallback: ILIKE contains search
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url')
          .eq('is_active', true)
          .or(`name.ilike.%${rawQuery}%,brand.ilike.%${rawQuery}%`)
          .order('stock_quantity', { ascending: false })
          .limit(limit)
        
        timings.trigram = performance.now() - trigramStart
        
        if (!error && data && data.length > 0) {
          suggestions = formatSuggestions(data)
        }
      }
    }
    
    // Strategy 3: Full-text search fallback
    if (suggestions.length === 0) {
      const ftsStart = performance.now()
      
      // Build search terms for full-text
      const searchTerms = normalized.split(' ').filter(t => t.length >= 2)
      
      if (searchTerms.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url')
          .eq('is_active', true)
          .textSearch('name', searchTerms.join(' | '), {
            type: 'websearch',
            config: 'simple'
          })
          .order('stock_quantity', { ascending: false })
          .limit(limit)
        
        timings.fts = performance.now() - ftsStart
        
        if (!error && data && data.length > 0) {
          suggestions = formatSuggestions(data)
        }
      }
    }
    
    // Cache results (shorter TTL for search results)
    const ttl = suggestions.length > 0 ? 120 : 30 // 2 min for results, 30s for empty
    await setCache(cacheKey, suggestions, ttl)
    
    const totalTime = performance.now() - startTime
    
    // Log slow queries
    if (totalTime > 100) {
      console.log(`[SLOW SUGGEST] q="${rawQuery}" time=${totalTime.toFixed(0)}ms results=${suggestions.length}`)
    }
    
    return createResponse(suggestions, 'MISS', totalTime, timings)
    
  } catch (error) {
    console.error('[SUGGEST ERROR]', error)
    const totalTime = performance.now() - startTime
    
    return NextResponse.json(
      { 
        suggestions: [], 
        cache: 'ERROR', 
        timeMs: Math.round(totalTime),
        error: 'Search failed' 
      },
      { 
        status: 500,
        headers: {
          'Server-Timing': `total;dur=${totalTime.toFixed(0)}`,
        }
      }
    )
  }
}

function formatSuggestions(data: any[]): Suggestion[] {
  return data.map(item => ({
    id: item.id,
    title: item.title || item.name,
    slug: item.slug || item.id,
    price: item.price,
    thumbnail_url: item.thumbnail_url || item.image_url,
  }))
}

function createResponse(
  suggestions: Suggestion[], 
  cacheStatus: 'HIT' | 'MISS' | 'ERROR',
  totalTime: number,
  timings: Record<string, number>
): NextResponse {
  // Build Server-Timing header
  const serverTiming = Object.entries(timings)
    .map(([key, value]) => `${key};dur=${value.toFixed(0)}`)
    .concat([`total;dur=${totalTime.toFixed(0)}`])
    .join(', ')
  
  return NextResponse.json(
    {
      suggestions,
      cache: cacheStatus,
      timeMs: Math.round(totalTime),
    },
    {
      headers: {
        'X-Cache-Status': cacheStatus,
        'Server-Timing': serverTiming,
        'Cache-Control': cacheStatus === 'HIT' 
          ? 'public, s-maxage=60, stale-while-revalidate=120'
          : 'public, s-maxage=10, stale-while-revalidate=60',
      }
    }
  )
}
