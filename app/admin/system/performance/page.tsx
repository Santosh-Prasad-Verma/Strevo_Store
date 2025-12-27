"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformancePage() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_performance_stats");
    setStats(data || []);
  };

  const avgResponseTime = stats.length > 0
    ? stats.reduce((sum, s) => sum + parseFloat(s.avg_response_time || 0), 0) / stats.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Performance Monitor</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.reduce((sum, s) => sum + parseInt(s.request_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Endpoints Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Response Times (Last 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Endpoint</th>
                <th className="text-right p-2">Avg (ms)</th>
                <th className="text-right p-2">Min (ms)</th>
                <th className="text-right p-2">Max (ms)</th>
                <th className="text-right p-2">Requests</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 font-mono text-sm">{stat.endpoint}</td>
                  <td className="text-right p-2">{parseFloat(stat.avg_response_time).toFixed(0)}</td>
                  <td className="text-right p-2">{stat.min_response_time}</td>
                  <td className="text-right p-2">{stat.max_response_time}</td>
                  <td className="text-right p-2">{stat.request_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
