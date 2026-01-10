"use client"

import { useState } from "react"
import Link from "next/link"
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowRight } from "lucide-react"

export function CurtainFooter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      if (res.ok) {
        setIsSubscribed(true)
        setEmail("")
        setTimeout(() => setIsSubscribed(false), 3000)
      }
    } catch (error) {
      console.error("Subscription failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-black text-white py-20 px-4 md:px-12 flex flex-col justify-center relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full top-[-10%] left-[-10%] blur-3xl animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-blue-600/20 rounded-full bottom-[-10%] right-[-10%] blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Huge Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black uppercase tracking-tighter text-white opacity-[0.03] select-none"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transform: 'translateY(-10%)',
            lineHeight: '0.8'
          }}
        >
          STREVO
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6 anim-element">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Let's work together.
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Engineered for the modern generation. Premium streetwear that blends comfort, performance, and style.
            </p>
            
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
            <div className="flex space-x-4 pt-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" }
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-gray-900 transition duration-300"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2 md:col-start-7 space-y-4 anim-element">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { name: "Men's Collection", href: "/products?category=men" },
                { name: "Women's Collection", href: "/products?category=women" },
                { name: "Accessories", href: "/products?category=accessories" },
                { name: "New Arrivals", href: "/products" }
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link href={href} className="hover:text-white transition group flex items-center">
                    <span>{name}</span>
                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2 space-y-4 anim-element">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { name: "Help Center", href: "/faq" },
                { name: "Shipping & Returns", href: "/shipping" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Contact Us", href: "/contact" }
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link href={href} className="hover:text-white transition">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-4 anim-element">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Stay Updated</h4>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading || isSubscribed}
                className="absolute right-2 top-2 bg-blue-600 text-white p-1.5 rounded hover:bg-blue-500 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isSubscribed ? (
                  "✓"
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 anim-element">
          <p>&copy; 2025 Strevo. All rights reserved.</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}