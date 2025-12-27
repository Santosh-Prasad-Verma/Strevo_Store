"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isAuthRoute = pathname?.startsWith('/auth')
  const isHomePage = pathname === '/'

  // No layout for admin and auth routes
  if (isAdminRoute || isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className={`flex-1 pb-20 md:pb-0 ${isHomePage ? '' : 'pt-16'}`}>{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
