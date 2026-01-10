import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { name, email, order, subject, message } = await request.json();
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Save to contact_messages table
    const { error } = await supabase
      .from("contact_messages")
      .insert({ 
        name, 
        email, 
        order_number: order || null,
        subject: subject || 'general',
        message,
        status: 'new'
      });

    if (error) {
      console.error("Contact form error:", error);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
