"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/admin/data-table"
import { FilterBar } from "@/components/admin/filter-bar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Vendor } from "@/lib/types/admin"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const fetchVendors = async (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), ...(status !== "all" && { status }) })
    const res = await fetch(`/api/admin/vendors?${params}`)
    const data = await res.json()
    setVendors(data.vendors)
    setTotalPages(data.totalPages)
    setCurrentPage(page)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchVendors(1)
  }, [])

  const handleStatusChange = async (vendorId: string, newStatus: string) => {
    await fetch(`/api/admin/vendors/${vendorId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchVendors(currentPage)
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (vendor: Vendor) => <Badge className="rounded-none">{vendor.status}</Badge>,
    },
    { key: "total_orders", label: "Orders" },
    {
      key: "total_revenue",
      label: "Revenue",
      render: (vendor: Vendor) => `$${vendor.total_revenue.toFixed(2)}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (vendor: Vendor) => (
        <Select value={vendor.status} onValueChange={(v) => handleStatusChange(vendor.id, v)}>
          <SelectTrigger className="w-[140px] rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue=""
        onSearchChange={() => {}}
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (v) => { setStatus(v); fetchVendors(1) },
            options: [
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
      />
      <DataTable
        data={vendors}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchVendors}
        isLoading={isLoading}
      />
    </div>
  )
}
