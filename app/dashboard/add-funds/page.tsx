"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { fundWallet } from "@/lib/payments-api"

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard" },
  { id: "bank", name: "Bank Transfer", icon: Banknote, description: "Direct bank deposit" },
  { id: "mobile", name: "Mobile Money", icon: Smartphone, description: "MTN, Airtel, GLO" },
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
              <Input
                type="number"
                placeholder="10,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
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
                  ₦{quickAmount}
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
