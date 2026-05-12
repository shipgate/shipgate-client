"use client"

import { useEffect, useState } from "react"
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
      fetchCustomers()
    }
  }, [token])

  const fetchCustomers = async () => {
    try {
      const data = await getUsers("customer", token!)
      setCustomers(data.users)
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
      fetchCustomers()
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
          <CardTitle>Customers ({customers.length})</CardTitle>
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
