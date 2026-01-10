"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { validateEmail } from '@/lib/auth/validators'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { OAuthButtons } from './oauth-buttons'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      setError(emailValidation.error!)
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await signIn(email, password)
      setLoading(false)

      if (!result.ok) {
        setError('Invalid email or password')
      } else {
        router.push('/')
      }
    } catch (error) {
      setLoading(false)
      setError('Unable to connect. Please try again later.')
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-500">
          Technical Performance Wear
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
          Welcome back.
        </h1>
        <p className="text-sm text-neutral-600">
          Sign in to access your orders and exclusive drops.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="assertive"
            className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 focus:outline-none transition-colors"
            placeholder="your@email.com"
            aria-describedby="email-helper"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none transition-colors pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 mt-0.5 focus:ring-black"
              className="w-4 h-4 border-neutral-300 focus:ring-black"
            />
            <span className="text-sm">Remember me</span>
          </label>
          <Link href="/auth/reset-password" className="text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-neutral-500 tracking-widest">Or</span>
        </div>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      <p className="text-center text-sm text-neutral-600">
        Don't have an account?{' '}
        <Link href="/auth/register" className="font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
