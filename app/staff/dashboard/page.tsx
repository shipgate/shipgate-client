"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { getAdminShipments } from "@/lib/shipping-api"

interface PendingUpdateItem {
  shipmentNumber: string
  status: string
  location: string
  time: string
}

export default function StaffDashboard() {
  const token = useAuthStore((state) => state.token)
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdateItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setPendingUpdates([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    getAdminShipments(token, 1, 10)
      .then((response) => {
        if (!active) return
        const shipmentData = Array.isArray((response as any).data) ? (response as any).data : []
        const nextUpdates = shipmentData
          .filter((shipment: any) => {
            const status = String(shipment.currentStatus || shipment.status || "").toUpperCase()
            return !["COMPLETED", "CANCELLED"].includes(status)
          })
          .slice(0, 5)
          .map((shipment: any) => ({
            shipmentNumber: shipment.shipmentNumber || shipment.id || shipment._id || "Unknown",
            status: shipment.currentStatus || shipment.status || "Pending",
            location: shipment.destination || shipment.origin || shipment.singleShipment?.supplierAddress || "Awaiting update",
            time: shipment.updatedAt || shipment.createdAt || "Recently updated",
          }))

        setPendingUpdates(nextUpdates)
      })
      .catch(() => {
        if (!active) return
        setPendingUpdates([])
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  const formatStatus = (status: string) =>
    status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  const formatTime = (value: string) => {
    if (!value) return "Recently updated"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    const diffHours = Math.max(1, Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60)))
    return `${diffHours}h ago`
  }

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
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))
            ) : pendingUpdates.length > 0 ? (
              pendingUpdates.map((update, i) => (
                <div key={i} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-primary font-semibold">{update.shipmentNumber}</span>
                    <Badge variant="outline">{formatStatus(update.status)}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">{update.location}</span>
                    <span className="text-foreground/50">{formatTime(update.time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-foreground/60">
                No pending shipment updates available right now.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}
