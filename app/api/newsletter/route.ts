import { NextResponse } from 'next/server';

// Simple in-memory store for demonstration (replace with DB in production)
const subscribers: string[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    // Add to store (replace with DB insert in production)
    subscribers.push(email);
    // Optionally: send notification to admin, etc.
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
