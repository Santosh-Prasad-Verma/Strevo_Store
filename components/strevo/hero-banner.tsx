"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { heroHeading, heroSubtitle, heroCTA } from "@/lib/animations/variants"

interface HeroBannerProps {
  tagline?: string
  headline: string
  subheadline?: string
  primaryCTA?: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  videoSrc?: string
  imageSrc?: string
  overlayOpacity?: number
}

export function HeroBanner({
  tagline = "Technical Performance Wear",
  headline = "Defined by\nPrecision",
  subheadline,
  primaryCTA = { label: "Shop Men", href: "/products?category=men" },
  secondaryCTA = { label: "Shop Women", href: "/products?category=women" },
  videoSrc,
  imageSrc,
  overlayOpacity = 0.6,
}: HeroBannerProps) {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-strevo-bg text-strevo-highlight">
      {/* Background Media */}
      {videoSrc ? (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Dark overlay for video */}
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : imageSrc ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})`, opacity: overlayOpacity }}
        />
      ) : null}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative container h-full flex flex-col justify-end pb-24 px-4 md:px-8 z-10">
        {/* Tagline */}
        <motion.span
          variants={heroSubtitle}
          initial="hidden"
          animate="show"
          className="font-ui text-xs md:text-sm tracking-[0.3em] uppercase mb-4 text-strevo-muted"
        >
          {tagline}
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={heroHeading}
          initial="hidden"
          animate="show"
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase mb-6 max-w-4xl whitespace-pre-line"
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            variants={heroSubtitle}
            initial="hidden"
            animate="show"
            className="font-ui text-base md:text-lg text-strevo-muted max-w-xl mb-8"
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          variants={heroCTA}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href={primaryCTA.href}>
            <Button className="bg-strevo-highlight text-strevo-bg hover:bg-white/90 rounded-none px-8 py-6 text-sm tracking-[0.2em] uppercase font-medium w-full sm:w-auto transition-all duration-micro ease-premium">
              {primaryCTA.label}
            </Button>
          </Link>
          <Link href={secondaryCTA.href}>
            <Button
              variant="outline"
              className="border-strevo-highlight text-strevo-highlight hover:bg-strevo-highlight hover:text-strevo-bg rounded-none px-8 py-6 text-sm tracking-[0.2em] uppercase font-medium w-full sm:w-auto bg-transparent transition-all duration-micro ease-premium"
            >
              {secondaryCTA.label}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
