'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect prefers-reduced-motion
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

/**
 * Returns animation props or empty object based on reduced motion preference
 */
export function useMotionSafe<T extends object>(animationProps: T): T | Record<string, never> {
  const prefersReducedMotion = useReducedMotion()
  return prefersReducedMotion ? {} : animationProps
}
