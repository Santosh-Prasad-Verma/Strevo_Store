import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('name, images, slug, price')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(5);

    const suggestions = (products || []).map((p: any) => ({
      suggestion: p.name,
      type: 'product',
      match_type: 'supabase',
      image: p.images?.[0] || null,
      slug: p.slug,
      price: p.price,
    }));

    return NextResponse.json(
      { suggestions },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
