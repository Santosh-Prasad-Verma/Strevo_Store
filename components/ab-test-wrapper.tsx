"use client"

import { useEffect, useState } from "react"

interface Props {
  testId: string
  variantA: React.ReactNode
  variantB: React.ReactNode
}

export function ABTestWrapper({ testId, variantA, variantB }: Props) {
  const [variant, setVariant] = useState<"A" | "B">("A")

  useEffect(() => {
    const stored = localStorage.getItem(`ab-test-${testId}`)
    if (stored) {
      setVariant(stored as "A" | "B")
    } else {
      const random = Math.random() < 0.5 ? "A" : "B"
      setVariant(random)
      localStorage.setItem(`ab-test-${testId}`, random)
      
      fetch("/api/ab-test/track", {
        method: "POST",
        body: JSON.stringify({ testId, variant: random })
      })
    }
  }, [testId])

  return <>{variant === "A" ? variantA : variantB}</>
}
