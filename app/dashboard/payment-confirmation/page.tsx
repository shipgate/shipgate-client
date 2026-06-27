"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { verifyPayment } from "@/lib/payments-api"
import { useAuthStore } from "@/store/auth"

export default function PaymentConfirmationPage() {
  const token = useAuthStore((state) => state.token)
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking")
  const [message, setMessage] = useState("Confirming your payment...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference") || params.get("trxref")

    if (!reference) {
      setStatus("error")
      setMessage("We could not find a payment reference to verify.")
      return
    }

    if (!token) {
      setStatus("error")
      setMessage("Please sign in again so we can verify your payment.")
      return
    }

    let active = true

    verifyPayment(reference, token)
      .then((response) => {
        if (!active) return
        const payload = (response as any).data || response
        const paymentStatus = String(payload.status || response.message || "").toUpperCase()
        if (paymentStatus && paymentStatus.includes("FAILED")) {
          setStatus("error")
          setMessage("Payment verification failed. Please try again or contact support.")
          return
        }

        setStatus("success")
        setMessage("Payment has been received. Thank you for shipping with ShipGate.")
        window.setTimeout(() => {
          window.location.href = "/dashboard"
        }, 4500)
      })
      .catch((err) => {
        if (!active) return
        setStatus("error")
        setMessage(err instanceof Error ? err.message : "Unable to verify payment.")
      })

    return () => {
      active = false
    }
  }, [token])

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-xl rounded-lg text-center">
        <CardContent className="space-y-6 py-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            {status === "checking" ? (
              <Loader2 className="size-8 animate-spin text-primary" />
            ) : (
              <CheckCircle2 className={`size-8 ${status === "success" ? "text-green-600" : "text-destructive"}`} />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {status === "checking" ? "Verifying Payment" : status === "success" ? "Thank You" : "Payment Update"}
            </h1>
            <p className="mt-3 text-foreground/70">{message}</p>
            {status === "success" ? (
              <p className="mt-2 text-sm text-foreground/60">You will return to your dashboard shortly.</p>
            ) : null}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
            <Link href="/dashboard/invoices">
              <Button variant="outline">View Invoices</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
