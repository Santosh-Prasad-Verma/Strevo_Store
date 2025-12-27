"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [form, setForm] = useState({ discount_id: "", count: "10", prefix: "COUPON" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const { data: c } = await supabase.from("coupons").select("*, discounts(code, type, value)").order("created_at", { ascending: false }).limit(100);
    const { data: d } = await supabase.from("discounts").select("*").eq("is_active", true);
    setCoupons(c || []);
    setDiscounts(d || []);
  };

  const generateCoupons = async () => {
    const supabase = createClient();
    await supabase.rpc("generate_bulk_coupons", {
      discount_id: form.discount_id,
      count: parseInt(form.count),
      prefix: form.prefix,
    });
    loadData();
  };

  const exportCoupons = () => {
    const csv = "Code,Discount,Type,Value,Used\n" + 
      coupons.map(c => `${c.code},${c.discounts?.code},${c.discounts?.type},${c.discounts?.value},${c.used_at ? 'Yes' : 'No'}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coupons.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Coupon Generator</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Bulk Coupons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Discount</Label>
              <Select value={form.discount_id} onValueChange={(v) => setForm({ ...form, discount_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount" />
                </SelectTrigger>
                <SelectContent>
                  {discounts.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Count</Label>
              <Input type="number" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} />
            </div>
            <div>
              <Label>Prefix</Label>
              <Input value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateCoupons}>Generate</Button>
            <Button variant="outline" onClick={exportCoupons}>Export CSV</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Discount</th>
                <th className="text-left p-2">Type</th>
                <th className="text-right p-2">Value</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Used At</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2 font-mono text-sm">{c.code}</td>
                  <td className="p-2">{c.discounts?.code}</td>
                  <td className="p-2 capitalize">{c.discounts?.type}</td>
                  <td className="text-right p-2">
                    {c.discounts?.type === 'percentage' ? `${c.discounts?.value}%` : `₹${c.discounts?.value}`}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${c.used_at ? 'bg-gray-100' : 'bg-green-100 text-green-800'}`}>
                      {c.used_at ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="p-2">{c.used_at ? new Date(c.used_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
