"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { MENU_DATA, type MenuKey } from "@/lib/data/menu-data"
import { cn } from "@/lib/utils"
import { CategoryLink } from "./category-link"

interface MegaMenuProps {
  category: MenuKey
  isOpen: boolean
  onClose: () => void
}

export function MegaMenu({ category, isOpen, onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const data = MENU_DATA[category]

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white shadow-xl z-40 overflow-y-auto",
        "animate-fade-in"
      )}
      role="menu"
      aria-label={`${data.label} menu`}
    >
      <div className="px-12 py-8">
        {data.categories.map((cat, idx) => (
          <div 
            key={idx}
            className="mb-8"
          >
            <h3 className="font-bold text-base uppercase tracking-wider mb-4 text-black">{cat.title}</h3>
            <ul className="space-y-3">
              {cat.items.map((item, i) => (
                <li key={i}>
                  <CategoryLink
                    target={{ 
                      category: category,
                      subcategory: item 
                    }}
                    source="mega-menu"
                    onClick={onClose}
                    className="text-base text-neutral-600 hover:text-black transition-colors flex items-center group"
                  >
                    <span>{item}</span>
                    <ChevronRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CategoryLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {/* View All Category */}
        <div className="mb-8 pt-4 border-t border-neutral-100">
          <CategoryLink
            target={{ category: category }}
            source="mega-menu"
            onClick={onClose}
            className="text-base font-semibold text-black hover:text-neutral-600 transition-colors flex items-center group"
          >
            <span>View All {data.label}</span>
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </CategoryLink>
        </div>
        
        {/* Promo Section */}
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <div className="relative w-full h-64 overflow-hidden rounded-lg mb-6 bg-neutral-50">
            <Image
              src={data.promoImg}
              alt={data.promoText}
              fill
              className="object-cover"
              sizes="384px"
              priority
            />
          </div>
          <p className="text-base font-bold mb-4 text-black">{data.promoText}</p>
          <CategoryLink
            target={{ 
              category: category,
              sort: data.promoLink.includes('sale') ? 'discount-desc' : 'newest'
            }}
            source="mega-menu"
            onClick={onClose}
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors w-full text-center rounded-none uppercase tracking-wider"
          >
            Shop Now
          </CategoryLink>
        </div>
      </div>
    </div>
  )
}
