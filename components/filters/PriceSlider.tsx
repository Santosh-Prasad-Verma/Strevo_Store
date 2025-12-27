'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PriceSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export function PriceSlider({ min, max, value, onChange }: PriceSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (index: 0 | 1, newValue: number) => {
    const updated: [number, number] = [...localValue] as [number, number]
    updated[index] = newValue
    setLocalValue(updated)
  }

  const handleMouseUp = () => {
    onChange(localValue)
  }

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium">₹{localValue[0]}</span>
        <span className="font-medium">₹{localValue[1]}</span>
      </div>
      
      <div className="relative h-2">
        <div className="absolute w-full h-1 bg-neutral-200 rounded-full top-1/2 -translate-y-1/2" />
        
        <motion.div
          className="absolute h-1 bg-black rounded-full top-1/2 -translate-y-1/2"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
          initial={false}
          animate={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          transition={{ duration: 0.15 }}
        />
        
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
        />
        
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  )
}
