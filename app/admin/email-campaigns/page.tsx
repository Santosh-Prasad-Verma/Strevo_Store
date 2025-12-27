"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function EmailCampaigns() {
  const [form, setForm] = useState({ name: "", subject: "", content: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/admin/email-campaigns", {
      method: "POST",
      body: JSON.stringify(form)
    })
    setForm({ name: "", subject: "", content: "" })
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Email Campaigns</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <Input
          placeholder="Campaign Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder="Email Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <Textarea
          placeholder="Email Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={10}
          required
        />
        <Button type="submit">Create Campaign</Button>
      </form>
    </div>
  )
}
