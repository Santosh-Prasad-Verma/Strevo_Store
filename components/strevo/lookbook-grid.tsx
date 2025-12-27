"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface LookbookItem {
  imageSrc: string
  imageAlt: string
  ctaLabel?: string
  ctaHref?: string
  caption?: string
  title?: string
  objectPosition?: string
}

interface LookbookGridProps {
  items: LookbookItem[]
  layout?: "two-column" | "split-video"
  videoSrc?: string
}

export function LookbookGrid({ items, layout = "two-column", videoSrc }: LookbookGridProps) {
  if (layout === "split-video" && videoSrc) {
    return (
      <section className="relative w-full overflow-hidden bg-strevo-bg">
        <div className="grid grid-cols-1 md:grid-cols-2 md:h-[100vh]">
          {/* Left Image */}
          <div className="h-[100vh]">
            <LookbookCard item={items[0]} />
          </div>
          
          {/* Right Video */}
          <div className="relative h-[100vh] w-full overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {items.map((item, index) => (
        <LookbookCard key={index} item={item} index={index} />
      ))}
    </section>
  )
}

interface LookbookCardProps {
  item: LookbookItem
  index?: number
}

function LookbookCard({ item, index = 0 }: LookbookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-[100vh] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className={`object-cover ${item.objectPosition || 'object-center'}`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>

      <div className="absolute bottom-4 left-4 md:bottom-12 md:left-12 z-10">
        {item.ctaHref && (
          <Link href={item.ctaHref}>
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block border-2 border-strevo-highlight text-strevo-highlight px-8 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-strevo-highlight hover:text-strevo-bg transition-all duration-300 mb-4 cursor-pointer"
            >
              {item.ctaLabel || "To See"}
            </motion.span>
          </Link>
        )}
        {item.title && (
          <h3 className="font-display text-2xl font-bold text-strevo-highlight tracking-wider uppercase">
            {item.title}
          </h3>
        )}
        {item.caption && (
          <p className="text-strevo-highlight/80 text-sm font-ui">{item.caption}</p>
        )}
      </div>
    </motion.div>
  )
}
