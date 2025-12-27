"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminStores() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    hours: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/admin/stores", {
      method: "POST",
      body: JSON.stringify(form)
    })
    setForm({ name: "", address: "", city: "", state: "", pincode: "", phone: "", hours: "" })
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add Store Location</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <Input placeholder="Store Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
        </div>
        <Input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="Hours (e.g., 10 AM - 8 PM)" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
        <Button type="submit">Add Store</Button>
      </form>
    </div>
  )
}
