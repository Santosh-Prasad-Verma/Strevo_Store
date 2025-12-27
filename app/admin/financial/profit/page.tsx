"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfitPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const { data: result } = await supabase.rpc("get_profit_report", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

    setData(result || []);
    setLoading(false);
  };

  const totalProfit = data.reduce((sum, row) => sum + parseFloat(row.profit || 0), 0);
  const totalRevenue = data.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profit Margins</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">₹{totalProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Profitability</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-right p-2">Units</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Cost</th>
                  <th className="text-right p-2">Profit</th>
                  <th className="text-right p-2">Margin</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{row.product_name}</td>
                    <td className="text-right p-2">{row.units_sold}</td>
                    <td className="text-right p-2">₹{parseFloat(row.revenue).toFixed(2)}</td>
                    <td className="text-right p-2">₹{parseFloat(row.cost).toFixed(2)}</td>
                    <td className="text-right p-2 text-green-600">₹{parseFloat(row.profit).toFixed(2)}</td>
                    <td className="text-right p-2">{parseFloat(row.margin_percent).toFixed(1)}%</td>
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
