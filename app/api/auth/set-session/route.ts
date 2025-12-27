import { createServiceRoleClient } from '@/lib/auth/supabase-server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// SECURITY: This endpoint uses SUPABASE_SERVICE_ROLE_KEY
// Only use for server-side session management
// Never expose service role key to client

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Missing tokens' },
        { status: 400 }
      )
    }

    // Set HttpOnly cookies for secure session storage
    const cookieStore = cookies()
    
    // SECURITY: HttpOnly prevents XSS attacks
    // Secure flag ensures HTTPS only
    // SameSite=Lax prevents CSRF
    cookieStore.set('sb-access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    cookieStore.set('sb-refresh-token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[AUTH] set_session_error', error)
    return NextResponse.json(
      { error: 'Failed to set session' },
      { status: 500 }
    )
  }
}

// Clear session cookies
export async function DELETE() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('sb-access-token')
    cookieStore.delete('sb-refresh-token')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[AUTH] clear_session_error', error)
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    )
  }
}
