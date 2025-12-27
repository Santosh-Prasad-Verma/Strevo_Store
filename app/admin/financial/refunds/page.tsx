"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("refunds")
      .select("*, orders(id, total_amount)")
      .order("created_at", { ascending: false });

    setRefunds(data || []);
    setLoading(false);
  };

  const processRefund = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.rpc("process_refund", { refund_id: id, new_status: status });
    loadRefunds();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Refund Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-left p-2">Reason</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund.id} className="border-b">
                    <td className="p-2 font-mono text-sm">{refund.order_id.slice(0, 8)}</td>
                    <td className="text-right p-2">₹{parseFloat(refund.amount).toFixed(2)}</td>
                    <td className="p-2">{refund.reason || "-"}</td>
                    <td className="p-2">
                      <Badge className={statusColor(refund.status)}>{refund.status}</Badge>
                    </td>
                    <td className="p-2">{new Date(refund.created_at).toLocaleDateString()}</td>
                    <td className="text-right p-2 space-x-2">
                      {refund.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => processRefund(refund.id, "completed")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => processRefund(refund.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
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
