"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState("all")

  useEffect(() => {
    fetch(`/api/admin/customers?segment=${segment}`)
      .then(r => r.json())
      .then(d => setCustomers(d.customers || []))
  }, [segment])

  const exportCSV = () => {
    const csv = ["Name,Email,Segment,Orders,Value,Status", ...customers.map(c => 
      `${c.full_name},${c.email},${c.segment},${c.total_orders},${c.lifetime_value},${c.is_banned ? 'Banned' : 'Active'}`
    )].join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customers.csv'
    a.click()
  }

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={exportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />Export
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={segment} onValueChange={setSegment}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="high_value">High Value</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-4">Customer</th>
              <th className="p-4">Segment</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Value</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{c.full_name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{c.email}</div>
                </td>
                <td className="p-4">
                  <Badge className={c.segment === 'vip' ? 'bg-purple-100' : 'bg-blue-100'}>
                    {c.segment?.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4">{c.total_orders || 0}</td>
                <td className="p-4">₹{c.lifetime_value?.toFixed(2) || '0.00'}</td>
                <td className="p-4">
                  {c.is_banned ? <Badge variant="destructive">Banned</Badge> : <Badge variant="outline">Active</Badge>}
                </td>
                <td className="p-4">
                  <Link href={`/admin/customers/${c.id}`}>
                    <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}