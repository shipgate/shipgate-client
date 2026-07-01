"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Loader2, MapPin, Package } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { getCourierShipments } from "@/lib/shipping-api"

export default function CourierDashboard() {
  const token = useAuthStore((state) => state.token)
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadShipments = async () => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const response = await getCourierShipments(token, 1, 50)
      const data = ((response as any).data || []) as any[]
      setShipments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load assigned shipments.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipments()
  }, [token])

  const stats = useMemo(() => {
    const total = shipments.length
    const inProgress = shipments.filter((item) => item.currentStatus === "OUT_FOR_DELIVERY").length
    const completed = shipments.filter((item) => item.currentStatus === "COMPLETED").length
    return [
      { label: "Assigned Deliveries", value: String(total), icon: Package, color: "bg-blue-100 text-blue-700" },
      { label: "In Progress", value: String(inProgress), icon: Clock, color: "bg-orange-100 text-orange-700" },
      { label: "Completed", value: String(completed), icon: CheckCircle2, color: "bg-green-100 text-green-700" },
      { label: "Warehouse", value: String(shipments.filter((item) => item.currentStatus === "ARRIVED_WAREHOUSE").length), icon: MapPin, color: "bg-purple-100 text-purple-700" },
    ]
  }, [shipments])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Courier Dashboard</h1>
        <p className="text-foreground/60">Manage your assigned deliveries</p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Assigned Deliveries</CardTitle>
          <CardDescription>Track the home delivery shipments assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-foreground/70">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading shipments...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          ) : shipments.length === 0 ? (
            <p className="text-sm text-foreground/60">No assigned deliveries yet.</p>
          ) : (
            <div className="space-y-3">
              {shipments.map((delivery) => (
                <div key={delivery.shipmentNumber} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{delivery.shipmentNumber}</p>
                      <p className="text-sm text-foreground/60">{delivery.customerId?.fullName || "Customer"}</p>
                    </div>
                    <Badge variant={delivery.currentStatus === "COMPLETED" ? "default" : "outline"}>
                      {delivery.currentStatus === "COMPLETED" ? "Completed" : delivery.currentStatus === "OUT_FOR_DELIVERY" ? "Out for delivery" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-foreground/60">
                    <MapPin className="w-4 h-4" />
                    {delivery.customerId?.address || "Customer address"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Action</CardTitle>
        </CardHeader>
        <CardContent>
          <a href="/courier/update-delivery" className="w-full p-3 bg-primary text-white rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors block">
            Update Delivery Status
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
