"use client"

import { useEffect, useState } from "react"
import type { PaginationInfo } from "@/lib/auth-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { addCustomerByAdmin, getUsers, deleteUser } from "@/lib/auth-api"
import { ConfirmationDialog } from "@/components/confirm-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { AuthUser } from "@/store/auth"
import { Input } from "@/components/ui/input"

interface ConfirmDialogState {
  open: boolean
  id: string
  title: string
  message: string
  actionText: string
}

export default function ManageCustomers() {
  const { token } = useAuthStore()
  const [customers, setCustomers] = useState<AuthUser[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    id: "",
    title: "",
    message: "",
    actionText: "Delete customer",
  })

  useEffect(() => {
    if (token) {
      fetchCustomers(1)
    }
  }, [token])

  const fetchCustomers = async (page = 1) => {
    try {
      const data = await getUsers("customer", token!, page, pagination.limit)
      setCustomers(data.users || [])
      setPagination(data.pagination || { total: 0, page, limit: pagination.limit, pages: 0 })
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return

    setIsDeleting(true)
    try {
      await deleteUser(confirmDialog.id, token!)
      toast.success("Customer deleted successfully")
      fetchCustomers(pagination.page)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete customer")
    } finally {
      setIsDeleting(false)
      setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete customer" })
    }
  }

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsCreating(true)
    try {
      await addCustomerByAdmin(customerForm, token)
      toast.success("Customer created successfully")
      setCustomerForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      })
      fetchCustomers(1)
    } catch (err: any) {
      toast.error(err.message || "Failed to create customer")
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading customers..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Customers</h1>
          <p className="text-foreground/60">View and manage customer accounts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Customer</CardTitle>
          <CardDescription>Create a customer account from super-admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreateCustomer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full name"
                value={customerForm.fullName}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, fullName: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                placeholder="Phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
              <Input
                placeholder="Address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, address: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={customerForm.password}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={customerForm.confirmPassword}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Customer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers ({pagination.total || customers.length})</CardTitle>
          <CardDescription>All registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-semibold">{customer.fullName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Phone className="w-4 h-4" />
                        {customer.phone || "N/A"}
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
                            id: customer._id,
                            title: "Delete customer",
                            message: `Delete ${customer.fullName}? This cannot be undone.`,
                            actionText: "Delete customer",
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
            Page {pagination.page} of {pagination.pages} • {pagination.total} total customers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchCustomers(Math.max(1, pagination.page - 1))} disabled={pagination.page <= 1 || loading}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => fetchCustomers(Math.min(pagination.pages, pagination.page + 1))} disabled={pagination.page >= pagination.pages || loading}>
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
        onCancel={() => setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete customer" })}
      />
    </div>
  )
}
