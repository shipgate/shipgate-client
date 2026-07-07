"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { useAuthStore } from "@/store/auth"
import { getCustomerWallet, verifyWalletFunding, WalletTransaction } from "@/lib/payments-api"

export default function MyWalletPage() {
  const token = useAuthStore((state) => state.token)
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadWalletData = async () => {
    if (!token) return

    setLoading(true)
    setError("")
    try {
      const response = await getCustomerWallet(token)
      const payload = (response as any).data || response
      const balance = Number(payload.balance ?? payload.customer?.walletBalance ?? 0) || 0
      setWalletBalance(balance)
      setTransactions(Array.isArray(payload.transactions) ? payload.transactions : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load wallet information.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWalletData()
  }, [token])

  const retryVerification = async (reference?: string) => {
    if (!token) {
      setError("Please sign in again to verify wallet funding.")
      return
    }

    if (!reference) {
      setError("Missing wallet funding reference.")
      return
    }

    setError("")
    setMessage("Verifying payment reference...")
    try {
      const response = await verifyWalletFunding(reference, token)
      const payload = (response as any).data || response
      const balance = Number(payload.customer?.walletBalance ?? payload.walletBalance ?? 0) || walletBalance
      setWalletBalance(balance)
      await loadWalletData()
      setMessage("Wallet funding verified successfully.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify wallet funding.")
    }
  }

  const transactionRows = useMemo(() => {
    return transactions.map((transaction) => {
      const status = String(transaction.status || "").toUpperCase()
      const isRetryable =
        String(transaction.type || "").toUpperCase() === "CREDIT" &&
        String(transaction.source || "").toLowerCase() === "paystack_funding" &&
        status !== "SUCCESS"

      return {
        ...transaction,
        status,
        isRetryable,
      }
    })
  }, [transactions])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Wallet</h1>
          <p className="text-foreground/60 text-sm md:text-base">Manage your wallet balance and transaction activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="sm:w-fit">
            <WalletCard balance={walletBalance} />
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Wallet Activity</CardTitle>
              <CardDescription>Recent wallet transactions and funding status.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="py-12 text-center text-foreground/70">Loading wallet activity...</div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">{error}</div>
            ) : null}

            {message ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-emerald-700">{message}</div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-foreground/70">
                    <th className="text-left py-3 px-2 font-semibold">Reference</th>
                    <th className="text-left py-3 px-2 font-semibold">Type</th>
                    <th className="text-left py-3 px-2 font-semibold">Source</th>
                    <th className="text-right py-3 px-2 font-semibold">Amount</th>
                    <th className="text-left py-3 px-2 font-semibold">Status</th>
                    <th className="text-center py-3 px-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/70">
                        No wallet activity found.
                      </td>
                    </tr>
                  ) : (
                    transactionRows.map((transaction) => {
                      const amount = Number(transaction.amount ?? 0)
                      const formattedAmount = amount
                        ? `₦${amount.toLocaleString()}`
                        : "N/A"

                      return (
                        <tr key={transaction.reference || `${transaction.source}-${transaction.amount}-${transaction.status}`} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-2 font-semibold text-foreground">{transaction.reference || "-"}</td>
                          <td className="py-3 px-2 text-foreground/70">{transaction.type || "-"}</td>
                          <td className="py-3 px-2 text-foreground/70">{transaction.source || "-"}</td>
                          <td className="py-3 px-2 text-right font-semibold text-foreground">{formattedAmount}</td>
                          <td className="py-3 px-2">
                            <Badge
                              className={
                                transaction.status === "SUCCESS"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {transaction.status || "UNKNOWN"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {transaction.isRetryable ? (
                              <Button size="sm" onClick={() => retryVerification(transaction.reference)}>
                                Retry
                              </Button>
                            ) : (
                              <span className="text-foreground/60">—</span>
                            )}
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
      </div>
    </div>
  )
}
