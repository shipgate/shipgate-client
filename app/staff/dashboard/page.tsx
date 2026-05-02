"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function StaffDashboard() {
  const stats = [
    { label: "Today's Updates", value: "24", icon: Package, color: "bg-blue-100 text-blue-700" },
    { label: "Pending Updates", value: "8", icon: Clock, color: "bg-orange-100 text-orange-700" },
    { label: "Completed", value: "156", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
    { label: "Alerts", value: "3", icon: AlertCircle, color: "bg-red-100 text-red-700" },
  ]

  const pendingUpdates = [
    { trackingId: "SHP-2024-001", status: "In Airport Customs", location: "Shanghai", time: "2h ago" },
    { trackingId: "SHP-2024-005", status: "At Sea", location: "Atlantic Ocean", time: "6h ago" },
    { trackingId: "SHP-2024-009", status: "Port Departure", location: "Hong Kong", time: "12h ago" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Operations Staff Dashboard</h1>
        <p className="text-foreground/60">Update and track shipment progress</p>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div> */}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <a
              href="/staff/status-updates"
              className="flex-1 p-3 bg-primary text-white rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors"
            >
              Search & Track Shipments
            </a>
            <a
              href="/staff/status-updates"
              className="flex-1 p-3 bg-primary/10 text-primary rounded-lg text-center font-semibold hover:bg-primary/20 transition-colors"
            >
              Update Status
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Pending Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Status Updates</CardTitle>
          <CardDescription>Shipments awaiting next status update</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingUpdates.map((update, i) => (
              <div key={i} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-primary font-semibold">{update.trackingId}</span>
                  <Badge variant="outline">{update.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">{update.location}</span>
                  <span className="text-foreground/50">{update.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}
