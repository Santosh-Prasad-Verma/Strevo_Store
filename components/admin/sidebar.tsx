"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Store, Settings, FileText, X, ChevronRight, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Store, label: "Vendors", href: "/admin/vendors" },
  { icon: FileText, label: "Reviews", href: "/admin/reviews" },
  { icon: FileText, label: "Logs", href: "/admin/logs" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ email: string; full_name?: string | null; avatar_url?: string | null } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', authUser.id)
          .single()
        
        setUser({
          email: authUser.email || '',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url
        })
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200" 
          onClick={onClose} 
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-black to-neutral-900 text-white transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 backdrop-blur-sm">
          <Link href="/admin" className="text-xl font-bold tracking-wider hover:text-neutral-300 transition-colors">
            THRIFT_IND
          </Link>
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:rotate-90"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden",
                  "hover:translate-x-1",
                  isActive 
                    ? "bg-white text-black shadow-lg" 
                    : "hover:bg-white/10 hover:shadow-md"
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
                }}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-medium flex-1">{item.label}</span>
                <ChevronRight className={cn(
                  "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200",
                  isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-100 group-hover:translate-x-0"
                )} />
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section - Fixed at bottom */}
        <div className="border-t border-white/10 p-4 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200 group">
            <Avatar className="w-9 h-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200">
              <AvatarImage src={user?.avatar_url || ""} />
              <AvatarFallback className="bg-white text-black text-sm font-semibold">
                {user?.full_name?.[0] || user?.email?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || "Admin"}</p>
              <p className="text-xs text-white/60 truncate">{user?.email || "admin@thrift.com"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  )
}
