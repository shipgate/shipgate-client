"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { fundWallet } from "@/lib/payments-api"
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils"

const paymentMethods = [
  { id: "card", name: "Paystack Checkout", icon: CreditCard, description: "Visa, Mastercard, Bank Transfer" },
]

export default function AddFundsPage() {
  const token = useAuthStore((state) => state.token)
  const email = useAuthStore((state) => state.user?.email)
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAddFunds = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.")
      return
    }

    if (!token || !email) {
      setError("Please sign in again to continue funding your wallet.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fundWallet(Number(amount), email, "Wallet funding", token)
      const payload = (response as any).data || response
      const authorizationUrl =
        payload.authorizationUrl ||
        payload.authorization_url ||
        payload.authorization?.authorizationUrl ||
        payload.authorization?.authorization_url

      if (!authorizationUrl || typeof authorizationUrl !== "string") {
        throw new Error("Could not initialize wallet funding checkout.")
      }

      window.location.href = authorizationUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fund wallet.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Add Funds</h1>
        <p className="text-foreground/60 text-sm md:text-base">Top up your wallet to start shipping</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose Amount</CardTitle>
          <CardDescription>Enter the amount you want to add to your wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount (NGN)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₦</span>
              <NumericFormat
                thousandSeparator
                value={amount}
                onValueChange={(values) => {
                  setAmount(values.value);
                }}
                placeholder="10,000"
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  "pl-7"
                )}
              />
            </div> 
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Quick amounts:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["5000", "10000", "25000", "50000"].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount ? "default" : "outline"}
                  onClick={() => setAmount(quickAmount)}
                  className="text-sm"
                >
                  ₦{Number(quickAmount).toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Select how you want to pay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{method.name}</p>
                    <p className="text-sm text-foreground/60">{method.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Button
        onClick={handleAddFunds}
        disabled={loading || !amount}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
      >
        {loading ? "Processing..." : `Add ₦${amount || "0"} to Wallet`}
      </Button>
    </div>
  )
}
