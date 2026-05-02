"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const recentShipments = [
  {
    id: "SHP-ABC123-XYZ",
    destination: "Lagos, Nigeria",
    status: "in_transit",
    type: "air",
    date: "Nov 5, 2025",
    cost: "$245.60",
  },
  {
    id: "SHP-DEF456-UVW",
    destination: "Abuja, Nigeria",
    status: "delivered",
    type: "sea",
    date: "Oct 28, 2025",
    cost: "$1,850.00",
  },
  {
    id: "SHP-GHI789-RST",
    destination: "Port Harcourt, Nigeria",
    status: "pending",
    type: "air",
    date: "Nov 6, 2025",
    cost: "$512.40",
  },
]

export function RecentShipments() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Recent Shipments</CardTitle>
        <CardDescription>Your latest shipping activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 flex flex-col gap-2">
          {recentShipments.map((shipment) => (
            <Link key={shipment.id} href={`/track?id=${shipment.id}`}>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{shipment.id}</p>
                  <p className="text-sm text-foreground/60">{shipment.destination}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={`${getStatusColor(shipment.status)} mb-1`}>
                      {getStatusLabel(shipment.status)}
                    </Badge>
                    <p className="text-xs text-foreground/60">{shipment.date}</p>
                  </div>
                  <p className="font-semibold text-primary">{shipment.cost}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
