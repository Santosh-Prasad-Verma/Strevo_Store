# 🔧 Authentication System - Scripts & Commands

## Package.json Scripts

Add these scripts to your `package.json` for testing:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "type-check": "tsc --noEmit"
  }
}
```

## Install Test Dependencies

```bash
# Jest & React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Cypress
npm install -D cypress

# TypeScript types
npm install -D @types/jest @types/testing-library__jest-dom
```

## Jest Configuration

Create `jest.config.js`:

```js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```js
import '@testing-library/jest-dom'
```

## Cypress Configuration

Create `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

## Running Tests

### Unit Tests
```bash
# Run all tests
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Open Cypress UI
npm run cypress:open

# Run headless
npm run cypress:run

# Run specific test file
npx cypress run --spec "tests/auth/auth-flow.cy.ts"
```

### Type Checking
```bash
# Check TypeScript types
npm run type-check
```

## Pre-commit Hooks (Optional)

Install Husky for pre-commit checks:

```bash
npm install -D husky lint-staged

# Initialize husky
npx husky-init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run cypress:run
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

## Environment-Specific Commands

### Development
```bash
# Start dev server
npm run dev

# Run tests in watch mode
npm run test:watch

# Open Cypress
npm run cypress:open
```

### Staging
```bash
# Build for staging
npm run build

# Run production build locally
npm run start

# Run E2E tests against staging
CYPRESS_BASE_URL=https://staging.strevo.com npm run cypress:run
```

### Production
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Run smoke tests
CYPRESS_BASE_URL=https://strevo.com npm run cypress:run --spec "tests/smoke/**"
```

## Useful Commands

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Database
```bash
# Run Supabase migrations (if using local dev)
supabase db push

# Reset database
supabase db reset
```

### Debugging
```bash
# Run Next.js in debug mode
NODE_OPTIONS='--inspect' npm run dev

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Performance Testing

### Lighthouse CI

Install:
```bash
npm install -D @lhci/cli
```

Create `lighthouserc.js`:
```js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/auth/login', 'http://localhost:3000/auth/register'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```

Run:
```bash
npm run build
npm run start &
npx lhci autorun
```

## Bundle Analysis

```bash
# Analyze bundle size
npm install -D @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})

# Run analysis
ANALYZE=true npm run build
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run cypress:open` | Open Cypress UI |
| `npm run cypress:run` | Run E2E tests headless |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |
| `vercel --prod` | Deploy to production |

---

**Ready to test?** Run `npm run test` to start!
