"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/admin/data-table"
import { FilterBar } from "@/components/admin/filter-bar"
import { Button } from "@/components/ui/button"
import { Profile } from "@/lib/types/database"
import { Ban, CheckCircle } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), ...(search && { search }) })
    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users)
    setTotalPages(data.totalPages)
    setCurrentPage(page)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers(1)
  }, [])

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    await fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchUsers(currentPage)
  }

  const columns = [
    { key: "email", label: "Email" },
    { key: "full_name", label: "Name", render: (user: Profile) => user.full_name || "N/A" },
    {
      key: "created_at",
      label: "Joined",
      render: (user: Profile) => new Date(user.created_at).toLocaleDateString(),
    },
    {
      key: "is_active",
      label: "Status",
      render: (user: Profile) => (
        <span className={user.is_active ? "text-green-600" : "text-red-600"}>
          {user.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: Profile) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleToggleStatus(user.id, user.is_active)}
          className="rounded-none"
        >
          {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar searchValue={search} onSearchChange={(v) => { setSearch(v); fetchUsers(1) }} />
      <DataTable
        data={users}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchUsers}
        isLoading={isLoading}
      />
    </div>
  )
}
