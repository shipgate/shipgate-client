"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function AdminStatusUpdates() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [updateComplete, setUpdateComplete] = useState(false)

  const shipments = [
    { id: "SHP-2024-001", current: "package_received", location: "Shanghai Warehouse" },
    { id: "SHP-2024-002", current: "in_airport_customs", location: "Shanghai Pudong Airport" },
    { id: "SHP-2024-003", current: "in_flight", location: "Enroute to Lagos" },
  ]

  const airStatusOptions = ["package_received", "in_airport_customs", "in_flight", "arriving_soon", "pending_delivery"]

  const seaStatusOptions = ["cargo_received", "port_departure", "at_sea", "port_arrival", "delivered"]

  const handleConfirmUpdate = () => {
    if (selectedShipment && selectedStatus) {
      setUpdateComplete(true)
      setTimeout(() => {
        setUpdateComplete(false)
        setSelectedShipment(null)
        setSelectedStatus("")
      }, 2000)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Update Shipment Status</h1>
        <p className="text-foreground/60">Select status and confirm to update shipment tracking</p>
      </div>

      {/* Search Shipment */}
      <Card>
        <CardHeader>
          <CardTitle>Search Shipment</CardTitle>
          <CardDescription>Enter tracking number to update</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Enter tracking number (e.g., SHP-2024-001)" className="h-12" />
        </CardContent>
      </Card>

      {/* Status Update Form */}
      {selectedShipment && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>Update Status for {selectedShipment}</CardTitle>
            <CardDescription>
              Current status: {shipments.find((s) => s.id === selectedShipment)?.current}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Status Options */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Select New Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {airStatusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedStatus === status
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground capitalize">{status.replace(/_/g, " ")}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleConfirmUpdate}
                disabled={!selectedStatus}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold"
              >
                {updateComplete ? "Status Updated!" : "Confirm Status Update"}
              </Button>
            </div>

            {updateComplete && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Status updated successfully</p>
                  <p className="text-sm text-green-800">Customer has been notified of the update</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipment List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Status Updates</CardTitle>
          <CardDescription>Shipments awaiting status confirmation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <button
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:border-primary/50 ${
                  selectedShipment === shipment.id ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{shipment.id}</p>
                    <p className="text-sm text-foreground/60">{shipment.location}</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
