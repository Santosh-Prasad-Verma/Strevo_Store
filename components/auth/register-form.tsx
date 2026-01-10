"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { validateEmail, validatePasswordStrength, validatePhone, sanitizeInput } from '@/lib/auth/validators'
import { PasswordStrengthMeter } from './password-strength'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { OAuthButtons } from './oauth-buttons'
import Link from 'next/link'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTOS, setAcceptTOS] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      setError(emailValidation.error!)
      setLoading(false)
      return
    }

    const passwordStrength = validatePasswordStrength(formData.password)
    if (!passwordStrength.valid) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required')
      setLoading(false)
      return
    }

    const phoneValidation = validatePhone(formData.phone)
    if (!phoneValidation.valid) {
      setError(phoneValidation.error!)
      setLoading(false)
      return
    }

    if (!acceptTOS) {
      setError('You must accept the Terms of Service')
      setLoading(false)
      return
    }

    // Sanitize inputs
    const metadata = {
      full_name: sanitizeInput(formData.fullName),
      phone: sanitizeInput(formData.phone),
      newsletter_opt_in: newsletter,
    }

    try {
      const result = await signUp(formData.email, formData.password, metadata)
      setLoading(false)

      if (!result.ok) {
        setError(result.error?.message || 'Failed to create account')
      } else {
        router.push('/profile')
      }
    } catch (error) {
      setLoading(false)
      setError('Unable to connect. Please check your internet connection or try again later.')
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
          Create your account
        </h1>
        <p className="text-sm text-neutral-600">
          Join Strevo — minimal design, engineered for movement.
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
          <label htmlFor="fullName" className="block text-sm font-medium mb-2 uppercase tracking-wide">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 focus:outline-none transition-colors"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 focus:outline-none transition-colors"
            placeholder="your@email.com"
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
          <PasswordStrengthMeter password={formData.password} show={formData.password.length > 0} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 focus:outline-none transition-colors pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 uppercase tracking-wide">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 focus:outline-none transition-colors"
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTOS}
              onChange={(e) => setAcceptTOS(e.target.checked)}
              className="w-4 h-4 mt-0.5 focus:ring-black"
              required
            />
            <span className="text-sm">
              I accept the{' '}
              <Link href="/terms" className="underline hover:text-black" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-black" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="w-4 h-4 mt-0.5 border-neutral-300 focus:ring-black"
            />
            <span className="text-sm">
              Send me exclusive drops, product updates, and style guides
            </span>
          </label>
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
              <span>Creating account...</span>
            </>
          ) : (
            'Create Account'
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
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
