"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<any[]>([]);

  useEffect(() => {
    loadCarts();
  }, []);

  const loadCarts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("abandoned_carts")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });
    setCarts(data || []);
  };

  const sendReminder = async (id: string) => {
    const supabase = createClient();
    await supabase.from("abandoned_carts").update({ email_sent: true }).eq("id", id);
    loadCarts();
  };

  const cartValue = (cart: any) => {
    const items = cart.cart_data?.items || [];
    return items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Abandoned Cart Recovery</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Abandoned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{carts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recovered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {carts.filter(c => c.recovered).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₹{carts.filter(c => !c.recovered).reduce((sum, c) => sum + cartValue(c), 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abandoned Carts</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Customer</th>
                <th className="text-right p-2">Items</th>
                <th className="text-right p-2">Value</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.id} className="border-b">
                  <td className="p-2">{cart.profiles?.email || 'Guest'}</td>
                  <td className="text-right p-2">{cart.cart_data?.items?.length || 0}</td>
                  <td className="text-right p-2">₹{cartValue(cart).toFixed(2)}</td>
                  <td className="p-2">{new Date(cart.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    {cart.recovered ? (
                      <Badge className="bg-green-500">Recovered</Badge>
                    ) : cart.email_sent ? (
                      <Badge className="bg-blue-500">Email Sent</Badge>
                    ) : (
                      <Badge className="bg-yellow-500">Pending</Badge>
                    )}
                  </td>
                  <td className="text-right p-2">
                    {!cart.recovered && !cart.email_sent && (
                      <Button size="sm" onClick={() => sendReminder(cart.id)}>
                        Send Reminder
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
