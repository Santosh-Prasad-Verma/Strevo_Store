'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ColorSwatchProps {
  color: string
  selected: boolean
  onClick: () => void
  count?: number
}

const colorMap: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  pink: '#EC4899',
  purple: '#A855F7',
  gray: '#6B7280',
  brown: '#92400E',
  beige: '#D4C5B9',
  navy: '#1E3A8A',
  olive: '#84CC16',
  maroon: '#7F1D1D',
}

export function ColorSwatch({ color, selected, onClick, count }: ColorSwatchProps) {
  const bgColor = colorMap[color.toLowerCase()] || color

  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`w-8 h-8 rounded-full border-2 transition-all ${
          selected ? 'border-black shadow-md' : 'border-neutral-300'
        }`}
        style={{ backgroundColor: bgColor }}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className={`w-4 h-4 ${bgColor === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
          </motion.div>
        )}
      </div>
      
      {count !== undefined && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
      
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {color}
      </span>
    </motion.button>
  )
}
