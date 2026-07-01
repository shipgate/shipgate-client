"use client"

import { useEffect, useState } from "react"
import type { PaginationInfo } from "@/lib/auth-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getUsers, deleteUser } from "@/lib/auth-api"
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

export default function ManageCustomers() {
  const { token } = useAuthStore()
  const [customers, setCustomers] = useState<AuthUser[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
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
