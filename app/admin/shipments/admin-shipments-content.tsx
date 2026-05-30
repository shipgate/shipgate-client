"use client"

import { useEffect, useState } from "react"import Link from "next/link"import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Check, Plus, Trash2 } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { assignShipmentPricing, getAdminShipments, markPackageAsReceived } from "@/lib/shipping-api"

export default function AdminShipmentsContent() {
  const token = useAuthStore((state) => state.token)
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [shipmentToPrice, setShipmentToPrice] = useState<any>(null)
  const [assignedPrice, setAssignedPrice] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [charges, setCharges] = useState([{ description: "", amount: "" }])
  const [showReceivedModal, setShowReceivedModal] = useState(false)
  const [selectedShipmentForReceive, setSelectedShipmentForReceive] = useState<any>(null)
  const [parcelUpdates, setParcelUpdates] = useState([{ parcelId: "", previousStatus: "", newStatus: "" }])
  const [receiveLocation, setReceiveLocation] = useState("")
  const [receiveNotes, setReceiveNotes] = useState("")
  const [actionMessage, setActionMessage] = useState("")

  const loadShipments = async () => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const response = await getAdminShipments(token, 1, 20)
      setShipments((response as any).data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load shipments.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipments()
  }, [token])

  const filteredShipments = shipments.filter((shipment) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      `${shipment.shipmentNumber || shipment.id || ""}`.toLowerCase().includes(searchLower) ||
      `${shipment.customer?.fullName || shipment.customer || ""}`.toLowerCase().includes(searchLower)
    const matchesFilter = filterStatus === "all" || (shipment.currentStatus || shipment.status || "").toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const addCharge = () => setCharges((prev) => [...prev, { description: "", amount: "" }])
  const updateCharge = (index: number, field: string, value: string) => {
    setCharges((prev) => prev.map((charge, idx) => (idx === index ? { ...charge, [field]: value } : charge)))
  }
  const removeCharge = (index: number) => setCharges((prev) => prev.filter((_, idx) => idx !== index))

  const addParcelUpdate = () => setParcelUpdates((prev) => [...prev, { parcelId: "", previousStatus: "", newStatus: "" }])
  const updateParcelUpdate = (index: number, field: string, value: string) => {
    setParcelUpdates((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
  }
  const removeParcelUpdate = (index: number) => setParcelUpdates((prev) => prev.filter((_, idx) => idx !== index))

  const handleAssignPrice = async () => {
    if (!token || !shipmentToPrice) return
    setActionMessage("")
    try {
      const payload: any = { basePrice: Number(assignedPrice), currency }
      const validCharges = charges.filter((charge) => charge.description.trim() && charge.amount.trim())
      if (validCharges.length > 0) {
        payload.charges = validCharges.map((charge) => ({
          description: charge.description,
          amount: Number(charge.amount),
        }))
      }
      await assignShipmentPricing(shipmentToPrice, payload, token)
      setActionMessage(`Pricing set for ${shipmentToPrice}`)
      setShowPriceModal(false)
      setAssignedPrice("")
      setCharges([{ description: "", amount: "" }])
      loadShipments()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Unable to assign pricing.")
    }
  }

  const handleMarkReceived = async () => {
    if (!token || !selectedShipmentForReceive) return
    setActionMessage("")
    try {
      const payload: any = {
        location: receiveLocation,
        notes: receiveNotes,
      }
      const validUpdates = parcelUpdates.filter((update) => update.parcelId.trim() && update.newStatus.trim())
      if (selectedShipmentForReceive.shipmentType === "CONSOLIDATION" && validUpdates.length === 0) {
        setActionMessage("Parcel updates are required for consolidation shipments.")
        return
      }
      if (validUpdates.length > 0) {
        payload.parcelUpdates = validUpdates.map((update) => ({
          parcelId: update.parcelId,
          previousStatus: update.previousStatus,
          newStatus: update.newStatus,
        }))
      }
      await markPackageAsReceived(selectedShipmentForReceive.shipmentNumber || selectedShipmentForReceive.id, payload, token)
      setActionMessage(`Shipment ${selectedShipmentForReceive.shipmentNumber || selectedShipmentForReceive.id} marked received.`)
      setShowReceivedModal(false)
      setReceiveLocation("")
      setReceiveNotes("")
      setParcelUpdates([{ parcelId: "", previousStatus: "", newStatus: "" }])
      loadShipments()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Unable to mark package as received.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Shipments</h1>
          <p className="text-foreground/60">Manage shipments for admin operations and pricing assignments.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by shipment number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="pending_pickup">Pending Pickup</option>
              <option value="in_transit">In Transit</option>
              <option value="arrived_warehouse">Arrived Warehouse</option>
              <option value="pending_delivery">Pending Delivery</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipments ({loading ? "..." : filteredShipments.length})</CardTitle>
          <CardDescription>Admin shipment list with package receive and pricing actions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-foreground/60">Loading shipments...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Shipment</th>
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Delivery</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.shipmentNumber || shipment.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-primary">{shipment.shipmentNumber || shipment.id}</td>
                      <td className="py-3 px-4">{shipment.customer?.fullName || shipment.customer || "Unknown"}</td>
                      <td className="py-3 px-4">{shipment.shipmentType || shipment.type || "Unknown"}</td>
                      <td className="py-3 px-4">
                        <Badge variant={shipment.currentStatus === "DELIVERED" ? "default" : "secondary"}>
                          {shipment.currentStatus || shipment.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{shipment.deliveryMethod || "N/A"}</td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        {shipment.pricing?.totalPrice ? `$${shipment.pricing.totalPrice}` : shipment.totalAmount ? `$${shipment.totalAmount}` : "Pending"}
                      </td>
                      <td className="py-3 px-4 flex flex-wrap gap-2">
                        <Link href={`/admin/shipments/${encodeURIComponent(shipment.shipmentNumber || shipment.id)}`}>
                          <Button variant="secondary" size="sm">View</Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShipmentForReceive(shipment)
                            setShowReceivedModal(true)
                          }}
                        >
                          Mark Received
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShipmentToPrice(shipment.shipmentNumber || shipment.id)
                            setShowPriceModal(true)
                          }}
                        >
                          Set Price
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Set Pricing</h2>
                <p className="text-sm text-foreground/60">Assign pricing for shipment {shipmentToPrice}</p>
              </div>
              <Button variant="ghost" onClick={() => setShowPriceModal(false)}>
                Close
              </Button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Base price"
                  value={assignedPrice}
                  onChange={(e) => setAssignedPrice(e.target.value)}
                />
                <Input
                  placeholder="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">Charges</p>
                  <Button variant="outline" size="sm" onClick={addCharge}>
                    Add Charge
                  </Button>
                </div>
                {charges.map((charge, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <Input
                      placeholder="Description"
                      value={charge.description}
                      onChange={(e) => updateCharge(index, "description", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={charge.amount}
                      onChange={(e) => updateCharge(index, "amount", e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => removeCharge(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              {actionMessage ? <p className="text-sm text-foreground/70">{actionMessage}</p> : null}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPriceModal(false)}>
                  Close
                </Button>
                <Button onClick={handleAssignPrice}>Save Price</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReceivedModal && selectedShipmentForReceive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Package Received</h2>
                <p className="text-sm text-foreground/60">Mark shipment {selectedShipmentForReceive.shipmentNumber || selectedShipmentForReceive.id} as received.</p>
              </div>
              <Button variant="ghost" onClick={() => setShowReceivedModal(false)}>
                Close
              </Button>
            </div>
            <div className="space-y-4 p-6">
              <Input
                placeholder="Location"
                value={receiveLocation}
                onChange={(e) => setReceiveLocation(e.target.value)}
              />
              <Input
                placeholder="Notes"
                value={receiveNotes}
                onChange={(e) => setReceiveNotes(e.target.value)}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">Parcel Updates</p>
                  <Button variant="outline" size="sm" onClick={addParcelUpdate}>
                    Add Parcel Update
                  </Button>
                </div>
                {parcelUpdates.map((update, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <Input
                      placeholder="Parcel ID"
                      value={update.parcelId}
                      onChange={(e) => updateParcelUpdate(index, "parcelId", e.target.value)}
                    />
                    <Input
                      placeholder="Previous Status"
                      value={update.previousStatus}
                      onChange={(e) => updateParcelUpdate(index, "previousStatus", e.target.value)}
                    />
                    <Input
                      placeholder="New Status"
                      value={update.newStatus}
                      onChange={(e) => updateParcelUpdate(index, "newStatus", e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => removeParcelUpdate(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              {actionMessage ? <p className="text-sm text-foreground/70">{actionMessage}</p> : null}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowReceivedModal(false)}>
                  Close
                </Button>
                <Button onClick={handleMarkReceived}>Confirm Received</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
        </CardContent>
      </Card>

      {/* Courier Assignment Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Assign Courier - {selectedShipmentForCourier}</CardTitle>
              <CardDescription>Select a courier for this home delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Select Courier</label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a courier...</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id.toString()}>
                      {courier.name} ({courier.city})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCourierModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleAssignCourier}>
                  <Check className="w-4 h-4 mr-2" /> Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showPriceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Assign Price - {shipmentToPrice}</CardTitle>
              <CardDescription>Set the final delivery price for this shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Price (USD)</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={assignedPrice}
                  onChange={(e) => setAssignedPrice(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPriceModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handlePriceAssignment}>
                  <Check className="w-4 h-4 mr-2" /> Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAddShipmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl my-4">
            <CardHeader>
              <CardTitle>Create New Shipment for Customer</CardTitle>
              <CardDescription>Fill in the shipment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="text-sm font-medium text-foreground">Customer Name *</label>
                <Input
                  name="customerName"
                  value={newShipmentForm.customerName}
                  onChange={handleAddShipmentChange}
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Shipping Type</label>
                <select
                  name="shippingType"
                  value={newShipmentForm.shippingType}
                  onChange={handleAddShipmentChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="air">Air Freight</option>
                  <option value="sea">Sea Freight</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Sender Name *</label>
                <Input
                  name="senderName"
                  value={newShipmentForm.senderName}
                  onChange={handleAddShipmentChange}
                  placeholder="Sender name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Sender Phone *</label>
                <Input
                  name="senderPhone"
                  value={newShipmentForm.senderPhone}
                  onChange={handleAddShipmentChange}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Sender Address *</label>
                <Input
                  name="senderAddress"
                  value={newShipmentForm.senderAddress}
                  onChange={handleAddShipmentChange}
                  placeholder="Sender address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Pickup Address in Lagos</label>
                <Input
                  name="pickupAddress"
                  value={newShipmentForm.pickupAddress}
                  onChange={handleAddShipmentChange}
                  placeholder="Pickup address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Recipient Name *</label>
                <Input
                  name="recipientName"
                  value={newShipmentForm.recipientName}
                  onChange={handleAddShipmentChange}
                  placeholder="Recipient name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Recipient Phone *</label>
                <Input
                  name="recipientPhone"
                  value={newShipmentForm.recipientPhone}
                  onChange={handleAddShipmentChange}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Recipient Address *</label>
                <Input
                  name="recipientAddress"
                  value={newShipmentForm.recipientAddress}
                  onChange={handleAddShipmentChange}
                  placeholder="Recipient address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Item Description *</label>
                <Input
                  name="itemDescription"
                  value={newShipmentForm.itemDescription}
                  onChange={handleAddShipmentChange}
                  placeholder="What are you shipping?"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Weight (kg) *</label>
                <Input
                  name="weight"
                  type="number"
                  value={newShipmentForm.weight}
                  onChange={handleAddShipmentChange}
                  placeholder="Weight in kg"
                  step="0.1"
                />
              </div>
            </CardContent>
            <div className="flex gap-2 justify-end p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddShipmentModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleAddShipment}>
                <Check className="w-4 h-4 mr-2" /> Create Shipment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
