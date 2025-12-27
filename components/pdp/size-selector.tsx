"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: { value: string; available: boolean }[]
  onSizeSelect: (size: string) => void
}

export function SizeSelector({ sizes, onSizeSelect }: SizeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (size: string, available: boolean) => {
    if (!available) return
    setSelected(size)
    onSizeSelect(size)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider">Select Size</h3>
        <button className="text-xs text-primary hover:underline">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => handleSelect(size.value, size.available)}
            disabled={!size.available}
            className={cn(
              "px-6 py-3 border text-sm font-medium transition-all",
              size.available
                ? selected === size.value
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 hover:border-black"
                : "border-neutral-200 text-neutral-300 cursor-not-allowed line-through"
            )}
          >
            {size.value}
          </button>
        ))}
      </div>
    </div>
  )
}
