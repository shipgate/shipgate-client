"use client"

import { useState } from "react"
import { CreditCard, Loader2, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { initializeShipmentPayment } from "@/lib/payments-api"
import { useAuthStore } from "@/store/auth"

interface PaymentOptionsModalProps {
  open: boolean
  shipmentNumber: string
  invoiceId?: string
  description?: string
  amount?: number
  currency?: string
  onClose: () => void
}

function formatMoney(amount?: number, currency = "NGN") {
  if (!amount || Number.isNaN(amount)) return "Pending"
  const symbol = currency.toUpperCase() === "NGN" ? "₦" : `${currency.toUpperCase()} `
  return `${symbol}${amount.toLocaleString()}`
}

export function PaymentOptionsModal({
  open,
  shipmentNumber,
  invoiceId,
  description,
  amount,
  currency = "NGN",
  onClose,
}: PaymentOptionsModalProps) {
  const token = useAuthStore((state) => state.token)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const handleCheckout = async () => {
    if (!token) {
      setError("Please sign in again before making this payment.")
      return
    }

    if (!shipmentNumber) {
      setError("This invoice is missing a shipment number.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await initializeShipmentPayment(shipmentNumber, token)
      const payload = (response as any).data || response
      const authorizationUrl =
        payload.authorizationUrl ||
        payload.authorization_url ||
        payload.authorization?.authorizationUrl ||
        payload.authorization?.authorization_url

      if (!authorizationUrl || typeof authorizationUrl !== "string") {
        throw new Error("Payment checkout could not be initialized.")
      }

      window.location.href = authorizationUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to initialize checkout.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg rounded-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Choose Payment Method</CardTitle>
            <p className="mt-2 text-sm text-foreground/60">
              {invoiceId ? `${invoiceId} • ` : ""}
              {shipmentNumber}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-foreground/60">{description || "Shipment invoice payment"}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{formatMoney(amount, currency)}</p>
          </div>

          <button
            type="button"
            disabled
            className="w-full rounded-lg border border-border p-4 text-left opacity-60"
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-foreground/60" />
              <div>
                <p className="font-semibold text-foreground">Pay from wallet balance</p>
                <p className="text-sm text-foreground/60">Wallet payments are coming soon.</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-lg border-2 border-primary bg-primary/5 p-4 text-left transition hover:bg-primary/10 disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <CreditCard className="w-5 h-5 text-primary" />
              )}
              <div>
                <p className="font-semibold text-foreground">Proceed to checkout</p>
                <p className="text-sm text-foreground/60">Pay securely with Paystack.</p>
              </div>
            </div>
          </button>

          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
