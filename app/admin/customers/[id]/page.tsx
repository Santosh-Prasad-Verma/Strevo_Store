"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Ban, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<any>(null)
  const [note, setNote] = useState("")
  const [banReason, setBanReason] = useState("")

  useEffect(() => {
    fetch(`/api/admin/customers/${params.id}`)
      .then(r => r.json())
      .then(d => setCustomer(d))
  }, [params.id])

  const addNote = async () => {
    await fetch(`/api/admin/customers/${params.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    })
    setNote("")
    window.location.reload()
  }

  const toggleBan = async () => {
    await fetch(`/api/admin/customers/${params.id}/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ban: !customer?.profile?.is_banned, reason: banReason })
    })
    window.location.reload()
  }

  if (!customer) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <Link href="/admin/customers">
        <Button variant="ghost" className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      </Link>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{customer.profile?.full_name || 'N/A'}</h1>
              <p className="text-gray-500">{customer.profile?.email}</p>
              <Badge className="mt-2">{customer.stats?.segment?.toUpperCase()}</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹{customer.stats?.lifetime_value?.toFixed(2)}</div>
              <div className="text-sm text-gray-500">{customer.stats?.total_orders} orders</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2">
            {customer.recent_orders?.map((order: any) => (
              <div key={order.id} className="flex justify-between p-3 bg-gray-50 rounded">
                <span>{order.order_number}</span>
                <span>₹{order.total_amount}</span>
                <Badge>{order.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Notes</h3>
          <div className="space-y-3 mb-4">
            {customer.notes?.map((n: any) => (
              <div key={n.id} className="p-3 bg-gray-50 rounded">
                <p>{n.note}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <Textarea placeholder="Add note..." value={note} onChange={(e) => setNote(e.target.value)} />
          <Button onClick={addNote} className="mt-2">Add Note</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Actions</h3>
          {customer.profile?.is_banned ? (
            <Button onClick={toggleBan} variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />Unban Customer
            </Button>
          ) : (
            <div className="space-y-2">
              <Textarea placeholder="Ban reason..." value={banReason} onChange={(e) => setBanReason(e.target.value)} />
              <Button onClick={toggleBan} variant="destructive">
                <Ban className="mr-2 h-4 w-4" />Ban Customer
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}