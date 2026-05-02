"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Plane, Ship } from "lucide-react"

interface TrackingMapProps {
  origin: string
  destination: string
  status: string
  shippingType: "air" | "sea"
}

export function TrackingMap({ origin, destination, status, shippingType }: TrackingMapProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Route visualization */}
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              {/* Origin */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-2">
                  🇨🇳
                </div>
                <p className="text-xs font-semibold text-center">Origin</p>
                <p className="text-xs text-foreground/60 text-center max-w-20">{origin}</p>
              </div>

              {/* Arrow/Route */}
              <div className="flex-1 mx-4 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  {shippingType === "air" ? (
                    <Plane className="w-5 h-5 text-primary" />
                  ) : (
                    <Ship className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                <p className="text-xs text-foreground/60 mt-2 font-semibold">
                  {shippingType === "air" ? "Flying" : "Sailing"}
                </p>
              </div>

              {/* Destination */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-2">
                  🇳🇬
                </div>
                <p className="text-xs font-semibold text-center">Destination</p>
                <p className="text-xs text-foreground/60 text-center max-w-20">{destination}</p>
              </div>
            </div>
          </div>

          {/* Route details */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Route Details:</p>
            {shippingType === "air" ? (
              <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
                <li>Warehouse → China Airport</li>
                <li>Customs clearance</li>
                <li>Flight to Nigeria</li>
                <li>Nigeria Airport → Warehouse</li>
              </ul>
            ) : (
              <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
                <li>Warehouse → China Port</li>
                <li>Port departure</li>
                <li>Ocean transit</li>
                <li>Nigeria Port → Warehouse</li>
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
