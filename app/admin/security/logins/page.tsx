"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginHistoryPage() {
  const [logins, setLogins] = useState<any[]>([]);

  useEffect(() => {
    loadLogins();
  }, []);

  const loadLogins = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("login_history")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogins(data || []);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Login History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Logins</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">IP Address</th>
                <th className="text-left p-2">User Agent</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((login) => (
                <tr key={login.id} className="border-b">
                  <td className="p-2">{login.profiles?.email}</td>
                  <td className="p-2 font-mono text-sm">{login.ip_address}</td>
                  <td className="p-2 text-sm max-w-xs truncate">{login.user_agent}</td>
                  <td className="p-2">
                    <Badge className={login.success ? "bg-green-500" : "bg-red-500"}>
                      {login.success ? "Success" : "Failed"}
                    </Badge>
                  </td>
                  <td className="p-2">{new Date(login.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
