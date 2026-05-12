"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getUsers, deleteUser, addCourier } from "@/lib/auth-api"
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

export default function ManageCouriers() {
  const { token } = useAuthStore()
  const [couriers, setCouriers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    id: "",
    title: "",
    message: "",
    actionText: "Delete courier",
  })

  const [newCourier, setNewCourier] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    courierLicense: "",
    vehicleType: "motorcycle",
  })

  useEffect(() => {
    if (token) {
      fetchCouriers()
    }
  }, [token])

  const fetchCouriers = async () => {
    try {
      const data = await getUsers("courier", token!)
      setCouriers(data.users)
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch couriers")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCourier.fullName || !newCourier.email || !newCourier.password || !newCourier.confirmPassword || !newCourier.courierLicense) {
      toast.error("Please fill in all required fields")
      return
    }
    if (newCourier.password !== newCourier.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setSubmitting(true)
    try {
      await addCourier({
        fullName: newCourier.fullName,
        email: newCourier.email,
        phone: newCourier.phone,
        address: newCourier.address,
        password: newCourier.password,
        confirmPassword: newCourier.confirmPassword,
        courierLicense: newCourier.courierLicense,
        vehicleType: newCourier.vehicleType,
      }, token!)
      toast.success("Courier added successfully")
      setNewCourier({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        courierLicense: "",
        vehicleType: "motorcycle",
      })
      setShowForm(false)
      fetchCouriers()
    } catch (err: any) {
      toast.error(err.message || "Failed to add courier")
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return

    setIsDeleting(true)
    try {
      await deleteUser(confirmDialog.id, token!)
      toast.success("Courier deleted successfully")
      fetchCouriers()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete courier")
    } finally {
      setIsDeleting(false)
      setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete courier" })
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading couriers..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Couriers</h1>
          <p className="text-foreground/60">Add, view, and manage delivery couriers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" /> Add Courier
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Register New Courier</CardTitle>
            <CardDescription>Fill in the details to create a new courier account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCourier} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={newCourier.fullName}
                    onChange={(e) => setNewCourier({ ...newCourier, fullName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={newCourier.email}
                    onChange={(e) => setNewCourier({ ...newCourier, email: e.target.value })}
                    placeholder="courier@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newCourier.phone}
                    onChange={(e) => setNewCourier({ ...newCourier, phone: e.target.value })}
                    placeholder="+234801234567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Courier License *</label>
                  <Input
                    value={newCourier.courierLicense}
                    onChange={(e) => setNewCourier({ ...newCourier, courierLicense: e.target.value })}
                    placeholder="DL123456789"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Vehicle Type</label>
                  <select
                    value={newCourier.vehicleType}
                    onChange={(e) => setNewCourier({ ...newCourier, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={newCourier.address}
                    onChange={(e) => setNewCourier({ ...newCourier, address: e.target.value })}
                    placeholder="123 Main St, Lagos, Nigeria"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Password *</label>
                  <Input
                    type="password"
                    value={newCourier.password}
                    onChange={(e) => setNewCourier({ ...newCourier, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input
                    type="password"
                    value={newCourier.confirmPassword}
                    onChange={(e) => setNewCourier({ ...newCourier, confirmPassword: e.target.value })}
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
                  {submitting ? "Registering..." : "Register Courier"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Couriers ({couriers.length})</CardTitle>
          <CardDescription>Active delivery couriers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((courier) => (
                  <tr key={courier._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-semibold">{courier.fullName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {courier.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {courier.phone || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {(courier as any).vehicleType || "N/A"}
                      </div>
                    </td>
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
                            id: courier._id,
                            title: "Delete courier",
                            message: `Delete ${courier.fullName}? This cannot be undone.`,
                            actionText: "Delete courier",
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
        onCancel={() => setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete courier" })}
      />
    </div>
  )
}
