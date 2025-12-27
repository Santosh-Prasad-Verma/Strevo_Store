// Email validation
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return { valid: false, error: 'Email is required' }
  if (!emailRegex.test(email)) return { valid: false, error: 'Invalid email format' }
  return { valid: true }
}

// Password strength validation
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4 // 0=weak, 4=very strong
  feedback: string
  valid: boolean
  checks: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const passedChecks = Object.values(checks).filter(Boolean).length
  let score: 0 | 1 | 2 | 3 | 4 = 0
  let feedback = ''

  if (passedChecks === 5) {
    score = 4
    feedback = 'Very strong password'
  } else if (passedChecks === 4) {
    score = 3
    feedback = 'Strong password'
  } else if (passedChecks === 3) {
    score = 2
    feedback = 'Moderate password'
  } else if (passedChecks === 2) {
    score = 1
    feedback = 'Weak password'
  } else {
    score = 0
    feedback = 'Very weak password'
  }

  return {
    score,
    feedback,
    valid: score >= 2, // Require at least moderate strength
    checks,
  }
}

// Phone validation (required)
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: false, error: 'Phone number is required' }
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  if (!phoneRegex.test(phone)) return { valid: false, error: 'Invalid phone format' }
  return { valid: true }
}

// Sanitize input (basic XSS prevention)
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
