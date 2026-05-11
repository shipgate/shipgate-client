"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getUsers, deleteUser, addAdmin } from "@/lib/auth-api"
import type { AuthUser } from "@/store/auth"

/* ================= COMPONENT ================= */

export default function ManageAdmins() {
  const { token } = useAuthStore()
  const [admins, setAdmins] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    department: "",
  })

  useEffect(() => {
    if (token) {
      fetchAdmins()
    }
  }, [token])

  const fetchAdmins = async () => {
    try {
      const data = await getUsers("admin", token!)
      setAdmins(data.users)
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch admins")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.password || !newAdmin.confirmPassword) {
      toast.error("Please fill in all required fields")
      return
    }
    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setSubmitting(true)
    try {
      await addAdmin({
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        phone: newAdmin.phone,
        address: newAdmin.address,
        password: newAdmin.password,
        confirmPassword: newAdmin.confirmPassword,
        department: newAdmin.department || undefined,
      }, token!)
      toast.success("Admin added successfully")
      setNewAdmin({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        department: "",
      })
      setShowForm(false)
      fetchAdmins()
    } catch (err: any) {
      toast.error(err.message || "Failed to add admin")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return

    try {
      await deleteUser(adminId, token!)
      toast.success("Admin deleted successfully")
      fetchAdmins()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Admins</h1>
          <p className="text-muted-foreground">Add, view, and manage admin users</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
            <CardDescription>Fill in the details to create a new admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={newAdmin.fullName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                    placeholder="+234801234567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                    placeholder="Operations"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={newAdmin.address}
                  onChange={(e) => setNewAdmin({ ...newAdmin, address: e.target.value })}
                  placeholder="123 Admin St, Lagos, Nigeria"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Password *</label>
                  <Input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Admin"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Admins ({admins.length})</CardTitle>
          <CardDescription>Active admin users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Department</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-semibold">{admin.fullName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">{admin.department || "N/A"}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">Active</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
