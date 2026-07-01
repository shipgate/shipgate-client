"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2, MapPin } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { getCourierShipments, markCourierShipmentCompleted, markCourierShipmentOutForDelivery } from "@/lib/shipping-api"

export default function CourierUpdateDelivery() {
  const token = useAuthStore((state) => state.token)
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<"OUT_FOR_DELIVERY" | "COMPLETED" | "">("")
  const [updateComplete, setUpdateComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [assignedDeliveries, setAssignedDeliveries] = useState<any[]>([])

  const loadDeliveries = async () => {
    if (!token) return
    setLoading(true)
    try {
      const response = await getCourierShipments(token, 1, 50)
      setAssignedDeliveries(((response as any).data || []) as any[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load deliveries.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeliveries()
  }, [token])

  const handleConfirm = async () => {
    if (!selectedDelivery || !token || !selectedStatus) return
    setLoading(true)
    setError("")
    setMessage("")
    try {
      if (selectedStatus === "OUT_FOR_DELIVERY") {
        await markCourierShipmentOutForDelivery(selectedDelivery, { location: "Warehouse" }, token)
      } else if (selectedStatus === "COMPLETED") {
        await markCourierShipmentCompleted(selectedDelivery, { location: "Customer Address" }, token)
      }
      setMessage("Delivery status updated successfully.")
      setUpdateComplete(true)
      await loadDeliveries()
      setSelectedStatus("")
      setSelectedDelivery(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Update Delivery Status</h1>
        <p className="text-foreground/60">Update status of assigned deliveries</p>
      </div>

      {selectedDelivery && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>{selectedDelivery}</CardTitle>
            <CardDescription>Update delivery status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {assignedDeliveries.filter((d) => d.shipmentNumber === selectedDelivery).map((delivery) => (
              <div key={delivery.shipmentNumber} className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-foreground/60">Customer</p>
                  <p className="font-semibold text-foreground">{delivery.customerId?.fullName || "Customer"}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60">Phone</p>
                  <p className="font-semibold text-foreground">{delivery.customerId?.phone || "—"}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-foreground/60">Address</p>
                  <p className="font-semibold text-foreground text-sm">{delivery.customerId?.address || "Customer address"}</p>
                </div>
              </div>
            ))}

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Delivery Status</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
                  { value: "COMPLETED", label: "Completed" },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedStatus === status.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{status.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button onClick={handleConfirm} disabled={!selectedStatus || loading} className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {updateComplete ? "Status Updated!" : "Confirm Status Update"}
              </Button>
            </div>

            {error ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
            {message ? <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</div> : null}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Deliveries</CardTitle>
          <CardDescription>Click on a delivery to update its status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-foreground/70">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading deliveries...
            </div>
          ) : assignedDeliveries.length === 0 ? (
            <p className="text-sm text-foreground/60">No deliveries assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {assignedDeliveries.map((delivery) => (
                <button
                  key={delivery.shipmentNumber}
                  onClick={() => setSelectedDelivery(delivery.shipmentNumber)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedDelivery === delivery.shipmentNumber ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{delivery.shipmentNumber}</p>
                        <Badge variant="outline">{delivery.currentStatus || "Pending"}</Badge>
                      </div>
                      <p className="text-sm text-foreground/60">{delivery.customerId?.fullName || "Customer"}</p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-foreground/60">
                        <MapPin className="w-4 h-4" />
                        {delivery.customerId?.address || "Customer address"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
