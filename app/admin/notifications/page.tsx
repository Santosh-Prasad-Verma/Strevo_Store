"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    
    const { data: notifs } = await supabase.rpc("get_unread_notifications");
    const { data: stock } = await supabase.rpc("check_low_stock");
    
    setNotifications(notifs || []);
    setLowStock(stock || []);
  };

  const markRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    loadData();
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "low_stock": return "bg-yellow-500";
      case "new_order": return "bg-green-500";
      case "failed_payment": return "bg-red-500";
      case "new_review": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Notifications & Alerts</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{lowStock.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {notifications.filter(n => n.type === 'new_review').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product</th>
                <th className="text-right p-2">Current Stock</th>
                <th className="text-right p-2">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{item.product_name}</td>
                  <td className="text-right p-2 text-red-600">{item.stock}</td>
                  <td className="text-right p-2">{item.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Badge className={typeColor(notif.type)}>{notif.type}</Badge>
                  <div>
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => markRead(notif.id)}>Mark Read</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
