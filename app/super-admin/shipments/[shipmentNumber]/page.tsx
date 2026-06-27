"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrackingTimeline } from "@/components/tracking/tracking-timeline"
import { TrackingMap } from "@/components/tracking/tracking-map"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { assignShipmentPricing, getShipmentDetails, markPackageAsReceived } from "@/lib/shipping-api"
import { buildTimelineFromShipment, formatStatusLabel, getStatusBadgeClass } from "@/lib/shipment-helpers"

export default function SuperAdminShipmentDetailsPage() {
  const params = useParams()
  const shipmentNumber = params?.shipmentNumber as string
  const token = useAuthStore((state) => state.token)

  const [shipment, setShipment] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const [assignedPrice, setAssignedPrice] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [charges, setCharges] = useState([{ description: "", amount: "" }])
  const [receiveLocation, setReceiveLocation] = useState("")
  const [receiveNotes, setReceiveNotes] = useState("")
  const [selectedParcelIds, setSelectedParcelIds] = useState<string[]>([])

  const loadShipment = async () => {
    if (!shipmentNumber || !token) return
    setLoading(true)
    setError("")
    try {
      const response = await getShipmentDetails(shipmentNumber, token)
      const data = (response as any).data?.shipment || (response as any).data || response
      setShipment(data)
      setItems(Array.isArray((response as any).data?.items) ? (response as any).data.items : [])
      if (data?.pricing) {
        setAssignedPrice(data.pricing.basePrice ? String(data.pricing.basePrice) : "")
        setCurrency(data.pricing.currency || "USD")
      }
      if (data?.shipmentType === "CONSOLIDATION" && Array.isArray(data.parcels) && data.parcels.length > 0) {
        setSelectedParcelIds([])
      } else {
        setSelectedParcelIds([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load shipment details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipment()
  }, [shipmentNumber, token])

  const timelineEvents = useMemo(() => buildTimelineFromShipment(shipment), [shipment])
  const isConsolidation = shipment?.shipmentType === "CONSOLIDATION"

  const handleAddCharge = () => setCharges((prev) => [...prev, { description: "", amount: "" }])
  const handleChargeChange = (index: number, field: string, value: string) => {
    setCharges((prev) => prev.map((charge, idx) => (idx === index ? { ...charge, [field]: value } : charge)))
  }
  const removeCharge = (index: number) => setCharges((prev) => prev.filter((_, idx) => idx !== index))

  const handleAssignPrice = async () => {
    if (!token || !shipmentNumber) return
    setActionMessage("")
    try {
      const payload: any = { basePrice: Number(assignedPrice), currency }
      const validCharges = charges.filter((charge) => charge.description.trim() && charge.amount.trim())
      if (validCharges.length > 0) {
        payload.charges = validCharges.map((charge) => ({ description: charge.description, amount: Number(charge.amount) }))
      }
      await assignShipmentPricing(shipmentNumber, payload, token)
      setActionMessage("Pricing assigned successfully.")
      loadShipment()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Unable to assign pricing.")
    }
  }

  const handleMarkReceived = async () => {
    if (!token || !shipmentNumber) return
    setActionMessage("")
    try {
      const payload: any = { location: receiveLocation, notes: receiveNotes }
      if (shipment?.shipmentType === "CONSOLIDATION") {
        const selectedParcels = Array.isArray(shipment.parcels)
          ? shipment.parcels.filter((parcel: any) => selectedParcelIds.includes(parcel.parcelId))
          : []
        if (selectedParcels.length === 0) {
          setActionMessage("Select at least one parcel to mark received.")
          return
        }
        payload.parcelUpdates = selectedParcels.map((parcel: any) => ({
          parcelId: parcel.parcelId,
          previousStatus: parcel.status || "",
          status: "RECEIVED",
        }))
      }
      await markPackageAsReceived(shipmentNumber, payload, token)
      setActionMessage("Shipment marked as received.")
      setReceiveLocation("")
      setReceiveNotes("")
      setSelectedParcelIds([])
      loadShipment()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Unable to mark package as received.")
    }
  }

  const currentPriceLabel = shipment?.pricing?.totalPrice
    ? `$${shipment.pricing.totalPrice}`
    : shipment?.pricing?.basePrice
    ? `$${shipment.pricing.basePrice}`
    : shipment?.totalAmount
    ? `$${shipment.totalAmount}`
    : "Pending"

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shipment Details</h1>
          <p className="text-foreground/60 text-sm md:text-base">Review shipment details and perform super-admin actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/super-admin/shipments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" /> Back to shipments
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={loadShipment} disabled={loading}>
            <RefreshCw className="w-4 h-4" /> Refresh
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
          <CardContent className="p-6 text-foreground/70">Shipment not found.</CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 w-full">
                <div>
                  <CardTitle className="text-2xl">{shipment.shipmentNumber || shipment.id}</CardTitle>
                  <CardDescription>{shipment.shipmentType ? `${shipment.shipmentType} • ${shipment.shipmentMethod}` : shipment.shipmentMethod}</CardDescription>
                </div>
                <div className="space-y-2 text-right">
                  <Badge className={getStatusBadgeClass(String(shipment.currentStatus || shipment.status || "Unknown"))}>
                    {formatStatusLabel(shipment.currentStatus || shipment.status || "Unknown")}
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
                  <p className="text-foreground/60 text-sm">Current Status</p>
                  <p className="text-lg font-semibold text-foreground">{shipment.currentStatus || shipment.status || "Pending"}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-sm">Price</p>
                  <p className="text-lg font-semibold text-primary">{currentPriceLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
                <CardDescription>Customer and parcel information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Customer</p>
                    <p className="text-foreground">{shipment.customerId?.fullName || shipment.customer?.fullName || "Unknown"}</p>
                    <p className="text-foreground/60 text-sm">{shipment.customerId?.email || shipment.customer?.email || "No email"}</p>
                  </div>

                  {shipment.shipmentType === "SINGLE" && shipment.singleShipment ? (
                    <div className="rounded-xl border border-border p-4">
                      <p className="text-sm font-medium text-foreground">Supplier</p>
                      <p className="text-foreground">{shipment.singleShipment.supplierName || "N/A"}</p>
                      <p className="text-foreground/60 text-sm">{shipment.singleShipment.email || shipment.singleShipment.supplierEmail || "No email"}</p>
                      <p className="text-foreground/60 text-sm">{shipment.singleShipment.phoneNumber || shipment.singleShipment.supplierPhone || "No phone"}</p>
                    </div>
                  ) : null}

                  {Array.isArray(shipment.parcels) && shipment.parcels.length > 0 ? (
                    <div className="rounded-xl border border-border p-4 space-y-3">
                      <p className="text-sm font-medium text-foreground">Parcels</p>
                      {shipment.parcels.map((parcel: any, index: number) => (
                        <div key={parcel.parcelId || index} className="rounded-lg border border-border p-3">
                          <p className="font-semibold text-foreground">{parcel.parcelId || `Parcel ${index + 1}`}</p>
                          <p className="text-sm text-foreground/60">Supplier: {parcel.supplierName || parcel.companyName || "N/A"}</p>
                          <p className="text-sm text-foreground/60">Status: {parcel.status || "Unknown"}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-medium text-foreground">Cosignees</p>
                    {Array.isArray(shipment.cosignees) && shipment.cosignees.length > 0 ? (
                      <div className="space-y-3">
                        {shipment.cosignees.map((cosignee: any, index: number) => (
                          <div key={index} className="rounded-lg border border-border p-3">
                            <p className="font-semibold text-foreground">{cosignee.name || `Cosignee ${index + 1}`}</p>
                            <p className="text-sm text-foreground/60">{cosignee.phoneNumber || cosignee.phone || "No phone"}</p>
                            <p className="text-sm text-foreground/60">{cosignee.email || "No email"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground/60 text-sm">No cosignee information.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking & Items</CardTitle>
                <CardDescription>Progress and shipment contents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <TrackingMap
                  origin={shipment.singleShipment?.supplierAddress || shipment.origin || "Origin"}
                  destination={shipment.deliveryMethod === "HOME_DELIVERY" ? "Customer address" : "Warehouse"}
                  status={shipment.currentStatus || shipment.status || "Pending"}
                  shipmentMethod={shipment.shipmentMethod}
                />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Items</p>
                  {items.length > 0 ? (
                    <div className="space-y-3">
                      {items.map((item: any, index: number) => (
                        <div key={index} className="rounded-lg border border-border p-3">
                          <p className="font-semibold text-foreground">{item.description || `Item ${index + 1}`}</p>
                          <p className="text-sm text-foreground/60">
                            Qty: {item.quantity || 1} • Weight: {item.weight || "N/A"} kg • {item.currency ? `${item.currency} ` : ""}
                            {item.unitPrice || item.unitPrice === 0 ? item.unitPrice : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-foreground/60">No item details available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Set Price</CardTitle>
                <CardDescription>Assign or update the shipment pricing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input type="number" placeholder="Base price" value={assignedPrice} onChange={(e) => setAssignedPrice(e.target.value)} />
                  <Input placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Charges</p>
                    <Button variant="outline" size="sm" onClick={handleAddCharge}>Add Charge</Button>
                  </div>
                  {charges.map((charge, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      <Input placeholder="Description" value={charge.description} onChange={(e) => handleChargeChange(index, "description", e.target.value)} />
                      <Input type="number" placeholder="Amount" value={charge.amount} onChange={(e) => handleChargeChange(index, "amount", e.target.value)} />
                      <Button variant="outline" size="sm" onClick={() => removeCharge(index)}>Remove</Button>
                    </div>
                  ))}
                </div>
                {actionMessage ? <p className="text-sm text-foreground/70">{actionMessage}</p> : null}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={loadShipment}>Refresh</Button>
                  <Button onClick={handleAssignPrice}>Save Price</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mark Package Received</CardTitle>
                <CardDescription>Confirm receipt and update parcel status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shipment.trackingTimeline.some((event: any) => event.stage === "PACKAGE_RECEIVED") ? (
                  <p className="text-sm text-foreground/70">Package has been received.</p>
                ) : 
                <>
                  <Input placeholder="Location" value={receiveLocation} onChange={(e) => setReceiveLocation(e.target.value)} />
                  <Input placeholder="Notes" value={receiveNotes} onChange={(e) => setReceiveNotes(e.target.value)} />
                  {isConsolidation ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">Parcel Updates</p>
                      <div className="space-y-3">
                        {Array.isArray(shipment.parcels) && shipment.parcels.length > 0 ? (
                          shipment.parcels.map((parcel: any, index: number) => (
                            <label key={parcel.parcelId || index} className="flex items-start gap-3 rounded-xl border border-border p-4 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedParcelIds.includes(parcel.parcelId)}
                                onChange={(e) => {
                                  const checked = e.target.checked
                                  setSelectedParcelIds((prev) =>
                                    checked
                                      ? [...prev, parcel.parcelId]
                                      : prev.filter((id) => id !== parcel.parcelId)
                                  )
                                }}
                                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              />
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="font-semibold text-foreground">{parcel.parcelId || `Parcel ${index + 1}`}</span>
                                  <Badge variant="secondary">{parcel.status || "Unknown"}</Badge>
                                </div>
                                <p className="text-sm text-foreground/70">Supplier: {parcel.supplierName || parcel.companyName || "Unknown"}</p>
                                {parcel.updatedBy ? (
                                  <p className="text-sm text-foreground/60">Updated by: {parcel.updatedBy.fullName || parcel.updatedBy}</p>
                                ) : null}
                              </div>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-foreground/60">No parcels available for this consolidation shipment.</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                  {actionMessage ? <p className="text-sm text-foreground/70">{actionMessage}</p> : null}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setReceiveLocation("")
                      setReceiveNotes("")
                      setSelectedParcelIds([])
                    }}>Reset</Button>
                    <Button onClick={handleMarkReceived}>Mark Received</Button>
                  </div>
                </>
                }
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>Shipment timeline and parcel events.</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineEvents.length > 0 ? (
                <TrackingTimeline events={timelineEvents} />
              ) : (
                <div className="rounded-lg border border-border p-6 text-foreground/70">No tracking history is available for this shipment yet.</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
