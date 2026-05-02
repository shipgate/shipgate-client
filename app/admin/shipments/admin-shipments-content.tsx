"use client"

import { useState } from "react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Check, Plus } from "lucide-react"

export default function AdminShipmentsContent() {
  const [shipments] = useState([
    {
      id: "SHP-2024-001",
      customer: "John Doe",
      type: "Air",
      status: "in_transit",
      location: "In Flight",
      amount: "$1,080",
      delivery: "Home",
    },
    {
      id: "SHP-2024-002",
      customer: "Jane Smith",
      type: "Sea 20ft",
      status: "arrived",
      location: "Lagos Warehouse",
      amount: "$5,400",
      delivery: "Warehouse",
    },
    {
      id: "SHP-2024-003",
      customer: "Ahmed Hassan",
      type: "Air",
      status: "arrived",
      location: "Lagos Warehouse",
      amount: "$540",
      delivery: "Home",
    },
    {
      id: "SHP-2024-004",
      customer: "Mary Johnson",
      type: "Air",
      status: "pending",
      location: "China Warehouse",
      amount: "$720",
      delivery: "Home",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCourierModal, setShowCourierModal] = useState(false)
  const [selectedShipmentForCourier, setSelectedShipmentForCourier] = useState<string | null>(null)
  const [selectedCourier, setSelectedCourier] = useState("")
  const [showAddShipmentModal, setShowAddShipmentModal] = useState(false)
  const [shipmentToPrice, setShipmentToPrice] = useState<string | null>(null)
  const [assignedPrice, setAssignedPrice] = useState("")
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [newShipmentForm, setNewShipmentForm] = useState({
    customerName: "",
    shippingType: "air",
    deliveryMethod: "home-delivery",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    pickupAddress: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    itemDescription: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  })

  const couriers = [
    { id: 1, name: "Chukwu Okafor", city: "Lagos" },
    { id: 2, name: "Amara Eze", city: "Lagos" },
    { id: 3, name: "Tunde Adeyemi", city: "Lagos" },
  ]

  const handlePriceAssignment = () => {
    if (shipmentToPrice && assignedPrice) {
      console.log(`[v0] Price assigned to ${shipmentToPrice}: $${assignedPrice}`)
      setShowPriceModal(false)
      setAssignedPrice("")
      setShipmentToPrice(null)
    }
  }

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.includes(searchTerm.toUpperCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || shipment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleAssignCourier = () => {
    if (selectedShipmentForCourier && selectedCourier) {
      console.log(`[v0] Assigning courier ${selectedCourier} to shipment ${selectedShipmentForCourier}`)
      setShowCourierModal(false)
      setSelectedCourier("")
      setSelectedShipmentForCourier(null)
    }
  }

  const handleAddShipmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewShipmentForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddShipment = () => {
    console.log("[v0] New shipment created:", newShipmentForm)
    setShowAddShipmentModal(false)
    setNewShipmentForm({
      customerName: "",
      shippingType: "air",
      deliveryMethod: "home-delivery",
      senderName: "",
      senderPhone: "",
      senderAddress: "",
      pickupAddress: "",
      recipientName: "",
      recipientPhone: "",
      recipientAddress: "",
      itemDescription: "",
      weight: "",
      length: "",
      width: "",
      height: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Shipments</h1>
          <p className="text-foreground/60">Track shipments, assign pricing, and couriers for home delivery</p>
        </div>
        <Button
          onClick={() => setShowAddShipmentModal(true)}
          className="bg-primary hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Shipment
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by tracking ID or customer..."
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
              <option value="in_transit">In Transit</option>
              <option value="arrived">Arrived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
          <CardDescription>Your warehouse shipments and deliveries</CardDescription>
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
                  <th className="text-left py-3 px-4 font-semibold">Delivery</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-primary">{shipment.id}</td>
                    <td className="py-3 px-4">{shipment.customer}</td>
                    <td className="py-3 px-4">{shipment.type}</td>
                    <td className="py-3 px-4">
                      <Badge variant={shipment.status === "delivered" ? "default" : "secondary"}>
                        {shipment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={shipment.delivery === "Home" ? "default" : "secondary"}>
                        {shipment.delivery}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">{shipment.amount}</td>
                    <td className="py-3 px-4 flex justify-center items-center gap-2">
                      {shipment.status === "arrived" && shipment.delivery === "Home" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShipmentForCourier(shipment.id)
                            setShowCourierModal(true)
                          }}
                        >
                          <Check className="w-4 h-4 mr-1" /> Assign
                        </Button>
                        
                      )}
                      {shipment.status === "arrived" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShipmentToPrice(shipment.id)
                            setShowPriceModal(true)
                          }}
                        >
                          Set Price
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
