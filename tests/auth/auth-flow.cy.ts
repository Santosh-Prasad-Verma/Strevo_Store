// Cypress E2E test for authentication flow

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Registration', () => {
    it('should register a new user successfully', () => {
      cy.visit('/auth/register')

      // Fill out registration form
      cy.get('input[name="fullName"]').type('Test User')
      cy.get('input[name="email"]').type(`test-${Date.now()}@example.com`)
      cy.get('input[name="password"]').type('TestPassword123!')
      cy.get('input[name="confirmPassword"]').type('TestPassword123!')
      
      // Accept TOS
      cy.get('input[type="checkbox"]').first().check()

      // Submit form
      cy.get('button[type="submit"]').click()

      // Should redirect to profile
      cy.url().should('include', '/profile')
    })

    it('should show password strength meter', () => {
      cy.visit('/auth/register')

      cy.get('input[name="password"]').type('weak')
      cy.contains('Weak password').should('be.visible')

      cy.get('input[name="password"]').clear().type('StrongPass123!')
      cy.contains('Strong password').should('be.visible')
    })

    it('should validate password match', () => {
      cy.visit('/auth/register')

      cy.get('input[name="fullName"]').type('Test User')
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('TestPassword123!')
      cy.get('input[name="confirmPassword"]').type('DifferentPassword123!')
      cy.get('input[type="checkbox"]').first().check()

      cy.get('button[type="submit"]').click()

      cy.contains('Passwords do not match').should('be.visible')
    })
  })

  describe('Login', () => {
    it('should login with valid credentials', () => {
      cy.visit('/auth/login')

      cy.get('input[type="email"]').type('existing@example.com')
      cy.get('input[type="password"]').type('ValidPassword123!')

      cy.get('button[type="submit"]').click()

      // Should redirect to profile
      cy.url().should('include', '/profile')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/auth/login')

      cy.get('input[type="email"]').type('wrong@example.com')
      cy.get('input[type="password"]').type('WrongPassword123!')

      cy.get('button[type="submit"]').click()

      cy.contains(/invalid email or password/i).should('be.visible')
    })

    it('should toggle password visibility', () => {
      cy.visit('/auth/login')

      cy.get('input[type="password"]').should('have.attr', 'type', 'password')
      
      cy.get('button[aria-label*="Show password"]').click()
      cy.get('input[type="text"]').should('exist')

      cy.get('button[aria-label*="Hide password"]').click()
      cy.get('input[type="password"]').should('exist')
    })
  })

  describe('OAuth', () => {
    it('should have Google OAuth button', () => {
      cy.visit('/auth/login')
      cy.contains('Continue with Google').should('be.visible')
    })
  })

  describe('Magic Link', () => {
    it('should send magic link', () => {
      cy.visit('/auth/login')

      cy.get('input[type="email"]').type('test@example.com')
      cy.contains('Send me a sign-in link').click()

      cy.contains('Check your email').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.visit('/auth/login')

      // Tab through form
      cy.get('body').tab()
      cy.focused().should('have.attr', 'type', 'email')

      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'password')

      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'checkbox')
    })

    it('should have proper ARIA labels', () => {
      cy.visit('/auth/login')

      cy.get('input[type="email"]').should('have.attr', 'aria-describedby')
      cy.get('[role="alert"]').should('have.attr', 'aria-live', 'assertive')
    })
  })
})
