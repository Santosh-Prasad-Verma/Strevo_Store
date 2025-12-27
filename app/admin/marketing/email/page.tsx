"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", content: "", segment: "" });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("email_campaigns").select("*").order("created_at", { ascending: false });
    setCampaigns(data || []);
  };

  const createCampaign = async () => {
    const supabase = createClient();
    await supabase.from("email_campaigns").insert(form);
    setShowForm(false);
    setForm({ name: "", subject: "", content: "", segment: "" });
    loadCampaigns();
  };

  const sendCampaign = async (id: string) => {
    const supabase = createClient();
    await supabase.rpc("send_email_campaign", { campaign_id: id });
    loadCampaigns();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Campaign"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div>
              <Label>Segment</Label>
              <Select value={form.segment} onValueChange={(v) => setForm({ ...form, segment: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Customers</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="high_value">High Value</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={createCampaign}>Create</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Subject</th>
                <th className="text-left p-2">Segment</th>
                <th className="text-right p-2">Sent</th>
                <th className="text-left p-2">Status</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.subject}</td>
                  <td className="p-2 capitalize">{c.segment || 'All'}</td>
                  <td className="text-right p-2">{c.sent_count}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${c.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="text-right p-2">
                    {c.status === 'draft' && (
                      <Button size="sm" onClick={() => sendCampaign(c.id)}>Send</Button>
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
