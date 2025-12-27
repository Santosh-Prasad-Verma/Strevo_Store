"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/auth/supabase-client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  profile: any | null
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ ok: boolean; error?: any }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<void>
  sendMagicLink: (email: string) => Promise<{ ok: boolean; error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) fetchProfile()
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (_event === 'SIGNED_IN') {
        console.log('[AUTH] login_success', { userId: session?.user?.id })
        fetchProfile()
      } else if (_event === 'SIGNED_OUT') {
        console.log('[AUTH] logout_success')
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('[AUTH] login_failure', error)
        return { ok: false, error }
      }
      return { ok: true, data }
    } catch (error) {
      console.error('[AUTH] login_failure', error)
      return { ok: false, error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        console.error('[AUTH] signup_failure', error)
        return { ok: false, error }
      }
      console.log('[AUTH] signup_success', { userId: data.user?.id })
      return { ok: true, data }
    } catch (error) {
      console.error('[AUTH] signup_failure', error)
      return { ok: false, error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    router.push('/')
  }

  const signInWithOAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) return { ok: false, error }
      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profile,
        signIn,
        signUp,
        signOut,
        signInWithOAuth,
        sendMagicLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
