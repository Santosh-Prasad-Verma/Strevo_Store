import { NextRequest, NextResponse } from 'next/server';
import { delPattern } from '@/lib/cache/redis';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.REVALIDATE_SECRET;
  
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { pattern } = await req.json();
    const targetPattern = pattern || 'search:*';
    
    await delPattern(targetPattern);
    
    return NextResponse.json({
      success: true,
      pattern: targetPattern,
      message: 'Cache purge requested (Redis disabled - no-op)'
    });
  } catch (error) {
    console.error('Cache purge error:', error);
    return NextResponse.json(
      { error: 'Purge failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
