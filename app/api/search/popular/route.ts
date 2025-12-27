import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ popular: [] });
}

export const revalidate = 3600;
