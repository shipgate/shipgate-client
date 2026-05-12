"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getUsers, deleteUser, addStaff } from "@/lib/auth-api"
import { ConfirmationDialog } from "@/components/confirm-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { AuthUser } from "@/store/auth"

interface ConfirmDialogState {
  open: boolean
  id: string
  title: string
  message: string
  actionText: string
}

export default function ManageStaff() {
  const { token } = useAuthStore()
  const [staff, setStaff] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    id: "",
    title: "",
    message: "",
    actionText: "Delete staff",
  })

  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    checkpoint: "",
    checkpointCode: "",
    department: "",
  })

  useEffect(() => {
    if (token) {
      fetchStaff()
    }
  }, [token])

  const fetchStaff = async () => {
    try {
      const data = await getUsers("staff", token!)
      setStaff(data.users)
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch staff")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStaff.fullName || !newStaff.email || !newStaff.password || !newStaff.confirmPassword || !newStaff.checkpoint || !newStaff.checkpointCode) {
      toast.error("Please fill in all required fields")
      return
    }
    if (newStaff.password !== newStaff.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setSubmitting(true)
    try {
      await addStaff({
        fullName: newStaff.fullName,
        email: newStaff.email,
        phone: newStaff.phone,
        address: newStaff.address,
        password: newStaff.password,
        confirmPassword: newStaff.confirmPassword,
        checkpoint: newStaff.checkpoint,
        checkpointCode: newStaff.checkpointCode,
        department: newStaff.department || undefined,
      }, token!)
      toast.success("Staff member added successfully")
      setNewStaff({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        checkpoint: "",
        checkpointCode: "",
        department: "",
      })
      setShowForm(false)
      fetchStaff()
    } catch (err: any) {
      toast.error(err.message || "Failed to add staff member")
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return

    setIsDeleting(true)
    try {
      await deleteUser(confirmDialog.id, token!)
      toast.success("Staff member deleted successfully")
      fetchStaff()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete staff member")
    } finally {
      setIsDeleting(false)
      setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete staff" })
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading staff..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Staff</h1>
          <p className="text-foreground/60">Add, view, and manage staff members</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Add New Staff Member</CardTitle>
            <CardDescription>Fill in the details to create a new staff account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={newStaff.fullName}
                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="staff@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="+234801234567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    placeholder="Sorting"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Checkpoint *</label>
                  <Input
                    value={newStaff.checkpoint}
                    onChange={(e) => setNewStaff({ ...newStaff, checkpoint: e.target.value })}
                    placeholder="Lagos Main Hub"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Checkpoint Code *</label>
                  <Input
                    value={newStaff.checkpointCode}
                    onChange={(e) => setNewStaff({ ...newStaff, checkpointCode: e.target.value })}
                    placeholder="LG001"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                  placeholder="123 Main St, Lagos, Nigeria"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Password *</label>
                  <Input
                    type="password"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input
                    type="password"
                    value={newStaff.confirmPassword}
                    onChange={(e) => setNewStaff({ ...newStaff, confirmPassword: e.target.value })}
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
                  {submitting ? "Adding..." : "Add Staff Member"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Staff Members ({staff.length})</CardTitle>
          <CardDescription>Active staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Checkpoint</th>
                  <th className="text-left py-3 px-4 font-semibold">Department</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-semibold">{member.fullName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {member.phone || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {(member as any).checkpoint || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">{(member as any).department || "N/A"}</td>
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
                            id: member._id,
                            title: "Delete staff member",
                            message: `Delete ${member.fullName}? This cannot be undone.`,
                            actionText: "Delete staff",
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

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.actionText}
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete staff" })}
      />
    </div>
  )
}