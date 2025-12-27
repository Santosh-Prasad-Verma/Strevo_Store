import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// SECURITY: Only use public anon key on client
// Never expose SUPABASE_SERVICE_ROLE_KEY on client side
export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
})

// Helper to get session from URL after OAuth redirect
export async function getSessionFromUrl() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session from URL:', error)
    return null
  }
  return data.session
}

// Helper to refresh session
export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession()
  if (error) {
    console.error('Error refreshing session:', error)
    return null
  }
  return data.session
}
