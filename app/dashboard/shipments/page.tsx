"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, RefreshCw } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { getCustomerShipments } from "@/lib/shipping-api"
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/shipment-helpers"
import { PaymentOptionsModal } from "@/components/dashboard/payment-options-modal"

export default function ShipmentsPage() {
  const token = useAuthStore((state) => state.token)
  const [shipments, setShipments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPaymentShipment, setSelectedPaymentShipment] = useState<any>(null)

  const loadShipments = async () => {
    if (!token) return
    setError("")
    setLoading(true)
    try {
      const response = await getCustomerShipments(token)
      setShipments(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load shipments.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipments()
  }, [token])

  const filteredShipments = useMemo(
    () =>
      shipments.filter((shipment) => {
        const term = searchTerm.toLowerCase()
        const trackingNumber = String(shipment.shipmentNumber || shipment.trackingNumber || "").toLowerCase()
        const method = String(shipment.shipmentMethod || "").toLowerCase()
        const type = String(shipment.shipmentType || "").toLowerCase()
        return trackingNumber.includes(term) || method.includes(term) || type.includes(term)
      }),
    [shipments, searchTerm],
  )

  const getStatusClass = (status: string) => getStatusBadgeClass(status)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Shipments</h1>
          <p className="text-foreground/60 text-sm md:text-base">Track and manage all your shipments</p>
        </div>
        <Link href="/dashboard/add-shipment">
          <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" />
            New Shipment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>View and manage your shipping history</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadShipments} disabled={loading}>
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by tracking number, route, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {error ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Tracking No.</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden sm:table-cell">Shipment</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden sm:table-cell">Delivery</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden lg:table-cell">Cost</th>
                  <th className="text-center py-3 px-2 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-foreground/70">
                      Loading shipments...
                    </td>
                  </tr>
                ) : filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-foreground/70">
                      No shipments found.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => {
                    const trackingNumber = shipment.shipmentNumber || shipment.trackingNumber || ""
                    const route = shipment.shipmentMethod || shipment.type || ""
                    const itemType = shipment.shipmentType || shipment.type || ""
                    const delivery = shipment.deliveryMethod || ""
                    const amount = Number(shipment.pricing?.totalPrice || shipment.totalAmount || shipment.basePrice || 0)
                    const currency = shipment.pricing?.currency || shipment.currency || "NGN"
                    const cost = amount ? `${currency === "NGN" ? "₦" : `${currency} `}${amount.toLocaleString()}` : "Pending"
                    const paymentStatus = String(shipment.pricing?.status || shipment.paymentStatus || "").toUpperCase()
                    const canPay = amount > 0 && paymentStatus !== "PAID"
                    const status = shipment.currentStatus || "Unknown"

                    return (
                      <tr key={trackingNumber} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-2 font-semibold text-primary">
                          <Link href={`/dashboard/shipments/${trackingNumber}`} className="hover:underline">
                            {trackingNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell text-xs md:text-sm text-foreground">
                          {route}
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">{itemType}</td>
                        <td className="py-3 px-2">
                          <Badge className={getStatusClass(String(status))}>{formatStatusLabel(status)}</Badge>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell text-foreground/60">{delivery}</td>
                        <td className="py-3 px-2 hidden lg:table-cell font-semibold text-foreground">{cost}</td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/dashboard/shipments/${trackingNumber}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                View
                              </Button>
                            </Link>
                            {canPay ? (
                              <Button size="sm" onClick={() => setSelectedPaymentShipment(shipment)}>
                                Pay
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PaymentOptionsModal
        open={Boolean(selectedPaymentShipment)}
        shipmentNumber={selectedPaymentShipment?.shipmentNumber || selectedPaymentShipment?.trackingNumber || ""}
        description={`Shipment #${selectedPaymentShipment?.shipmentNumber || selectedPaymentShipment?.trackingNumber || ""}`}
        amount={Number(
          selectedPaymentShipment?.pricing?.totalPrice ||
            selectedPaymentShipment?.totalAmount ||
            selectedPaymentShipment?.basePrice ||
            0,
        )}
        currency={selectedPaymentShipment?.pricing?.currency || selectedPaymentShipment?.currency || "NGN"}
        onClose={() => setSelectedPaymentShipment(null)}
      />
    </div>
  )
}
