"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Users, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Total Shipments", value: "2,543", icon: Package, color: "bg-blue-100 text-blue-700" },
    { label: "Active Customers", value: "487", icon: Users, color: "bg-green-100 text-green-700" },
    { label: "In Transit", value: "156", icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
    { label: "Issues", value: "12", icon: AlertCircle, color: "bg-red-100 text-red-700" },
  ]

  const recentShipments = [
    { id: "SHP-2024-001", customer: "John Doe", type: "Air", status: "in_transit", amount: "$1,080" },
    { id: "SHP-2024-002", customer: "Jane Smith", type: "Sea 20ft", status: "delivered", amount: "$5,400" },
    { id: "SHP-2024-003", customer: "Ahmed Hassan", type: "Air", status: "pending", amount: "$540" },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-foreground/60">Manage shipments, customers, and operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/60">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Latest shipments requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Tracking ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-primary">{shipment.id}</td>
                    <td className="py-3 px-4">{shipment.customer}</td>
                    <td className="py-3 px-4">{shipment.type}</td>
                    <td className="py-3 px-4">
                      <Badge variant={shipment.status === "delivered" ? "default" : "secondary"}>
                        {shipment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">{shipment.amount}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        View
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
