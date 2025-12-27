"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TaxPage() {
  const [taxRate, setTaxRate] = useState(18);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [taxRate]);

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const { data: result } = await supabase.rpc("get_tax_report", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      tax_rate: taxRate,
    });

    setData(result || []);
    setLoading(false);
  };

  const totalTax = data.reduce((sum, row) => sum + parseFloat(row.tax_collected || 0), 0);
  const totalGross = data.reduce((sum, row) => sum + parseFloat(row.gross_sales || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tax Reports</h1>
        <div className="w-32">
          <Label>GST Rate (%)</Label>
          <Input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Tax Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalTax.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gross Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalGross.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{(totalGross - totalTax).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Tax Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Gross Sales</th>
                  <th className="text-right p-2">Taxable Amount</th>
                  <th className="text-right p-2">Tax Collected</th>
                  <th className="text-right p-2">Net Sales</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{new Date(row.period_start).toLocaleDateString()}</td>
                    <td className="text-right p-2">₹{parseFloat(row.gross_sales).toFixed(2)}</td>
                    <td className="text-right p-2">₹{parseFloat(row.taxable_amount).toFixed(2)}</td>
                    <td className="text-right p-2">₹{parseFloat(row.tax_collected).toFixed(2)}</td>
                    <td className="text-right p-2">₹{parseFloat(row.net_sales).toFixed(2)}</td>
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
