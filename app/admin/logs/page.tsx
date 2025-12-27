"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/admin/data-table"
import { FilterBar } from "@/components/admin/filter-bar"
import { AuditLog } from "@/lib/types/admin"

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [entityType, setEntityType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const fetchLogs = async (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      ...(entityType !== "all" && { entityType }),
    })
    const res = await fetch(`/api/admin/logs?${params}`)
    const data = await res.json()
    setLogs(data.logs)
    setTotalPages(data.totalPages)
    setCurrentPage(page)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchLogs(1)
  }, [])

  const columns = [
    { key: "admin_email", label: "Admin" },
    { key: "action", label: "Action" },
    { key: "entity_type", label: "Entity" },
    { key: "entity_id", label: "Entity ID", render: (log: AuditLog) => log.entity_id?.slice(0, 8) || "N/A" },
    {
      key: "created_at",
      label: "Timestamp",
      render: (log: AuditLog) => new Date(log.created_at).toLocaleString(),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue=""
        onSearchChange={() => {}}
        filters={[
          {
            key: "entityType",
            label: "Entity Type",
            value: entityType,
            onChange: (v) => { setEntityType(v); fetchLogs(1) },
            options: [
              { value: "all", label: "All" },
              { value: "order", label: "Orders" },
              { value: "product", label: "Products" },
              { value: "user", label: "Users" },
              { value: "vendor", label: "Vendors" },
            ],
          },
        ]}
      />
      <DataTable
        data={logs}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchLogs}
        isLoading={isLoading}
      />
    </div>
  )
}
