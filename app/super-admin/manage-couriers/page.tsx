"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Mail, Phone, MapPin } from "lucide-react"

export default function ManageCouriers() {
  const [couriers, setCouriers] = useState([
    { id: 1, name: "Chukwu Okafor", email: "chukwu@example.com", phone: "08012345678", city: "Lagos", available: true },
    { id: 2, name: "Amara Eze", email: "amara@example.com", phone: "08087654321", city: "Abuja", available: true },
    { id: 3, name: "Tunde Adeyemi", email: "tunde@example.com", phone: "08098765432", city: "Lagos", available: false },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newCourier, setNewCourier] = useState({ name: "", email: "", phone: "", city: "Lagos" })

  const handleAddCourier = () => {
    if (newCourier.name && newCourier.email && newCourier.phone) {
      setCouriers([...couriers, { id: couriers.length + 1, ...newCourier, available: true }])
      setNewCourier({ name: "", email: "", phone: "", city: "Lagos" })
      setShowForm(false)
    }
  }

  const handleDeleteCourier = (id: number) => {
    setCouriers(couriers.filter((courier) => courier.id !== id))
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

      {/* Add Courier Form */}
      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Register New Courier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter courier name"
                  value={newCourier.name}
                  onChange={(e) => setNewCourier({ ...newCourier, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newCourier.email}
                  onChange={(e) => setNewCourier({ ...newCourier, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCourier.phone}
                  onChange={(e) => setNewCourier({ ...newCourier, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Assigned City</label>
                <select
                  value={newCourier.city}
                  onChange={(e) => setNewCourier({ ...newCourier, city: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                  <option>Ibadan</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleAddCourier}>
                  Register Courier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Couriers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Couriers ({couriers.length})</CardTitle>
          <CardDescription>Active and inactive delivery couriers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">City</th>
                  <th className="text-left py-3 px-4 font-semibold">Availability</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((courier) => (
                  <tr key={courier.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-semibold">{courier.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4" />
                        {courier.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Phone className="w-4 h-4" />
                        {courier.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {courier.city}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={courier.available ? "default" : "secondary"}>
                        {courier.available ? "Available" : "On Delivery"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCourier(courier.id)}
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
