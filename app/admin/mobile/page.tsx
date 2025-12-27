"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MobileDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, pending: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    
    const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);
    const { data: pending } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");
    const { data: stock } = await supabase.rpc("check_low_stock");
    
    setRecentOrders(orders || []);
    setStats({
      orders: orders?.length || 0,
      revenue: orders?.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0,
      pending: pending?.length || 0,
      lowStock: stock?.length || 0,
    });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from("orders").update({ status }).eq("id", id);
    loadData();
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Mobile Admin</h1>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">₹{stats.revenue.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Orders</p>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1">
                <p className="font-semibold">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                <p className="text-xs text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <Badge className={order.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
                {order.status}
              </Badge>
              {order.status === 'pending' && (
                <Button size="sm" className="ml-2" onClick={() => updateOrderStatus(order.id, 'processing')}>
                  Process
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
