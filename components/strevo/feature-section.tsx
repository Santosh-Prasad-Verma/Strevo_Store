"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations/variants"

interface Feature {
  title: string
  description: string
}

interface FeatureSectionProps {
  tagline?: string
  headline: string
  description: string[]
  features: Feature[]
  imageSrc?: string
  imageAlt?: string
  videoSrc?: string
  ctaLabel?: string
  ctaHref?: string
  reversed?: boolean
}

export function FeatureSection({
  tagline = "System 01 / Essentials",
  headline,
  description,
  features,
  imageSrc,
  imageAlt,
  videoSrc,
  ctaLabel = "Learn More",
  ctaHref = "/about",
  reversed = false,
}: FeatureSectionProps) {
  return (
    <section className="bg-strevo-surface/30 py-24 px-4 md:px-8 border-y border-strevo-surface/40">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className={`space-y-8 ${reversed ? "order-2 md:order-2" : "order-2 md:order-1"}`}
        >
          <motion.span
            variants={staggerItem}
            className="font-ui text-xs tracking-[0.3em] uppercase text-strevo-muted"
          >
            {tagline}
          </motion.span>

          <motion.h2
            variants={staggerItem}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-tight text-strevo-highlight"
          >
            {headline}
          </motion.h2>

          {description.map((para, i) => (
            <motion.p
              key={i}
              variants={staggerItem}
              className="font-ui text-strevo-muted max-w-md leading-relaxed"
            >
              {para}
            </motion.p>
          ))}

          <motion.div
            variants={staggerItem}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4"
          >
            {features.map((feature) => (
              <div key={feature.title}>
                <h4 className="font-display font-bold uppercase tracking-[0.12em] mb-2 text-strevo-highlight text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-strevo-muted">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem}>
            <Link href={ctaHref}>
              <button className="slide-btn rounded-none text-xs mt-4">
                <span>{ctaLabel}</span>
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Image or Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className={`relative aspect-[3/4] md:aspect-[4/5] overflow-hidden ${
            reversed ? "order-1 md:order-1" : "order-1 md:order-2"
          }`}
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt || ""}
              fill
              className="object-cover md:object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
