"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    min_purchase: "",
    max_uses: "",
    expires_at: "",
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("discounts").select("*").order("created_at", { ascending: false });
    setDiscounts(data || []);
  };

  const createDiscount = async () => {
    const supabase = createClient();
    await supabase.from("discounts").insert({
      ...form,
      value: parseFloat(form.value),
      min_purchase: form.min_purchase ? parseFloat(form.min_purchase) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
    });
    setShowForm(false);
    setForm({ code: "", type: "percentage", value: "", min_purchase: "", max_uses: "", expires_at: "" });
    loadDiscounts();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const supabase = createClient();
    await supabase.from("discounts").update({ is_active: !isActive }).eq("id", id);
    loadDiscounts();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Discount Manager</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Discount"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value</Label>
                <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
              <div>
                <Label>Min Purchase</Label>
                <Input type="number" value={form.min_purchase} onChange={(e) => setForm({ ...form, min_purchase: e.target.value })} />
              </div>
              <div>
                <Label>Max Uses</Label>
                <Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />
              </div>
              <div>
                <Label>Expires At</Label>
                <Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              </div>
            </div>
            <Button onClick={createDiscount}>Create</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Type</th>
                <th className="text-right p-2">Value</th>
                <th className="text-right p-2">Used</th>
                <th className="text-left p-2">Expires</th>
                <th className="text-left p-2">Status</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="p-2 font-mono">{d.code}</td>
                  <td className="p-2 capitalize">{d.type}</td>
                  <td className="text-right p-2">
                    {d.type === 'percentage' ? `${d.value}%` : `₹${d.value}`}
                  </td>
                  <td className="text-right p-2">{d.used_count}/{d.max_uses || '∞'}</td>
                  <td className="p-2">{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : 'Never'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${d.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                      {d.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(d.id, d.is_active)}>
                      {d.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
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
