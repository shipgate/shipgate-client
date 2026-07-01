"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { assignCourierToShipment, getAdminShipments } from "@/lib/shipping-api"
import { getUsers } from "@/lib/auth-api"

interface CourierOption {
  _id: string
  fullName: string
  phone?: string
  email?: string
}

interface ShipmentOption {
  _id: string
  shipmentNumber: string
  deliveryMethod?: string
  currentStatus?: string
  assignedCourier?: { _id?: string; fullName?: string; email?: string; phone?: string } | null
  customerId?: { fullName?: string; email?: string; phone?: string } | null
  createdAt?: string
}

export default function AssignCouriers() {
  const token = useAuthStore((state) => state.token)
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null)
  const [assignmentComplete, setAssignmentComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [shipments, setShipments] = useState<ShipmentOption[]>([])
  const [couriers, setCouriers] = useState<CourierOption[]>([])

  const loadData = async () => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const [shipmentsResponse, couriersResponse] = await Promise.all([
        getAdminShipments(token, 1, 50, undefined, undefined,  undefined, undefined, "HOME_DELIVERY"),
        getUsers("courier", token, 1, 100),
      ])
      const shipmentData = ((shipmentsResponse as any).data || []) as ShipmentOption[]
      const courierData = ((couriersResponse as any).users || []) as CourierOption[]
      setShipments(shipmentData.filter((item) => item.deliveryMethod === "HOME_DELIVERY"))
      setCouriers(courierData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  const toggleShipment = (id: string) => {
    setSelectedShipments((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleAssign = async () => {
    if (!token || selectedShipments.length === 0 || !selectedCourier) return
    setError("")
    setMessage("")
    setLoading(true)
    try {
      await Promise.all(selectedShipments.map((shipmentNumber) => assignCourierToShipment(shipmentNumber, { courierId: selectedCourier }, token)))
      setMessage(`Assigned ${selectedShipments.length} shipment(s) successfully.`)
      setAssignmentComplete(true)
      setSelectedShipments([])
      setSelectedCourier(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to assign courier.")
    } finally {
      setLoading(false)
    }
  }

  const homeDeliveryShipments = useMemo(
    () =>
      shipments.filter((shipment) => shipment.deliveryMethod === "HOME_DELIVERY" && !shipment.assignedCourier?._id),
    [shipments],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assign Shipments to Couriers</h1>
        <p className="text-foreground/60">Select home delivery shipments and assign to a courier</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Courier</CardTitle>
          <CardDescription>Choose a courier to assign the selected shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={() => loadData()} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {couriers.map((courier) => (
              <button
                key={courier._id}
                onClick={() => setSelectedCourier(courier._id)}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  selectedCourier === courier._id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground">{courier.fullName}</p>
                <p className="text-sm text-foreground/60 mb-3">{courier.phone || courier.email}</p>
                <Badge variant="outline">Courier</Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Home Delivery Shipments at Warehouse</CardTitle>
          <CardDescription>Select shipments to assign to the selected courier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-foreground/70">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading shipments...
            </div>
          ) : null}
          {error ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
          {message ? <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</div> : null}
          <div className="space-y-3">
            {homeDeliveryShipments.map((shipment) => (
              <button
                key={shipment.shipmentNumber}
                onClick={() => toggleShipment(shipment.shipmentNumber)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedShipments.includes(shipment.shipmentNumber)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{shipment.shipmentNumber}</p>
                      <Badge variant="outline">{shipment.currentStatus || "ARRIVED_WAREHOUSE"}</Badge>
                    </div>
                    <p className="text-sm text-foreground/60">{shipment.customerId?.fullName || "Customer"}</p>
                    <p className="text-sm text-foreground/60 mt-1">{shipment.customerId?.phone || shipment.customerId?.email || "—"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleAssign}
              disabled={selectedShipments.length === 0 || !selectedCourier || loading}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Assign {selectedShipments.length > 0 ? `${selectedShipments.length} Shipment(s)` : "Shipments"} to Courier
            </Button>
            {(!selectedCourier || selectedShipments.length === 0) && (
              <p className="text-sm text-foreground/60 mt-2">
                {!selectedCourier && "Please select a courier"} {selectedShipments.length === 0 && "Please select shipments"}
              </p>
            )}
          </div>

          {assignmentComplete && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Shipments assigned successfully</p>
                <p className="text-sm text-green-800">Courier has been notified</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Courier Summary</CardTitle>
          <CardDescription>Home delivery shipments with their assigned courier and delivery progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground/70">
                  <th className="px-3 py-2 font-medium">Shipment</th>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Assigned courier</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shipments
                  .filter((shipment) => shipment.deliveryMethod === "HOME_DELIVERY")
                  .map((shipment) => (
                    <tr key={shipment.shipmentNumber} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-3 font-medium text-foreground">{shipment.shipmentNumber}</td>
                      <td className="px-3 py-3 text-foreground/70">{shipment.customerId?.fullName || "Customer"}</td>
                      <td className="px-3 py-3 text-foreground/70">{shipment.assignedCourier?.fullName || "Unassigned"}</td>
                      <td className="px-3 py-3">
                        <Badge variant={shipment.currentStatus === "COMPLETED" ? "default" : "outline"}>
                          {shipment.currentStatus === "COMPLETED" ? "Completed" : shipment.currentStatus === "OUT_FOR_DELIVERY" ? "Out for delivery" : "Pending"}
                        </Badge>
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
