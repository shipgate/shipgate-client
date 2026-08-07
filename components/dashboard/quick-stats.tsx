"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, TrendingUp, DollarSign } from "lucide-react"

interface QuickStatsProps {
  walletBalance: number
  shipmentCount: number
  totalSpent: number
  loading?: boolean
}

export function QuickStats({ walletBalance, shipmentCount, totalSpent, loading = false }: QuickStatsProps) {
  const stats = [
    {
      icon: DollarSign,
      label: "Wallet Balance",
      value: `₦${walletBalance.toFixed(2)}`,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Package,
      label: "Total Shipments",
      value: shipmentCount.toString(),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Total Spent",
      value: `₦${totalSpent.toFixed(2).toLocaleLowerCase()}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
