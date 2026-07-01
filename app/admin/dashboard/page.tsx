"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Users, TrendingUp } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { getAdminShipments } from "@/lib/shipping-api"
import { getUsers } from "@/lib/auth-api"

interface ShipmentSummary {
  _id?: string
  shipmentNumber?: string
  id?: string
  customerId?: { fullName?: string } | null
  customer?: { fullName?: string } | null
  deliveryMethod?: string
  currentStatus?: string
  status?: string
  shippingCost?: number | string
  totalAmount?: number | string
  amount?: number | string
}

export default function AdminDashboard() {
  const token = useAuthStore((state) => state.token)
  const [shipments, setShipments] = useState<ShipmentSummary[]>([])
  const [customerCount, setCustomerCount] = useState(0)
  const [shipmentCount, setShipmentCount] = useState(0)
  const [inTransitCount, setInTransitCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return
      setLoading(true)
      setError("")

      try {
        const [shipmentsResponse, usersResponse] = await Promise.all([
          getAdminShipments(token, 1, 8),
          getUsers("customer", token, 1, 1000),
        ])

        const shipmentData = (((shipmentsResponse as any).data || []) as ShipmentSummary[])
        const shipmentTotal = (shipmentsResponse as any).pagination?.total ?? shipmentData.length
        const inTransit = shipmentData.filter((shipment) => {
          const status = String(shipment.currentStatus || shipment.status || "").toUpperCase()
          return ["IN_TRANSIT", "OUT_FOR_DELIVERY", "PENDING_DELIVERY", "ARRIVED_WAREHOUSE"].includes(status)
        }).length

        setShipments(shipmentData)
        setShipmentCount(shipmentTotal)
        setInTransitCount(inTransit)
        setCustomerCount(((usersResponse as any).users || []).length)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [token])

  const stats = [
    { label: "Total Shipments", value: shipmentCount.toString(), icon: Package, color: "bg-blue-100 text-blue-700" },
    { label: "Active Customers", value: customerCount.toString(), icon: Users, color: "bg-green-100 text-green-700" },
    { label: "In Transit", value: inTransitCount.toString(), icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
    // { label: "Issues", value: "0", icon: AlertCircle, color: "bg-red-100 text-red-700" },
  ]

  const formatStatusLabel = (status?: string) => {
    const normalized = (status || "PENDING").replace(/_/g, " ").toLowerCase()
    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  const formatAmount = (value?: number | string) => {
    if (value === null || value === undefined || value === "") return "—"
    const numericValue = typeof value === "number" ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return `₦${numericValue.toLocaleString()}`
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-foreground/60">Manage shipments, customers, and operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Latest shipments from the admin shipment feed</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Tracking ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-foreground/60">
                      Loading shipments...
                    </td>
                  </tr>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-foreground/60">
                      No shipments found.
                    </td>
                  </tr>
                ) : (
                  shipments.map((shipment) => (
                    <tr key={shipment.shipmentNumber || shipment.id || shipment._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-primary">{shipment.shipmentNumber || shipment.id}</td>
                      <td className="py-3 px-4">{shipment.customerId?.fullName || shipment.customer?.fullName || "Unknown"}</td>
                      <td className="py-3 px-4">{shipment.deliveryMethod || "N/A"}</td>
                      <td className="py-3 px-4">
                        <Badge variant={String(shipment.currentStatus || shipment.status || "").toUpperCase() === "COMPLETED" ? "default" : "secondary"}>
                          {formatStatusLabel(shipment.currentStatus || shipment.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">{formatAmount(shipment.shippingCost ?? shipment.totalAmount ?? shipment.amount)}</td>
                      <td className="py-3 px-4">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/shipments/${encodeURIComponent(shipment.shipmentNumber || shipment.id || "")}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
