"use client"

import { validatePasswordStrength, type PasswordStrength } from '@/lib/auth/validators'
import { motion } from 'framer-motion'

interface PasswordStrengthMeterProps {
  password: string
  show: boolean
}

export function PasswordStrengthMeter({ password, show }: PasswordStrengthMeterProps) {
  if (!show || !password) return null

  const strength = validatePasswordStrength(password)

  const colors = {
    0: 'bg-red-500',
    1: 'bg-orange-500',
    2: 'bg-yellow-500',
    3: 'bg-lime-500',
    4: 'bg-green-500',
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= strength.score ? 1 : 0 }}
            transition={{ duration: 0.2, delay: level * 0.05 }}
            className={`h-1 flex-1 rounded-full ${
              level <= strength.score ? colors[strength.score] : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-600">{strength.feedback}</p>
      <ul className="text-xs space-y-1">
        {!strength.checks.length && (
          <li className="text-red-600">• At least 8 characters</li>
        )}
        {!strength.checks.uppercase && (
          <li className="text-red-600">• One uppercase letter</li>
        )}
        {!strength.checks.number && (
          <li className="text-red-600">• One number</li>
        )}
        {!strength.checks.special && (
          <li className="text-red-600">• One special character</li>
        )}
      </ul>
    </div>
  )
}
