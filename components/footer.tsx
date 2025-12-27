"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowRight } from "lucide-react"
import CurvedLoop from "@/components/curved-loop/CurvedLoop"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const handleScroll = () => setScrollY(window.scrollY)
    
    if (footerRef.current) {
      observer.observe(footerRef.current)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <>
      {/* Curved Loop before footer */}
      <div className="bg-strevo-bg">
        <CurvedLoop 
          marqueeText="FREE DELIVERY ON ORDERS ABOVE ₹999 ✦ EASY RETURNS ✦ SECURE PAYMENTS ✦ 24/7 SUPPORT ✦" 
          speed={1.5}
          curveAmount={500}
          direction="left"
          interactive={true}
        />
      </div>
      <footer ref={footerRef} className="relative bg-black text-white overflow-hidden">
      {/* Huge Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`text-[20vw] md:text-[15vw] lg:text-[12vw] font-black uppercase tracking-tighter text-white opacity-[0.08] select-none transition-all duration-1000 ${
            isVisible ? 'scale-100' : 'scale-95 opacity-0'
          }`}
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transform: `translateY(${scrollY * 0.1 - 10}%)`,
            lineHeight: '0.8',
            WebkitTextStroke: '1px rgba(255,255,255,0.1)'
          }}
        >
          STREVO
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/90"></div>

      <div className="relative container mx-auto px-6 md:px-8 py-20">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Brand Section */}
          <div className={`lg:col-span-1 space-y-8 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12">
                  <Image
                    src="/Strevo_store_logo_without_backround.png"
                    alt="Strevo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                  Strevo
                </h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Engineered for the modern generation. Premium streetwear that blends comfort, performance, and style.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-neutral-400 group">
                <MapPin className="h-4 w-4 mt-0.5 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">
                  123 Fashion Street<br />Mumbai, India 400001
                </span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 group">
                <Phone className="h-4 w-4 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 group">
                <Mail className="h-4 w-4 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">hello@strevo.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" }
              ].map(({ icon: Icon, href, label }) => (
                <Link 
                  key={label}
                  href={href} 
                  aria-label={label}
                  className="group relative w-11 h-11 rounded-full border border-neutral-800 hover:border-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10"
                >
                  <Icon className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Section */}
          <div className={`space-y-6 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h4 className="font-bold uppercase tracking-[0.2em] text-sm text-white">Shop</h4>
            <ul className="space-y-4">
              {[
                { name: "Men's Collection", href: "/products?category=men" },
                { name: "Women's Collection", href: "/products?category=women" },
                { name: "Accessories", href: "/products?category=accessories" },
                { name: "New Arrivals", href: "/products" },
                { name: "Sale", href: "/products?sale=true" }
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    href={href} 
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm group flex items-center"
                  >
                    <span>{name}</span>
                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className={`space-y-6 transition-all duration-700 delay-[900ms] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h4 className="font-bold uppercase tracking-[0.2em] text-sm text-white">Support</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Help Center", href: "/faq" },
                { name: "Shipping & Returns", href: "/shipping" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Contact Us", href: "/contact" },
                { name: "Track Order", href: "/orders" }
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    href={href} 
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm group flex items-center"
                  >
                    <span>{name}</span>
                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className={`space-y-6 transition-all duration-700 delay-[1100ms] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div>
              <h4 className="font-bold uppercase tracking-[0.2em] text-sm text-white mb-3">Stay Updated</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Get exclusive drops, early access, and style inspiration delivered to your inbox.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-500 px-4 py-3 text-sm focus:border-white focus:bg-neutral-900 outline-none transition-all duration-200 rounded-none"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading || isSubscribed}
                className="animated-border-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Subscribing...
                  </span>
                ) : isSubscribed ? (
                  "✓ Subscribed!"
                ) : (
                  "Subscribe"
                )}
                <span className="line-1"></span>
                <span className="line-2"></span>
                <span className="line-3"></span>
                <span className="line-4"></span>
              </button>
            </form>

            <p className="text-neutral-500 text-xs leading-relaxed">
              By subscribing, you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </Link>{" "}
              and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={`mt-20 pt-8 border-t border-neutral-900 transition-all duration-700 delay-[1300ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-neutral-500 text-xs uppercase tracking-[0.1em] text-center lg:text-left">
              © 2025 Strevo. All rights reserved. Made with ❤️ in India
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 text-xs text-neutral-500 uppercase tracking-[0.1em]">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Refund Policy", href: "/refund" }
              ].map(({ name, href }, index, array) => (
                <div key={name} className="flex items-center">
                  <Link 
                    href={href} 
                    className="hover:text-white transition-colors duration-200"
                  >
                    {name}
                  </Link>
                  {index < array.length - 1 && (
                    <span className="ml-6 text-neutral-700">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}