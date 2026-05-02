"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus } from "lucide-react"

interface WalletCardProps {
  balance: number
}

export function WalletCard({ balance }: WalletCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="w-6 h-6" />
          Wallet Balance
        </CardTitle>
        <CardDescription className="text-white/70">Your account balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-white/70 mb-2">Available Balance</p>
          <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
        </div>
        <div className="space-y-2 flex flex-col gap-1">
          <a href="/dashboard/add-funds">
            <Button className="w-full bg-white text-primary hover:bg-white/90 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Funds
            </Button>
          </a>

          <a href="/dashboard/withdraw">
            <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 bg-transparent">
              Withdraw
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
