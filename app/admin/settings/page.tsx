"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    store_name: "",
    store_email: "",
    store_phone: "",
    gst_rate: "18",
    free_shipping_threshold: "500",
    cod_enabled: true,
    card_enabled: true,
    upi_enabled: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("system_settings").select("*");
    
    const settingsObj: any = {};
    data?.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    setSettings({ ...settings, ...settingsObj });
  };

  const saveSetting = async (category: string, key: string, value: any) => {
    const supabase = createClient();
    await supabase.rpc("set_setting", {
      setting_category: category,
      setting_key: key,
      setting_value: value,
    });
  };

  const handleSave = async () => {
    await saveSetting("store", "name", settings.store_name);
    await saveSetting("store", "email", settings.store_email);
    await saveSetting("store", "phone", settings.store_phone);
    await saveSetting("tax", "gst_rate", settings.gst_rate);
    await saveSetting("shipping", "free_threshold", settings.free_shipping_threshold);
    await saveSetting("payment", "cod_enabled", settings.cod_enabled);
    await saveSetting("payment", "card_enabled", settings.card_enabled);
    await saveSetting("payment", "upi_enabled", settings.upi_enabled);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input
              value={settings.store_name}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            />
          </div>
          <div>
            <Label>Store Email</Label>
            <Input
              type="email"
              value={settings.store_email}
              onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
            />
          </div>
          <div>
            <Label>Store Phone</Label>
            <Input
              value={settings.store_phone}
              onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>GST Rate (%)</Label>
            <Input
              type="number"
              value={settings.gst_rate}
              onChange={(e) => setSettings({ ...settings, gst_rate: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Free Shipping Threshold (₹)</Label>
            <Input
              type="number"
              value={settings.free_shipping_threshold}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Cash on Delivery</Label>
            <Switch
              checked={settings.cod_enabled}
              onCheckedChange={(v) => setSettings({ ...settings, cod_enabled: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Card Payments</Label>
            <Switch
              checked={settings.card_enabled}
              onCheckedChange={(v) => setSettings({ ...settings, card_enabled: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>UPI Payments</Label>
            <Switch
              checked={settings.upi_enabled}
              onCheckedChange={(v) => setSettings({ ...settings, upi_enabled: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save All Settings</Button>
    </div>
  );
}
