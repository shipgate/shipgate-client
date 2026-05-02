"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Check } from "lucide-react"

export default function ShipmentsContent() {
  const [shipments] = useState([
    {
      id: "SHP-2024-001",
      customer: "John Doe",
      type: "Air",
      status: "in_transit",
      location: "In Flight to Nigeria",
      amount: "$1,080",
      arrival: "Lagos Warehouse",
    },
    {
      id: "SHP-2024-002",
      customer: "Jane Smith",
      type: "Sea 20ft",
      status: "arrived",
      location: "Lagos Warehouse",
      amount: "$5,400",
      arrival: "Lagos Warehouse",
    },
    {
      id: "SHP-2024-003",
      customer: "Ahmed Hassan",
      type: "Air",
      status: "pending",
      location: "China Warehouse",
      amount: "$540",
      arrival: "Lagos Warehouse",
    },
    {
      id: "SHP-2024-004",
      customer: "Mary Johnson",
      type: "Sea 40ft",
      status: "arrived",
      location: "Lagos Warehouse",
      amount: "$7,200",
      arrival: "Lagos Warehouse",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [shipmentToPrice, setShipmentToPrice] = useState<string | null>(null)
  const [assignedPrice, setAssignedPrice] = useState("")

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.includes(searchTerm.toUpperCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || shipment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handlePriceAssignment = () => {
    if (shipmentToPrice && assignedPrice) {
      console.log(`[v0] Price assigned to ${shipmentToPrice}: $${assignedPrice}`)
      setShowPriceModal(false)
      setAssignedPrice("")
      setShipmentToPrice(null)
    }
  }

  const handleCourierAssignment = (shipmentId: string) => {
    console.log(`[v0] Assigning courier to shipment: ${shipmentId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Shipments</h1>
        <p className="text-foreground/60">Manage all shipments, assign pricing, and courier delivery</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by tracking ID or customer name..."
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
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
          <CardDescription>All shipments across all routes</CardDescription>
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
                  <th className="text-left py-3 px-4 font-semibold">Location</th>
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
                    <td className="py-3 px-4 text-foreground/70">{shipment.location}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{shipment.amount}</td>
                    <td className="py-3 px-4 space-x-1">
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
                      {shipment.type.includes("Air") && shipment.status === "arrived" && (
                        <Button variant="outline" size="sm" onClick={() => handleCourierAssignment(shipment.id)}>
                          <Check className="w-4 h-4 mr-1" /> Assign
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

      {/* Price Assignment Modal */}
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
    </div>
  )
}
