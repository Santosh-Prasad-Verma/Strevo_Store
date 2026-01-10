import { NextRequest, NextResponse } from 'next/server';
import { meiliAdmin, PRODUCTS_INDEX, INDEX_VERSION } from '@/lib/search/meiliClient';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.REVALIDATE_SECRET;
  
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!meiliAdmin) {
    return NextResponse.json(
      { error: 'MeiliSearch not configured', message: 'Search service unavailable' },
      { status: 503 }
    );
  }
  
  try {
    const newIndexName = `${PRODUCTS_INDEX}_${INDEX_VERSION}_temp`;
    const currentIndexName = `${PRODUCTS_INDEX}_${INDEX_VERSION}`;
    
    const supabase = await createClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    const documents = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand || 'Unknown',
      price: p.price,
      category: p.category,
      subcategories: p.subcategories || [],
      description: p.description,
      images: p.images || [],
      colors: p.colors || [],
      sizes: p.sizes || [],
      materials: p.materials || [],
      tags: p.tags || [],
      is_active: p.is_active,
      stock_quantity: p.stock_quantity || 0,
      created_at: p.created_at,
    }));
    
    const newIndex = meiliAdmin.index(newIndexName);
    
    await newIndex.addDocuments(documents, { primaryKey: 'id' });
    
    await meiliAdmin.swapIndexes([
      { indexes: [currentIndexName, newIndexName] }
    ]);
    
    await meiliAdmin.deleteIndex(newIndexName);
    
    return NextResponse.json({
      success: true,
      indexed: documents.length,
      message: 'Reindex complete',
    });
  } catch (error) {
    console.error('Reindex error:', error);
    return NextResponse.json(
      { error: 'Reindex failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
