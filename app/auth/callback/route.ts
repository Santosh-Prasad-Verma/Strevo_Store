import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        }
      } 
    }
  )
  await supabase.auth.getSession()
  const url = new URL(request.url)
  const redirect = url.searchParams.get('redirect') || '/'
  
  const allowedPaths = /^\/[a-zA-Z0-9/_-]*$/
  const sanitizedRedirect = redirect.startsWith('/') && allowedPaths.test(redirect) ? redirect : '/'
  const redirectUrl = new URL(sanitizedRedirect, url.origin)
  
  return NextResponse.redirect(redirectUrl)
}
