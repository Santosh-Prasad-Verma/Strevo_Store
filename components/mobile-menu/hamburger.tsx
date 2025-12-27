"use client"

import { motion } from "framer-motion"

interface HamburgerProps {
  isOpen: boolean
  onClick: () => void
}

export function Hamburger({ isOpen, onClick }: HamburgerProps) {
  return (
    <button
      onClick={onClick}
      className="relative z-50 w-10 h-10 flex items-center justify-center md:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-0.5 bg-black origin-center"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full h-0.5 bg-black"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-0.5 bg-black origin-center"
        />
      </div>
    </button>
  )
}
