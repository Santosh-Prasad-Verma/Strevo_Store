"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, User, Search } from "lucide-react"
import { NavItem } from "./nav-item"
import { MegaMenu } from "./mega-menu"
import { MobileMenu } from "@/components/mobile-menu"
import { Hamburger } from "@/components/mobile-menu/hamburger"
import { MENU_DATA, type MenuKey } from "@/lib/data/menu-data"
import { Badge } from "@/components/ui/badge"
import { AdvancedSearchBar } from "@/components/search/advanced-search-bar"
import { getCartCount } from "@/lib/actions/cart"
import { useAuth } from "@/components/providers/AuthProvider"

export function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useAuth()
  
  // Use dark text on non-home pages or when scrolled/menu active
  const useDarkText = !isHomePage || isScrolled || !!activeMenu

  useEffect(() => {
    const fetchCartCount = async () => {
      const count = await getCartCount()
      setCartCount(count)
    }
    fetchCartCount()
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', fetchCartCount)
    return () => window.removeEventListener('cartUpdated', fetchCartCount)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || activeMenu || !isHomePage ? 'bg-neutral-50/70 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative">
            {/* Top and bottom borders when on hero */}
            {!isScrolled && !activeMenu && isHomePage && (
              <>
                <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
              </>
            )}
            {/* Desktop Navigation - Left */}
            <div className="hidden md:flex items-center gap-8" role="menubar" suppressHydrationWarning>
              {Object.entries(MENU_DATA).map(([key, data]) => (
                <NavItem
                  key={key}
                  label={data.label}
                  category={key as MenuKey}
                  isActive={activeMenu === key}
                  onToggle={setActiveMenu}
                  useDarkText={useDarkText}
                />
              ))}
            </div>

            {/* Logo - Center on desktop, Left on mobile */}
            <Link href="/" className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/Strevo_store_logo.jpg"
                  alt="Strevo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className={`text-2xl font-bold uppercase tracking-tighter transition-colors ${
                isScrolled || !isHomePage ? 'text-black' : 'text-white'
              }`}>Strevo</span>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search - Desktop */}
              <div className="hidden lg:block">
                <AdvancedSearchBar useDarkText={useDarkText} />
              </div>

              {/* Search - Mobile Icon */}
              <Link
                href="/products"
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled || !isHomePage ? 'hover:bg-neutral-100' : 'hover:bg-white/10'
                }`}
                aria-label="Search"
              >
                <Search className={`h-5 w-5 transition-colors ${
                  isScrolled || !isHomePage ? 'text-black' : 'text-white'
                }`} />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={`p-2 rounded-lg transition-colors relative ${
                  isScrolled || !isHomePage ? 'hover:bg-neutral-100' : 'hover:bg-white/10'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`h-5 w-5 transition-colors ${
                  isScrolled || !isHomePage ? 'text-black' : 'text-white'
                }`} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={`p-2 rounded-lg transition-colors relative ${
                  isScrolled || !isHomePage ? 'hover:bg-neutral-100' : 'hover:bg-white/10'
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className={`h-5 w-5 transition-colors ${
                  isScrolled || !isHomePage ? 'text-black' : 'text-white'
                }`} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* User - Hidden on mobile */}
              <Link
                href="/profile"
                className={`hidden md:flex p-2 rounded-lg transition-colors ${
                  isScrolled || !isHomePage ? 'hover:bg-neutral-100' : 'hover:bg-white/10'
                }`}
                aria-label="Profile"
              >
                <User className={`h-5 w-5 transition-colors ${
                  isScrolled || !isHomePage ? 'text-black' : 'text-white'
                }`} />
              </Link>

              {/* Mobile Menu Button */}
              <Hamburger isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mega Menu */}
      <div
        onMouseLeave={() => setActiveMenu(null)}
      >
        {activeMenu && (
          <MegaMenu
            category={activeMenu}
            isOpen={true}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        user={user ? {
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture
        } : undefined}
        onLogout={signOut}
      />
    </>
  )
}
