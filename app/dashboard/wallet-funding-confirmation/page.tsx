"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { verifyWalletFunding } from "@/lib/payments-api"
import { useAuthStore } from "@/store/auth"

export default function WalletFundingConfirmationPage() {
  const token = useAuthStore((state) => state.token)
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking")
  const [message, setMessage] = useState("Confirming your wallet funding...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference") || params.get("trxref")

    if (!reference) {
      setStatus("error")
      setMessage("We could not find a wallet funding reference to verify.")
      return
    }

    if (!token) {
      setStatus("error")
      setMessage("Please sign in again so we can verify your wallet funding.")
      return
    }

    let active = true

    verifyWalletFunding(reference, token)
      .then((response) => {
        if (!active) return
        const payload = (response as any).data || response
        const verificationStatus = String(payload.success ?? payload.status ?? "").toUpperCase()

        if (verificationStatus && verificationStatus.includes("FALSE")) {
          setStatus("error")
          setMessage("Wallet funding verification failed. Please try again or contact support.")
          return
        }

        setStatus("success")
        setMessage("Your wallet funding has been verified successfully.")
        window.setTimeout(() => {
          window.location.href = "/dashboard"
        }, 4500)
      })
      .catch((err: unknown) => {
        if (!active) return
        setStatus("error")
        setMessage(err instanceof Error ? err.message : "Unable to verify wallet funding.")
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
              {status === "checking" ? "Verifying Wallet Funding" : status === "success" ? "Funding Confirmed" : "Funding Update"}
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
            <Link href="/dashboard/add-funds">
              <Button variant="outline">Try Again</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
