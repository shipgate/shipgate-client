"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileDown } from "lucide-react"

const mockShipments = [
  {
    id: "SHIP001",
    trackingNumber: "TRK-2024-001",
    origin: "Guangzhou, China",
    destination: "Lagos, Nigeria",
    type: "Air",
    weight: "25 kg",
    status: "In Transit",
    date: "2024-01-15",
    cost: "$180.00",
  },
  {
    id: "SHIP002",
    trackingNumber: "TRK-2024-002",
    origin: "Shanghai, China",
    destination: "Abuja, Nigeria",
    type: "Sea",
    weight: "2 CBM",
    status: "Delivered",
    date: "2024-01-10",
    cost: "$560.00",
  },
  {
    id: "SHIP003",
    trackingNumber: "TRK-2024-003",
    origin: "Guangzhou, China",
    destination: "Port Harcourt, Nigeria",
    type: "Sea",
    weight: "20ft Container",
    status: "Pending",
    date: "2024-01-20",
    cost: "$5,400.00",
  },
]

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShipments = mockShipments.filter(
    (shipment) =>
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-primary text-white"
      case "In Transit":
        return "bg-blue-500 text-white"
      case "Pending":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Shipments</h1>
          <p className="text-foreground/60 text-sm md:text-base">Track and manage all your shipments</p>
        </div>
        <a href="/dashboard/add-shipment">
            <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" />
            New Shipment
            </Button>
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
          <CardDescription>View and manage your shipping history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by tracking number or origin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Tracking No.</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden sm:table-cell">Route</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden lg:table-cell">Weight</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden sm:table-cell">Cost</th>
                  <th className="text-center py-3 px-2 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="py-3 px-2 font-semibold text-primary">{shipment.trackingNumber}</td>
                    <td className="py-3 px-2 hidden sm:table-cell text-xs md:text-sm">
                      <div className="text-foreground">{shipment.origin}</div>
                      <div className="text-foreground/60 text-xs">to {shipment.destination}</div>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">{shipment.type}</td>
                    <td className="py-3 px-2 hidden lg:table-cell text-foreground/60">{shipment.weight}</td>
                    <td className="py-3 px-2">
                      <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell font-semibold text-foreground">{shipment.cost}</td>
                    <td className="py-3 px-2 text-center">
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                        <FileDown className="w-4 h-4" />
                      </Button>
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
