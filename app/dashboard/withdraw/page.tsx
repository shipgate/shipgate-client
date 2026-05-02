"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export default function WithdrawPage() {
  const walletBalance = 2500.0
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [bankName, setBankName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleWithdraw = async () => {
    setError("")

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(amount) > walletBalance) {
      setError("Insufficient balance")
      return
    }

    if (!accountNumber || !accountName || !bankName) {
      setError("Please fill in all bank details")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert(`Successfully withdrawn ₦${amount} from your wallet`)
    setAmount("")
    setAccountNumber("")
    setAccountName("")
    setBankName("")
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Withdraw Funds</h1>
        <p className="text-foreground/60 text-sm md:text-base">Transfer funds from your wallet to your bank account</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="text-2xl md:text-3xl font-bold text-primary">₦{walletBalance.toFixed(2)}</div>
            <div>
              <p className="text-sm text-foreground/60">Available Balance</p>
              <p className="text-xs text-foreground/60">Ready to withdraw</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Amount</CardTitle>
          <CardDescription>How much do you want to withdraw?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount (NGN)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₦</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {amount && Number.parseFloat(amount) > walletBalance && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">Insufficient balance</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
          <CardDescription>Where should we send the funds?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bank Name</label>
            <Input
              placeholder="e.g., GTBank, Access Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Account Name</label>
            <Input placeholder="Your full name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Account Number</label>
            <Input
              placeholder="Your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        onClick={handleWithdraw}
        disabled={loading || !amount || !accountNumber}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
      >
        {loading ? "Processing..." : `Withdraw ₦${amount || "0"}`}
      </Button>
    </div>
  )
}
