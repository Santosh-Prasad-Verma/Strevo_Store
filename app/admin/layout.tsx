"use client";

import { useEffect } from "react";
import MobileNav from "@/components/admin/mobile-nav";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { requestNotificationPermission, subscribeToPushNotifications } from "@/lib/push-notifications";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    requestNotificationPermission();
    subscribeToPushNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNav />
      <div className="flex-1 pb-20 md:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
