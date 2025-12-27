"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("activity_logs")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs(data || []);
  };

  const actionColor = (action: string) => {
    switch (action) {
      case "INSERT": return "bg-green-500";
      case "UPDATE": return "bg-blue-500";
      case "DELETE": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Activity Log</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Action</th>
                <th className="text-left p-2">Resource</th>
                <th className="text-left p-2">IP Address</th>
                <th className="text-left p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-2">{log.profiles?.email || 'System'}</td>
                  <td className="p-2">
                    <Badge className={actionColor(log.action)}>{log.action}</Badge>
                  </td>
                  <td className="p-2">{log.resource}</td>
                  <td className="p-2 font-mono text-sm">{log.ip_address || '-'}</td>
                  <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
