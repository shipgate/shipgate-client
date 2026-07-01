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
import { ConfirmationDialog } from "@/components/confirm-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { AuthUser } from "@/store/auth"
import type { PaginationInfo } from "@/lib/auth-api"

interface ConfirmDialogState {
  open: boolean
  id: string
  title: string
  message: string
  actionText: string
}

export default function ManageAdmins() {
  const { token } = useAuthStore()
  const [admins, setAdmins] = useState<AuthUser[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    id: "",
    title: "",
    message: "",
    actionText: "Delete admin",
  })

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
      fetchAdmins(1)
    }
  }, [token])

  const fetchAdmins = async (page = 1) => {
    try {
      const data = await getUsers("admin", token!, page, pagination.limit)
      setAdmins(data.users || [])
      setPagination(data.pagination || { total: 0, page, limit: pagination.limit, pages: 0 })
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
      await addAdmin(
        {
          fullName: newAdmin.fullName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          address: newAdmin.address,
          password: newAdmin.password,
          confirmPassword: newAdmin.confirmPassword,
          department: newAdmin.department || undefined,
        },
        token!
      )
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
      fetchAdmins(1)
    } catch (err: any) {
      toast.error(err.message || "Failed to add admin")
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return

    setIsDeleting(true)
    try {
      await deleteUser(confirmDialog.id, token!)
      toast.success("Admin deleted successfully")
      fetchAdmins(pagination.page)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin")
    } finally {
      setIsDeleting(false)
      setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete admin" })
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading admins..." />
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
          <CardTitle>Admins ({pagination.total || admins.length})</CardTitle>
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
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            id: admin._id,
                            title: "Delete admin",
                            message: `Delete ${admin.fullName}? This cannot be undone.`,
                            actionText: "Delete admin",
                          })
                        }
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

      {pagination.pages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} • {pagination.total} total admins
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchAdmins(Math.max(1, pagination.page - 1))} disabled={pagination.page <= 1 || loading}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => fetchAdmins(Math.min(pagination.pages, pagination.page + 1))} disabled={pagination.page >= pagination.pages || loading}>
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.actionText}
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete admin" })}
      />
    </div>
  )
}

