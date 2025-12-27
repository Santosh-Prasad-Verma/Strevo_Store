"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ ok: boolean; error?: any }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<void>
  sendMagicLink: (email: string) => Promise<{ ok: boolean; error?: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ ok: false }),
  signUp: async () => ({ ok: false }),
  signOut: async () => {},
  signInWithOAuth: async () => {},
  sendMagicLink: async () => ({ ok: false }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((err) => {
      console.error('[AUTH] Failed to get session:', err)
      setError(err.message)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (_event === 'SIGNED_IN') {
        console.log('[AUTH] login_success', { userId: session?.user?.id })
      } else if (_event === 'SIGNED_OUT') {
        console.log('[AUTH] logout_success')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

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

export const useAuth = () => useContext(AuthContext)
