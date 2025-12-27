import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'
import { AuthProvider } from '@/components/auth/auth-provider'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Supabase client
jest.mock('@/lib/auth/supabase-client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOtp: jest.fn(),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}))

describe('LoginForm', () => {
  it('renders login form with all fields', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error for invalid email', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it('shows error for empty password', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    const toggleButton = screen.getByLabelText(/show password/i)

    expect(passwordInput.type).toBe('password')

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('text')

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })
})
