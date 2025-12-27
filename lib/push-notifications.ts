export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendPushNotification(title: string, body: string, data?: any) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  
  new Notification(title, {
    body,
    icon: "/icon.png",
    badge: "/badge.png",
    data,
  });
}

export function subscribeToPushNotifications() {
  if (typeof window === "undefined") return;
  
  const supabase = createClient();
  
  supabase
    .channel("admin-notifications")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
      const notif = payload.new as any;
      sendPushNotification(notif.title, notif.message, notif.data);
    })
    .subscribe();
}

import { createClient } from "@/lib/supabase/client";
