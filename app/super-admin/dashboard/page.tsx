"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Users, Package, Truck, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/auth";

export default function SuperAdminDashboard() {
  const stats = [
    { label: "Total Admins", value: "5", icon: Users, color: "bg-blue-500" },
    { label: "Active Shipments", value: "2,450", icon: Package, color: "bg-green-500" },
    { label: "Couriers", value: "120", icon: Truck, color: "bg-orange-500" },
    { label: "System Issues", value: "3", icon: AlertCircle, color: "bg-red-500" },
  ]
  const {user} = useAuthStore()

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    address: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome {user?.fullName.split(" ")[0]}</h1>
        <p className="text-foreground/60">Full platform control and configuration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Management Sections */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>Configure and manage all platform aspects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Manage Admins & Staff</h3>
              <p className="text-sm text-foreground/60 mb-4">Create, edit, and manage admin accounts and staff</p>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Create Admin
              </Button>
            </div>
            <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Manage Couriers</h3>
              <p className="text-sm text-foreground/60 mb-4">Manage delivery agents and assign shipments</p>
              <Button variant="outline" size="sm">
                Manage Couriers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "New admin created", user: "John Doe", time: "2 hours ago" },
              { action: "Pricing updated", details: "Sea freight rates", time: "5 hours ago" },
              { action: "50 new couriers assigned", location: "Lagos Hub", time: "1 day ago" },
              { action: "Hub configuration updated", location: "Shanghai", time: "2 days ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-foreground/60">{activity.user || activity.details || activity.location}</p>
                </div>
                <span className="text-xs text-foreground/50">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
