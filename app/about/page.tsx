"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Feature_Section_image.jpg"
            alt="STREVO About"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <span className="text-xs tracking-[0.3em] uppercase text-white/80 mb-6 block">
            About / STREVO
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-8 leading-tight">
            Precision <br /> Redefined
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Where technical innovation meets minimal luxury.
          </p>
          <Link href="/products" className="inline-block mt-12">
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm tracking-[0.2em] uppercase">
              Explore the Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Brand Intro */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xl md:text-2xl leading-relaxed text-neutral-700 font-light">
            STREVO exists at the intersection of luxury and function. We engineer streetwear that moves with purpose, 
            crafted for those who demand both performance and sophistication. Every piece embodies minimal design 
            philosophy with technical precision.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 md:px-8 bg-neutral-50">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-500">
              Origin / Story
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Born from <br /> Necessity
            </h2>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p>
                STREVO emerged from a simple observation. The modern wardrobe lacked pieces that could seamlessly 
                transition from movement to stillness, from function to form.
              </p>
              <p>
                We saw a gap between technical performance wear and luxury fashion. Too often, choosing one meant 
                sacrificing the other. STREVO bridges this divide with engineered fabrics, architectural silhouettes, 
                and uncompromising attention to detail.
              </p>
              <p>
                Each collection represents months of material research, fit refinement, and construction innovation. 
                We believe clothing should enhance your natural movement while expressing your refined aesthetic.
              </p>
              <p>
                This is luxury streetwear reimagined. Technical without compromise. Minimal without sacrifice.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Men_1.jpg"
              alt="STREVO Story"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8 block">
            Mission / Purpose
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-12 leading-tight">
            Movement <br /> Elevated
          </h2>
          <div className="space-y-6 text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            <p>
              We create apparel that empowers confident movement through modern life. STREVO pieces are engineered 
              to perform while maintaining the refined aesthetic our community demands.
            </p>
            <p>
              Our mission extends beyond clothing. We're building a culture of intentional design, where every detail 
              serves both function and form. Where luxury means longevity, not excess.
            </p>
            <p>
              The future of fashion is technical, sustainable, and uncompromisingly beautiful. STREVO leads this evolution.
            </p>
          </div>
        </div>
      </section>

      {/* Craftsmanship & Design */}
      <section className="py-24 px-4 md:px-8 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-xs tracking-[0.3em] uppercase text-white/60">
                Process / Craftsmanship
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
                Engineered <br /> Excellence
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>
                  Every STREVO piece begins with fabric innovation. We source premium materials engineered for 
                  performance, then refine them for luxury application.
                </p>
                <p>
                  Our fit philosophy centers on architectural precision. Clean lines, strategic seaming, and 
                  calculated proportions create silhouettes that enhance natural movement.
                </p>
                <p>
                  Construction details matter. Reinforced stress points, minimal seam construction, and premium 
                  hardware ensure each piece maintains its integrity through extended wear.
                </p>
                <p>
                  We obsess over the unseen elements. Interior finishing, fabric hand-feel, and structural drape 
                  receive the same attention as exterior aesthetics.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Men_2.jpg"
                    alt="Craftsmanship Detail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Girl_1.jpg"
                    alt="Material Detail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Girl_2.jpg"
                    alt="Construction Detail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/Images/Feature_Section_image.jpg"
                    alt="Fit Detail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech & Performance */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8 block">
            Technology / Performance
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-16 leading-tight">
            Technical <br /> Innovation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Breathable Architecture",
                description: "Advanced airflow engineering maintains optimal body temperature"
              },
              {
                title: "Structural Durability",
                description: "Reinforced construction withstands intensive daily wear"
              },
              {
                title: "Moisture Management",
                description: "Integrated wicking technology keeps you dry and comfortable"
              },
              {
                title: "Comfort Stretch",
                description: "Four-way stretch materials move naturally with your body"
              },
              {
                title: "Minimal Seaming",
                description: "Reduced friction points for enhanced comfort and clean aesthetics"
              },
              {
                title: "Premium Hand-Feel",
                description: "Luxurious fabric textures that improve with wear"
              }
            ].map((feature, index) => (
              <div key={index} className="text-left space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-[0.1em]">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-24 px-4 md:px-8 bg-neutral-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8 block">
              Philosophy / Values
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              What We <br /> Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Precision",
                description: "Every measurement, every seam, every detail is calculated for optimal performance and aesthetic impact. We believe precision in design translates to confidence in wear."
              },
              {
                title: "Minimalism",
                description: "True luxury lies in restraint. We eliminate the unnecessary to amplify the essential, creating pieces that speak through their silence rather than their noise."
              },
              {
                title: "Innovation",
                description: "We constantly push the boundaries of fabric technology and construction techniques. Innovation drives our pursuit of the perfect balance between form and function."
              },
              {
                title: "Authenticity",
                description: "STREVO represents genuine technical advancement, not marketing gimmicks. Our performance claims are backed by rigorous testing and real-world application."
              },
              {
                title: "Community",
                description: "We design for individuals who value quality over quantity, who understand that true style transcends trends. Our community shares our commitment to intentional living."
              },
              {
                title: "Longevity",
                description: "Fast fashion contradicts our values. We create pieces built to last, designed to improve with age, and constructed to withstand the test of time and wear."
              }
            ].map((value, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-[0.1em]">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8 block">
            Responsibility / Sustainability
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-12 leading-tight">
            Conscious <br /> Creation
          </h2>
          <div className="space-y-8 text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            <p>
              Sustainability isn't a marketing strategy—it's a design principle. We produce in small batches to minimize 
              waste and ensure quality control at every stage.
            </p>
            <p>
              Our supply chain prioritizes ethical manufacturing partners who share our commitment to fair labor practices 
              and environmental responsibility.
            </p>
            <p>
              By creating pieces built to last, we challenge the disposable nature of contemporary fashion. Every STREVO 
              piece is an investment in both your wardrobe and our planet's future.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-24 px-4 md:px-8 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-8 block">
            Personal / Message
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-12 leading-tight">
            A Personal <br /> Note
          </h2>
          <div className="space-y-8 text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
            <p>
              "Fashion should enhance your life, not complicate it. When I founded STREVO, I envisioned clothing that 
              could keep pace with modern life while maintaining the sophistication we all crave."
            </p>
            <p>
              "Too many brands ask you to choose between performance and style, between comfort and luxury. I believe 
              this compromise is unnecessary. STREVO proves that technical innovation and aesthetic refinement can coexist."
            </p>
            <p>
              "To our community: thank you for understanding that true luxury isn't about logos or trends. It's about 
              pieces that make you feel confident, comfortable, and authentically yourself. This is just the beginning."
            </p>
            <div className="pt-8">
              <p className="text-sm tracking-[0.2em] uppercase text-white/60">
                — Founder, STREVO
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Timeline */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8 block">
              Journey / Timeline
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Our <br /> Evolution
            </h2>
          </div>
          <div className="space-y-16">
            {[
              {
                year: "2021",
                title: "Vision Born",
                description: "The concept for STREVO emerges from the need for technical luxury streetwear that doesn't compromise on aesthetics or performance."
              },
              {
                year: "2022",
                title: "Material Research",
                description: "Extensive fabric testing and supplier partnerships established. First prototypes developed with focus on fit and function integration."
              },
              {
                year: "2023",
                title: "Foundation Collection",
                description: "Launch of our inaugural collection featuring core essentials. Community response validates our design philosophy and technical approach."
              },
              {
                year: "2024",
                title: "Expansion Phase",
                description: "Product line diversification and production scaling. Introduction of advanced fabric technologies and refined construction techniques."
              },
              {
                year: "2025",
                title: "Global Vision",
                description: "International expansion and sustainability initiatives. Continued innovation in technical textiles and minimal design philosophy."
              },
              {
                year: "Future",
                title: "Continuous Evolution",
                description: "Ongoing commitment to pushing boundaries in technical fashion while maintaining our core values of precision, minimalism, and authenticity."
              }
            ].map((milestone, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <div className="md:text-right">
                  <span className="text-2xl md:text-3xl font-bold tracking-tighter">
                    {milestone.year}
                  </span>
                </div>
                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-xl font-bold uppercase tracking-[0.1em]">
                    {milestone.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 bg-neutral-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-8 leading-tight">
            Join the <br /> Movement
          </h2>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the intersection of technical innovation and minimal luxury. 
            Discover pieces engineered for the modern generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm tracking-[0.2em] uppercase w-full sm:w-auto">
                Shop Collection
              </Button>
            </Link>
            <Link href="/newsletter">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-sm tracking-[0.2em] uppercase w-full sm:w-auto bg-transparent"
              >
                Join Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}