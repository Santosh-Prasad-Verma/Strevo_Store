"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const supabase = createClient();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const { data } = await supabase.rpc("get_payment_stats", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

    setStats(data || []);
    setLoading(false);
  };

  const totalAmount = stats.reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0);
  const avgSuccessRate = stats.length > 0
    ? stats.reduce((sum, row) => sum + parseFloat(row.success_rate || 0), 0) / stats.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payment Gateway Stats</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Method</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-right p-2">Success</th>
                  <th className="text-right p-2">Failed</th>
                  <th className="text-right p-2">Success Rate</th>
                  <th className="text-right p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 capitalize">{row.payment_method}</td>
                    <td className="text-right p-2">{row.total_transactions}</td>
                    <td className="text-right p-2 text-green-600">{row.successful_transactions}</td>
                    <td className="text-right p-2 text-red-600">{row.failed_transactions}</td>
                    <td className="text-right p-2">{parseFloat(row.success_rate).toFixed(1)}%</td>
                    <td className="text-right p-2">₹{parseFloat(row.total_amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
