"use client"

import { motion } from "framer-motion"

export function OrderSuccessAnimation() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.15, 0] }}
        transition={{ duration: 1.2, times: [0, 0.5, 1], ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
      />

      {/* Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.05, 1] }}
        transition={{ duration: 0.4, times: [0, 0.8, 1], ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 border-2 border-black rounded-full bg-white"
      />

      {/* Checkmark SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
        <motion.path
          d="M 35 64 L 55 84 L 93 46"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}
