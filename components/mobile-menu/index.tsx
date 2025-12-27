"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, TrendingUp, Package, Tag, Instagram, Twitter, Facebook, HelpCircle, Mail, Info } from "lucide-react"
import { MenuProfile } from "./menu-profile"
import { MenuItem } from "./menu-item"
import { MenuAccordion } from "./menu-accordion"
import { CategoryLink } from "@/components/navigation/category-link"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
}

export function MobileMenu({ isOpen, onClose, user, onLogout }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 md:hidden overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em]">Menu</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 transition-colors rounded-full"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Profile Section */}
              <MenuProfile user={user} onLogout={onLogout} />

              {/* Main Navigation with Prefetch */}
              <div className="py-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-6 py-3 border-b border-neutral-100"
                >
                  <CategoryLink
                    target={{ category: "men" }}
                    source="mobile-drawer"
                    onClick={onClose}
                    className="text-base font-medium uppercase tracking-wider hover:text-neutral-600 transition-colors block"
                  >
                    Men
                  </CategoryLink>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="px-6 py-3 border-b border-neutral-100"
                >
                  <CategoryLink
                    target={{ category: "women" }}
                    source="mobile-drawer"
                    onClick={onClose}
                    className="text-base font-medium uppercase tracking-wider hover:text-neutral-600 transition-colors block"
                  >
                    Women
                  </CategoryLink>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-6 py-3 border-b border-neutral-100"
                >
                  <CategoryLink
                    target={{ category: "accessories" }}
                    source="mobile-drawer"
                    onClick={onClose}
                    className="text-base font-medium uppercase tracking-wider hover:text-neutral-600 transition-colors block"
                  >
                    Accessories
                  </CategoryLink>
                </motion.div>
                <MenuItem 
                  href="/products?sort=newest" 
                  label="New Arrivals" 
                  icon={Sparkles}
                  badge="New"
                  delay={0.25} 
                  onClick={onClose}
                />
                <MenuItem 
                  href="/products?trending=true" 
                  label="Trending" 
                  icon={TrendingUp}
                  delay={0.3} 
                  onClick={onClose}
                />
                <MenuItem 
                  href="/products" 
                  label="All Products" 
                  icon={Package}
                  delay={0.35} 
                  onClick={onClose}
                />
              </div>

              {/* Categories Accordion */}
              <MenuAccordion
                title="Categories"
                delay={0.4}
                items={[
                  { label: "T-Shirts", href: "/products?category=tshirts" },
                  { label: "Oversized", href: "/products?category=oversized" },
                  { label: "Hoodies", href: "/products?category=hoodies" },
                  { label: "Cargos", href: "/products?category=cargos" },
                  { label: "Joggers", href: "/products?category=joggers" },
                  { label: "Jackets", href: "/products?category=jackets" },
                  { label: "Shoes", href: "/products?category=shoes" },
                  { label: "Accessories", href: "/products?category=accessories" },
                ]}
              />

              <MenuItem 
                href="/products?sale=true" 
                label="Sale" 
                icon={Tag}
                badge="50% Off"
                delay={0.45} 
                onClick={onClose}
              />

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-6 py-6 border-t border-neutral-200 mt-4"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:bg-black hover:text-white hover:border-black transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:bg-black hover:text-white hover:border-black transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:bg-black hover:text-white hover:border-black transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Sticky Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border-t border-neutral-200 bg-neutral-50 px-6 py-4"
            >
              <div className="space-y-2">
                <Link
                  href="/help"
                  onClick={onClose}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Link>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
                >
                  <Info className="w-4 h-4" />
                  About Strevo
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
