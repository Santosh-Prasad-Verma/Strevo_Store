"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types/database"
import { LoadingScreen } from "@/components/loading-screen"
import { CustomerReviews, InstagramSection } from "@/components/home-sections"
import { FlashSaleBanner } from "@/components/flash-sale-banner"
import CurvedLoop from "@/components/curved-loop/CurvedLoop"
import {
  HeroBanner,
  StrevoProductGrid,
  SectionHeader,
  CategoryGrid,
  FeatureSection,
  LookbookGrid,
} from "@/components/strevo"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTrendingLoading, setIsTrendingLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=8')
        const json = await res.json()
        setProducts(json.data || [])
      } catch (error) { 
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    async function fetchTrendingProducts() {
      try {
        const res = await fetch('/api/products?sort=popular&limit=8')
        const json = await res.json()
        setTrendingProducts(json.data || [])
      } catch (error) { 
        console.error('Failed to fetch trending products:', error)
      } finally {
        setIsTrendingLoading(false)
      }
    }
    fetchTrendingProducts()
  }, [])

  const categories = [
    { name: "Men", image: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/men_category.jpg", href: "/products?category=men", position: "bg-top" },
    { name: "Women", image: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/women_gategory.jpg", href: "/products?category=women", position: "bg-center" },
    { name: "Accessories", image: "/Accessories_section.jpg", href: "/products?category=accessories", position: "bg-center" },
    { name: "New Arrivals", image: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/1.jpeg", href: "/products?sort=newest", position: "bg-center" },
    { name: "Best Sellers", image: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/img_3.png", href: "/products?sort=popular", position: "bg-top" },
    { name: "Sale", image: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Girl_1.jpg", href: "/products?sort=discount-desc", position: "bg-center" },
  ]

  const features = [
    { title: "Breathable", description: "Advanced airflow technology" },
    { title: "Durable", description: "Reinforced construction" },
    { title: "Sweat Resistant", description: "Moisture-wicking fabric" },
    { title: "Soft-Touch", description: "Premium inner lining" },
    { title: "Minimal Seams", description: "Seamless comfort" },
    { title: "True-to-Street", description: "Authentic streetwear fit" },
  ]

  return (
    <>
      <LoadingScreen onComplete={() => setShowContent(true)} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col min-h-screen bg-strevo-bg text-strevo-highlight"
      >
        {/* Flash Sale Banner */}
        <FlashSaleBanner />
        
        {/* Hero Section with Animations */}
        <HeroBanner
          tagline="Technical Performance Wear"
          headline={`Defined by\nPrecision`}
          primaryCTA={{ label: "Shop Men", href: "/products?category=men" }}
          secondaryCTA={{ label: "Shop Women", href: "/products?category=women" }}
          videoSrc="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Hero_section.mp4"
          overlayOpacity={0.6}
        />

        {/* Curved Loop Offers Section */}
        <CurvedLoop 
          marqueeText="WINTER SALE 50% OFF ✦ FREE SHIPPING OVER 999 ✦ NEW ARRIVALS DAILY ✦ BUY 2 GET 1 FREE ✦" 
          speed={1.5}
          curveAmount={500}
          direction="right"
          interactive={true}
        />

        {/* New Arrivals - Animated Grid */}
        <section className="py-20 px-4 md:px-8 container mx-auto">
          <SectionHeader title="New Arrivals" viewAllHref="/products" />
          <StrevoProductGrid 
            products={products.slice(0, 8)} 
            isLoading={isLoading}
            columns={4}
          />
          <div className="mt-12 md:hidden flex justify-center">
            <Link href="/products">
              <Button
                variant="outline"
                className="rounded-none px-8 py-6 text-xs tracking-[0.2em] uppercase bg-transparent border-strevo-highlight text-strevo-highlight hover:bg-strevo-highlight hover:text-strevo-bg"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Trending Now - Animated Grid */}
        <section className="py-20 px-4 md:px-8 container mx-auto bg-strevo-surface/30">
          <div className="flex items-center justify-start gap-3 mb-12 container mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase text-white">
              Trending Now
            </h2>
            <span className="text-4xl md:text-5xl animate-pulse">🔥</span>
          </div>
          <StrevoProductGrid 
            products={trendingProducts.slice(0, 4)} 
            isLoading={isTrendingLoading}
            columns={4}
          />
          <div className="mt-12 md:hidden flex justify-center">
            <Link href="/products?sort=popular">
              <Button
                variant="outline"
                className="rounded-none px-8 py-6 text-xs tracking-[0.2em] uppercase bg-transparent border-strevo-highlight text-strevo-highlight hover:bg-strevo-highlight hover:text-strevo-bg"
              >
                View All Trending
              </Button>
            </Link>
          </div>
        </section>

        {/* Video + Image Split Section */}
        <LookbookGrid
          layout="split-video"
          videoSrc="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/vid_2.mp4"
          items={[
            {
              imageSrc: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Girl_2.jpg",
              imageAlt: "Strevo Lookbook Number 8 featuring latest collection",
              ctaLabel: "To See",
              ctaHref: "/products",
              caption: "See the whole collection",
              objectPosition: "object-top"
            }
          ]}
        />

        {/* Two Column Lookbook */}
        <LookbookGrid
          items={[
            {
              imageSrc: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/img_3.png",
              imageAlt: "Strevo denim collection featuring raw denim ensemble",
              ctaLabel: "To See",
              ctaHref: "/products",
              caption: "New beanies available in 3 colors"
            },
            {
              imageSrc: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Girl_1.jpg",
              imageAlt: "Strevo winter accessories featuring scarf and beanie collection",
              ctaLabel: "To See",
              ctaHref: "/products",
              caption: "Long scarf available in 3 colors"
            }
          ]}
        />

        {/* Second Lookbook Row */}
        <LookbookGrid
          items={[
            {
              imageSrc: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Men_1.jpg",
              imageAlt: "Strevo Lookbook Number 8 showcasing seasonal collection",
              ctaLabel: "To See",
              ctaHref: "/products",
              title: "LOOKBOOK N°8",
              caption: "See the whole collection",
              objectPosition: "object-top"
            },
            {
              imageSrc: "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Men_2.jpg",
              imageAlt: "Strevo tracksuit collection available in multiple colorways",
              ctaLabel: "To See",
              ctaHref: "/products",
              caption: "Visionary tracksuit, available in 4 colors.",
              objectPosition: "object-top"
            }
          ]}
        />

        {/* Categories Grid - Animated */}
        <CategoryGrid categories={categories} />

        {/* Best Sellers - After Categories */}
        <section className="py-20 px-4 md:px-8 container mx-auto">
          <SectionHeader title="Best Sellers" viewAllHref="/products?sort=popular" />
          <StrevoProductGrid 
            products={products.slice(0, 4)} 
            isLoading={isLoading}
            columns={4}
          />
          <div className="mt-12 md:hidden flex justify-center">
            <Link href="/products?sort=popular">
              <Button
                variant="outline"
                className="rounded-none px-8 py-6 text-xs tracking-[0.2em] uppercase bg-transparent border-strevo-highlight text-strevo-highlight hover:bg-strevo-highlight hover:text-strevo-bg"
              >
                View All Best Sellers
              </Button>
            </Link>
          </div>
        </section>

        {/* Technical Feature Section - Animated */}
        <FeatureSection
          tagline="System 01 / Essentials"
          headline={`Engineered for\nthe Modern Generation`}
          description={[
            "At Strevo, we design apparel that blends comfort, performance, and modern aesthetics. Every piece is crafted with thoughtful details, premium fabrics, and precision tailoring—built for those who move with intention.",
            "From long days to late nights, Strevo adapts to your rhythm, giving you style that feels effortless and confidence that lasts."
          ]}
          features={features}
          videoSrc="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/vid_1.mp4"
          ctaLabel="Explore Fabric Technology"
          ctaHref="/about"
        />

        <CustomerReviews />
        <InstagramSection />
      </motion.div>
    </>
  )
}
