"use client"

import Link from "next/link"
import { ChevronRight, Lock } from "lucide-react"
import { motion } from "framer-motion"

interface CheckoutHeaderProps {
  currentStep?: number
}

export function CheckoutHeader({ currentStep = 1 }: CheckoutHeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border-b border-neutral-200"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            STREVO
          </Link>
          
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">SECURE CHECKOUT</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <div className={`flex items-center gap-2 text-xs ${currentStep >= 1 ? 'text-black' : 'text-neutral-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${currentStep >= 1 ? 'bg-black text-white' : 'border-2 border-neutral-300'}`}>1</div>
            <span className="font-medium">BAG</span>
          </div>
          <div className="w-12 h-px bg-neutral-300" />
          <div className={`flex items-center gap-2 text-xs ${currentStep >= 2 ? 'text-black' : 'text-neutral-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${currentStep >= 2 ? 'bg-black text-white' : 'border-2 border-neutral-300'}`}>2</div>
            <span className="font-medium">ADDRESS</span>
          </div>
          <div className="w-12 h-px bg-neutral-300" />
          <div className={`flex items-center gap-2 text-xs ${currentStep >= 3 ? 'text-black' : 'text-neutral-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${currentStep >= 3 ? 'bg-black text-white' : 'border-2 border-neutral-300'}`}>3</div>
            <span className="font-medium">PAYMENT</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
