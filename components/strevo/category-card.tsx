"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { fadeUp, productImageHover } from "@/lib/animations/variants"

interface CategoryCardProps {
  name: string
  image: string
  href: string
  index?: number
  position?: string
}

export function CategoryCard({ name, image, href, index = 0, position = "bg-center" }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.4, 
        ease: [0.19, 1, 0.22, 1],
        delay: index * 0.1 
      }}
    >
      <Link href={href} className="group relative h-[400px] overflow-hidden block">
        <motion.div
          className={`absolute inset-0 bg-cover ${position}`}
          style={{ backgroundImage: `url(${image})` }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="font-display text-3xl font-bold text-strevo-highlight tracking-[0.2em] uppercase border-b-2 border-transparent group-hover:border-strevo-highlight transition-all duration-300 pb-1">
            {name}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}

interface CategoryGridProps {
  categories: Array<{ name: string; image: string; href: string; position?: string }>
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="border-b border-strevo-surface/40">
      {/* Mobile: Horizontal scroll (first 3 only) */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-thin gap-0">
        {categories.slice(0, 3).map((category, index) => (
          <div key={category.name} className="flex-shrink-0 w-full snap-center">
            <CategoryCard
              {...category}
              index={index}
            />
          </div>
        ))}
      </div>
      
      {/* Desktop: Grid layout (first 3 only) */}
      <div className="hidden md:grid md:grid-cols-3">
        {categories.slice(0, 3).map((category, index) => (
          <CategoryCard
            key={category.name}
            {...category}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
