"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_id: "", role: "viewer" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const { data: r } = await supabase.from("admin_roles").select("*, profiles(email)");
    const { data: u } = await supabase.from("profiles").select("id, email").eq("is_admin", true);
    setRoles(r || []);
    setUsers(u || []);
  };

  const assignRole = async () => {
    const supabase = createClient();
    await supabase.from("admin_roles").insert(form);
    setShowForm(false);
    setForm({ user_id: "", role: "viewer" });
    loadData();
  };

  const removeRole = async (id: string) => {
    const supabase = createClient();
    await supabase.from("admin_roles").delete().eq("id", id);
    loadData();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Roles</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Assign Role"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Admin Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User</Label>
              <Select value={form.user_id} onValueChange={(v) => setForm({ ...form, user_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={assignRole}>Assign</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Assigned</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b">
                  <td className="p-2">{role.profiles?.email}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      role.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                      role.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100'
                    }`}>
                      {role.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-2">{new Date(role.created_at).toLocaleDateString()}</td>
                  <td className="text-right p-2">
                    <Button size="sm" variant="destructive" onClick={() => removeRole(role.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
