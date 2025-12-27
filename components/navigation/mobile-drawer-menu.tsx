"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, User, ShoppingBag, LogIn, UserPlus } from "lucide-react"
import { MENU_DATA } from "@/lib/data/menu-data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface MobileDrawerMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawerMenu({ isOpen, onClose }: MobileDrawerMenuProps) {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      fetch('/api/auth/check').then(r => r.json()).then(d => setUser(d.user)).catch(() => {})
      fetch('/api/cart/count').then(r => r.json()).then(d => setCartCount(d.count || 0)).catch(() => {})
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.body.style.overflow = "auto"
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-all duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-0 w-full h-full bg-white z-50 transition-all duration-500 ease-in-out md:hidden overflow-y-auto flex flex-col",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-black to-neutral-800 text-white">
          <h2 className="text-lg font-bold uppercase tracking-wider">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:rotate-90"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={cn(
          "transition-all duration-300 delay-100",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}>
          {user ? (
            <Link href="/profile" onClick={onClose} className="flex items-center gap-3 p-4 border-b hover:bg-neutral-50 transition-all duration-200 hover:pl-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-neutral-700 text-white flex items-center justify-center font-bold shadow-lg ring-2 ring-neutral-200">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user.email?.split('@')[0]}</p>
                <p className="text-xs text-muted-foreground">View Profile</p>
              </div>
            </Link>
          ) : (
            <div className="flex gap-2 p-4 border-b">
              <Link href="/auth/login" onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-black hover:bg-black hover:text-white transition-all duration-200 hover:scale-105">
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Login</span>
              </Link>
              <Link href="/auth/sign-up" onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white hover:bg-neutral-800 transition-all duration-200 hover:scale-105">
                <UserPlus className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Up</span>
              </Link>
            </div>
          )}
        </div>



        <div className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0 delay-200" : "opacity-0 -translate-y-4"
        )}>
          <Accordion type="single" collapsible className="p-4">
            {Object.entries(MENU_DATA).map(([key, data]) => (
              <AccordionItem key={key} value={key} className="border-b">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider hover:no-underline py-3">
                  {data.label}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                    {data.categories.map((cat, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                          {cat.title}
                        </h4>
                        <ul className="space-y-2 pl-2">
                          {cat.items.map((item, i) => (
                            <li key={i}>
                              <Link
                                href={`/products?category=${encodeURIComponent(item)}`}
                                className="text-sm text-foreground hover:text-primary transition-all duration-200 block py-1 hover:translate-x-2 hover:font-medium"
                                onClick={onClose}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="border-t p-4 bg-neutral-50">
          <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
            <Image
              src="/Strevo_store_logo.jpg"
              alt="Strevo Store"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">© 2024 Strevo Store. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}
