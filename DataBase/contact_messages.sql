-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  order_number TEXT,
  subject TEXT DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- new, read, replied, closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert (from API)
CREATE POLICY "Service role can insert contact messages" ON public.contact_messages
  FOR INSERT TO service_role WITH CHECK (true);

-- Allow service role to read all messages
CREATE POLICY "Service role can read contact messages" ON public.contact_messages
  FOR SELECT TO service_role USING (true);

-- Allow service role to update messages
CREATE POLICY "Service role can update contact messages" ON public.contact_messages
  FOR UPDATE TO service_role USING (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
