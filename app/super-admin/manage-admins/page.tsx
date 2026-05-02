"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Mail } from "lucide-react"

/* ================= TYPES ================= */

type Admin = {
  id: string
  fullName: string
  email: string
  role: string
  status?: string
}

type GetAllUsersResponse = {
  users: Admin[]
}

type CreateAdminResponse = {
  user: Admin
}

type NewAdminPayload = {
  fullName: string
  email: string
  phoneNumber: string
  companyName: string
  address: string
  password: string
}

/* ================= COMPONENT ================= */

export default function ManageAdmins() {
  const {
    getAllUsers,
    createAdmin,
    deleteUser,
    isLoading,
  } = useAuthStore()

  const [admins, setAdmins] = useState<Admin[]>([])
  const [showForm, setShowForm] = useState(false)

  const [newAdmin, setNewAdmin] = useState<NewAdminPayload>({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    address: "",
    password: "",
  })

  /* ================= LOAD ADMINS ================= */

  useEffect(() => {
  const loadAdmins = async () => {
    try {
      const res = await getAllUsers()

      // Normalize response shape safely
      const users =
        Array.isArray(res) ? res :
        Array.isArray(res?.users) ? res.users :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.result?.users) ? res.result.users :
        []

      const adminsOnly = users.filter(
        (u: any) => u.role === "Admin" || u.role === "SuperAdmin"
      )

      setAdmins(adminsOnly)
    } catch (err) {
      console.error("Failed to load admins", err)
    }
  }

  loadAdmins()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


  /* ================= CREATE ADMIN ================= */

  const handleAddAdmin = async () => {
  try {
    const payload = {
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      phone: newAdmin.phoneNumber,        // ✅ FIX
      company: newAdmin.companyName,      // ✅ FIX
      address: newAdmin.address,
      password: newAdmin.password,
      role: "Admin",                      // ✅ ADD THIS
    }

    const data = await createAdmin(payload)

    if (data?.user) {
      setAdmins((prev) => [...prev, data.user])
    }
     alert("Admin created successfully")

    setShowForm(false)
    setNewAdmin({
      fullName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      address: "",
      password: "",
    })
  } catch (err:any) {
    console.error("Create admin failed", err)
    alert(err.message || "❌ Failed to create admin")

  }
}


  /* ================= DELETE ADMIN ================= */

  const handleDeleteAdmin = async (id: string) => {
    try {
      await deleteUser(id)
      setAdmins((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Admins</h1>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            {[
              ["Full Name", "fullName"],
              ["Email", "email"],
              ["Phone Number", "phoneNumber"],
              ["Company Name", "companyName"],
              ["Address", "address"],
            ].map(([label, key]) => (
              <input
                key={key}
                placeholder={label}
                value={(newAdmin as any)[key]}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, [key]: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            ))}

            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <Button onClick={handleAddAdmin} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Admin"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <table className="w-full">
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b last:border-none">
                  <td className="py-3">{admin.fullName}</td>
                  <td>
                    <Mail className="inline w-4 h-4 mr-2" />
                    {admin.email}
                  </td>
                  <td>{admin.role}</td>
                  <td>
                    <Badge>{admin.status ?? "active"}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteAdmin(admin.id)}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
