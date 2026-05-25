"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrackingTimeline } from "@/components/tracking/tracking-timeline"
import { TrackingMap } from "@/components/tracking/tracking-map"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { cancelShipment, getShipmentDetails, updateShipment } from "@/lib/shipping-api"
import { buildTimelineFromShipment, getStatusBadgeClass, formatStatusLabel } from "@/lib/shipment-helpers"

const defaultCosignee = {
  name: "",
  phone: "",
  email: "",
}

const defaultSingleShipment = {
  supplierName: "",
  supplierPhone: "",
  supplierEmail: "",
  supplierAddress: "",
}

export default function ShipmentDetailsPage() {
  const params = useParams()
  const shipmentNumber = params?.shipmentNumber as string
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("HOME_DELIVERY")
  const [cosignees, setCosignees] = useState<any[]>([defaultCosignee])
  const [singleShipment, setSingleShipment] = useState(defaultSingleShipment)
  const [cancelReason, setCancelReason] = useState("")

  const loadShipment = async () => {
    if (!shipmentNumber || !token) return
    setError("")
    setLoading(true)
    try {
      const response = await getShipmentDetails(shipmentNumber, token)
      const data = (response as any).data?.shipment || (response as any).data || response
      setShipment(data)
      const method = data?.deliveryMethod || "HOME_DELIVERY"
      setDeliveryMethod(method)
      setCosignees(Array.isArray(data?.cosignees) && data.cosignees.length > 0 ? data.cosignees : [defaultCosignee])
      setSingleShipment(data?.singleShipment || defaultSingleShipment)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load shipment details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipment()
  }, [shipmentNumber, token])

  const timelineEvents = useMemo(() => {
    return buildTimelineFromShipment(shipment)
  }, [shipment])

  const handleCosigneeChange = (index: number, field: string, value: string) => {
    setCosignees((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
    setError("")
    setMessage("")
  }

  const addCosignee = () => setCosignees((prev) => [...prev, { ...defaultCosignee }])
  const removeCosignee = (index: number) => setCosignees((prev) => prev.filter((_, idx) => idx !== index))

  const handleSingleShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSingleShipment((prev) => ({ ...prev, [name]: value }))
    setError("")
    setMessage("")
  }

  const handleUpdate = async () => {
    if (!token || !shipmentNumber) return
    setError("")
    setMessage("")
    setUpdateLoading(true)
    try {
      const payload: any = {
        deliveryMethod,
        cosignees: cosignees.filter((cosignee) => cosignee.name || cosignee.phone || cosignee.email),
      }
      if (shipment?.shipmentType === "SINGLE") {
        payload.singleShipment = singleShipment
      }
      await updateShipment(shipmentNumber, payload, token)
      setMessage("Shipment updated successfully.")
      loadShipment()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update shipment.")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!token || !shipmentNumber) return
    if (!cancelReason.trim()) {
      setError("Please provide a reason for cancellation.")
      return
    }
    setError("")
    setMessage("")
    setCancelLoading(true)
    try {
      await cancelShipment(shipmentNumber, cancelReason, token)
      setMessage("Shipment canceled successfully.")
      loadShipment()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel shipment.")
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusClass = (status: string) => getStatusBadgeClass(status)

  const priceLabel = shipment?.pricing?.basePrice ? `$${shipment.pricing.basePrice}` : shipment?.totalAmount ? String(shipment.totalAmount) : "Pending"

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shipment Details</h1>
          <p className="text-foreground/60 text-sm md:text-base">Review, update, or cancel your shipment.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/shipments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to shipments
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={loadShipment} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center text-foreground/70">Loading shipment details...</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      ) : !shipment ? (
        <Card>
          <CardContent className="p-6 text-foreground/70">Shipment not available.</CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 w-full">
                <div>
                  <CardTitle className="text-2xl">{shipment.shipmentNumber || shipment.trackingNumber}</CardTitle>
                  <CardDescription>{shipment.shipmentType ? `${shipment.shipmentType} • ${shipment.shipmentMethod}` : shipment.shipmentMethod}</CardDescription>
                </div>
                <div className="space-y-2 text-right">
                  <Badge className={getStatusClass(String(shipment.currentStatus || "Unknown"))}>
                    {formatStatusLabel(shipment.currentStatus || "Unknown")}
                  </Badge>
                  <p className="text-sm text-foreground/60">Created: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-foreground/60 text-sm">Delivery Method</p>
                  <p className="text-lg font-semibold text-foreground">{shipment.deliveryMethod || "N/A"}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-sm">Payment Status</p>
                  <p className="text-lg font-semibold text-foreground">{shipment.paymentStatus || shipment.currentStatus || "Pending"}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-sm">Price</p>
                  <p className="text-lg font-semibold text-primary">{priceLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Summary</CardTitle>
                <CardDescription>Core details for this booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shipment.shipmentType === "SINGLE" && shipment.singleShipment ? (
                  <div>
                    <p className="text-sm font-medium text-foreground">Supplier</p>
                    <p className="text-foreground">{shipment.singleShipment.supplierName || "N/A"}</p>
                    <p className="text-foreground/60 text-sm">{shipment.singleShipment.supplierAddress || "No address provided"}</p>
                  </div>
                ) : null}
                {shipment.parcels ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Parcels</p>
                    <div className="space-y-2">
                      {shipment.parcels.map((parcel: any, index: number) => (
                        <div key={index} className="rounded-lg border border-border p-3">
                          <p className="font-semibold text-foreground">{parcel.parcelId || `Parcel ${index + 1}`}</p>
                          <p className="text-foreground/60 text-sm">Weight: {parcel.weight || "N/A"} kg</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <p className="text-sm font-medium text-foreground">Items</p>
                  <div className="space-y-2">
                    {Array.isArray(shipment.items) ? (
                      shipment.items.map((item: any, index: number) => (
                        <div key={index} className="rounded-lg border border-border p-3">
                          <p className="font-semibold text-foreground">{item.description || `Item ${index + 1}`}</p>
                          <p className="text-foreground/60 text-sm">
                            Qty: {item.quantity || 1} • Weight: {item.weight || "N/A"} kg • Value: ${item.value || 0}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-foreground/60">No item details available.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking</CardTitle>
                <CardDescription>Live shipment progress</CardDescription>
              </CardHeader>
              <CardContent>
                <TrackingMap
                  origin={shipment.singleShipment?.supplierAddress || shipment.origin || "Source"}
                  destination={shipment.deliveryMethod === "HOME_DELIVERY" ? "Customer address" : "Warehouse pickup"}
                  status={shipment.status || "pending"}
                  shipmentMethod={shipment.shipmentMethod}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Update Shipment</CardTitle>
              <CardDescription>Edit delivery options before the shipment is confirmed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Delivery Method</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="HOME_DELIVERY">Home Delivery</option>
                    <option value="WAREHOUSE_PICKUP">Warehouse Pickup</option>
                  </select>
                </div>
              </div>

              {shipment.shipmentType === "SINGLE" ? (
                <div className="space-y-4 rounded-2xl border border-border p-4">
                  <p className="text-sm font-medium text-foreground">Supplier Info</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="supplierName"
                      value={singleShipment.supplierName}
                      onChange={handleSingleShipmentChange}
                      placeholder="Supplier name"
                    />
                    <Input
                      name="supplierPhone"
                      value={singleShipment.supplierPhone}
                      onChange={handleSingleShipmentChange}
                      placeholder="Supplier phone"
                    />
                    <Input
                      name="supplierEmail"
                      value={singleShipment.supplierEmail}
                      onChange={handleSingleShipmentChange}
                      placeholder="Supplier email"
                    />
                    <Input
                      name="supplierAddress"
                      value={singleShipment.supplierAddress}
                      onChange={handleSingleShipmentChange}
                      placeholder="Supplier address"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-4 rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">Cosignees</p>
                  <Button variant="outline" size="sm" onClick={addCosignee}>
                    Add Cosignee
                  </Button>
                </div>
                {cosignees.map((cosignee, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <Input
                      placeholder="Name"
                      value={cosignee.name}
                      onChange={(e) => handleCosigneeChange(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Phone"
                      value={cosignee.phone}
                      onChange={(e) => handleCosigneeChange(index, "phone", e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Email"
                        value={cosignee.email}
                        onChange={(e) => handleCosigneeChange(index, "email", e.target.value)}
                      />
                      {cosignees.length > 1 ? (
                        <Button variant="outline" size="sm" onClick={() => removeCosignee(index)}>
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {message ? <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">{message}</div> : null}
              <div className="flex flex-col md:flex-row items-center gap-3">
                <Button onClick={handleUpdate} disabled={updateLoading}>
                  {updateLoading ? "Updating..." : "Save Changes"}
                </Button>
                <div className="flex-1 text-sm text-foreground/60">
                  Updates are only available before the shipment is confirmed.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancel Shipment</CardTitle>
              <CardDescription>Submit a reason to cancel this shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Reason for cancellation</label>
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter your cancellation reason"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleCancel} disabled={cancelLoading}>
                  {cancelLoading ? "Canceling..." : "Cancel Shipment"}
                </Button>
                {error ? (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipment Timeline</CardTitle>
              <CardDescription>Follow the shipment progress step-by-step</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineEvents.length > 0 ? (
                <TrackingTimeline events={timelineEvents} />
              ) : (
                <div className="rounded-lg border border-border p-6 text-foreground/70">
                  No tracking history is available for this shipment yet.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
