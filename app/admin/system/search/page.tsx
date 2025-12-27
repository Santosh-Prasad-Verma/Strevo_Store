"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchAnalyticsPage() {
  const [popular, setPopular] = useState<any[]>([]);
  const [noResults, setNoResults] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const { data: p } = await supabase.rpc("get_popular_searches", { limit_count: 20 });
    const { data: n } = await supabase.rpc("get_no_results_searches");
    setPopular(p || []);
    setNoResults(n || []);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Search Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Query</th>
                  <th className="text-right p-2">Searches</th>
                  <th className="text-right p-2">Avg Results</th>
                </tr>
              </thead>
              <tbody>
                {popular.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{item.query}</td>
                    <td className="text-right p-2">{item.search_count}</td>
                    <td className="text-right p-2">{parseFloat(item.avg_results).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Results Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Query</th>
                  <th className="text-right p-2">Attempts</th>
                  <th className="text-left p-2">Last Search</th>
                </tr>
              </thead>
              <tbody>
                {noResults.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{item.query}</td>
                    <td className="text-right p-2">{item.search_count}</td>
                    <td className="p-2">{new Date(item.last_searched).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
