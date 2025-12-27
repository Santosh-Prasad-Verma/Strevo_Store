import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, clicked_product_id, results_count } = body;
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('search_analytics').insert({
      query,
      user_id: user?.id,
      clicked_product_id,
      results_count: results_count || 0
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics] Error:', error);
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
