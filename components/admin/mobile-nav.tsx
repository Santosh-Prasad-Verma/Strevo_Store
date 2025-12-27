"use client";

import Link from "next/link";
import { Home, Package, Users, Settings, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/mobile", icon: Home, label: "Home" },
    { href: "/admin/orders", icon: Package, label: "Orders" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/notifications", icon: Bell, label: "Alerts" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              pathname === href ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
