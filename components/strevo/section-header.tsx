"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fadeUp } from "@/lib/animations/variants"

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
}

export function SectionHeader({ 
  title, 
  viewAllHref, 
  viewAllLabel = "View All",
  className = ""
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={`flex items-center justify-between mb-12 ${className}`}
    >
      <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase text-strevo-highlight">
        {title}
      </h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="hidden md:flex items-center text-sm font-ui tracking-widest uppercase text-strevo-muted hover:text-strevo-highlight transition-colors duration-micro group"
        >
          {viewAllLabel}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-micro group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  )
}
