"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react"

export default function ExchangeRatesPage() {
  const [exchangeRates] = useState({
    USD_NGN: { rate: 1645, change: 2.5 },
    CNY_NGN: { rate: 223, change: -1.2 },
  })

  // Mock historical data
  const historicalData = [
    { date: "Nov 1", usd_ngn: 1620, cny_ngn: 225 },
    { date: "Nov 2", usd_ngn: 1628, cny_ngn: 224 },
    { date: "Nov 3", usd_ngn: 1635, cny_ngn: 223 },
    { date: "Nov 4", usd_ngn: 1640, cny_ngn: 223 },
    { date: "Nov 5", usd_ngn: 1638, cny_ngn: 222 },
    { date: "Nov 6", usd_ngn: 1642, cny_ngn: 222 },
    { date: "Nov 7", usd_ngn: 1645, cny_ngn: 223 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Exchange Rates</h1>
        <p className="text-foreground/60">Live forex rates updated hourly</p>
      </div>

      {/* Current Rates */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              USD to NGN
              {exchangeRates["USD_NGN"].change > 0 ? (
                <ArrowUp className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>Current rate and 24h change</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-5xl font-bold text-foreground">₦{exchangeRates["USD_NGN"].rate.toLocaleString()}</p>
              <p className={`text-sm mt-2 ${exchangeRates["USD_NGN"].change > 0 ? "text-green-600" : "text-red-600"}`}>
                {exchangeRates["USD_NGN"].change > 0 ? "+" : ""}
                {exchangeRates["USD_NGN"].change}% in 24h
              </p>
            </div>
            <div className="pt-4 border-t border-border text-sm">
              <p className="text-foreground/60 mb-2">Bid/Ask</p>
              <p className="font-semibold text-foreground">₦1,643 / ₦1,647</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              CNY to NGN
              {exchangeRates["CNY_NGN"].change > 0 ? (
                <ArrowUp className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>Current rate and 24h change</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-5xl font-bold text-foreground">₦{exchangeRates["CNY_NGN"].rate.toLocaleString()}</p>
              <p className={`text-sm mt-2 ${exchangeRates["CNY_NGN"].change > 0 ? "text-green-600" : "text-red-600"}`}>
                {exchangeRates["CNY_NGN"].change > 0 ? "+" : ""}
                {exchangeRates["CNY_NGN"].change}% in 24h
              </p>
            </div>
            <div className="pt-4 border-t border-border text-sm">
              <p className="text-foreground/60 mb-2">Bid/Ask</p>
              <p className="font-semibold text-foreground">₦221 / ₦225</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>USD to NGN - 7 Day Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip />
                <Area type="monotone" dataKey="usd_ngn" stroke="#d5343a" fill="#d5343a" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CNY to NGN - 7 Day Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip />
                <Area type="monotone" dataKey="cny_ngn" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rate Conversion Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Conversion
          </CardTitle>
          <CardDescription>Calculate shipping costs in NGN</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Air Shipping (USD)</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">$1,000</span>
                <span className="text-foreground/60">=</span>
                <span className="text-2xl font-bold text-foreground">₦1,645,000</span>
              </div>
              <p className="text-xs text-foreground/60">At current rate: $8.9/kg × 139kg</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Sea Shipping (CBM)</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">$5,400</span>
                <span className="text-foreground/60">=</span>
                <span className="text-2xl font-bold text-foreground">₦8,883,000</span>
              </div>
              <p className="text-xs text-foreground/60">20ft container rate conversion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Exchange rates are updated hourly from multiple sources. Actual rates may vary based
            on your bank and timing of transaction. Lock in rates for large shipments to minimize currency fluctuation
            risk.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
