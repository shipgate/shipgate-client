"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ShippingCalculator() {
  const [shippingType, setShippingType] = useState<"air" | "sea">("air")
  const [weight, setWeight] = useState<number>(0)
  const [length, setLength] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [cbm, setCbm] = useState<number>(0)
  const [containerType, setContainerType] = useState<"20ft" | "40ft">("20ft")
  const [quantity, setQuantity] = useState<number>(1)

  const volumetricWeight = useMemo(() => {
    if (length > 0 && width > 0 && height > 0) {
      return (length * width * height) / 6000
    }
    return 0
  }, [length, width, height])

  const chargeableWeight = useMemo(() => {
    if (weight > 0) {
      return Math.max(weight, volumetricWeight)
    }
    return 0
  }, [weight, volumetricWeight])

  const calculate = useMemo(() => {
    if (shippingType === "air") {
      const totalWeight = chargeableWeight * quantity
      return {
        cost: totalWeight * 8.9,
        breakdown: `${totalWeight.toFixed(2)}kg × $8.9/kg`,
      }
    } else {
      let cost = 0
      let breakdown = ""

      if (cbm > 0) {
        cost = cbm * 510
        breakdown = `${cbm} CBM × $510/CBM`
      } else if (containerType) {
        cost = containerType === "20ft" ? 5400 : 7200
        breakdown = `1× ${containerType} Container`
      }

      return { cost, breakdown }
    }
  }, [shippingType, chargeableWeight, cbm, containerType, quantity])

  const handleReset = () => {
    setWeight(0)
    setLength(0)
    setWidth(0)
    setHeight(0)
    setCbm(0)
    setQuantity(1)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calculator Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Type</CardTitle>
            <CardDescription>Choose your preferred shipping method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShippingType("air")}
                className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                  shippingType === "air"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-foreground hover:border-primary/50"
                }`}
              >
                ✈️ Air Shipping
              </button>
              <button
                onClick={() => setShippingType("sea")}
                className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                  shippingType === "sea"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-foreground hover:border-primary/50"
                }`}
              >
                🚢 Sea Shipping
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Air Shipping Inputs */}
        {shippingType === "air" && (
          <Card>
            <CardHeader>
              <CardTitle>Air Shipping Details</CardTitle>
              <CardDescription>Enter weight and dimensions (optional) to calculate chargeable weight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Actual Weight (kg) *</label>
                <Input
                  type="number"
                  placeholder="Enter weight in kg"
                  value={weight || ""}
                  onChange={(e) => setWeight(Number.parseFloat(e.target.value) || 0)}
                  className="h-10"
                />
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-semibold text-foreground mb-3">Dimensions (Optional)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-2">Length (cm)</label>
                    <Input
                      type="number"
                      placeholder="L"
                      value={length || ""}
                      onChange={(e) => setLength(Number.parseFloat(e.target.value) || 0)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-2">Width (cm)</label>
                    <Input
                      type="number"
                      placeholder="W"
                      value={width || ""}
                      onChange={(e) => setWidth(Number.parseFloat(e.target.value) || 0)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-2">Height (cm)</label>
                    <Input
                      type="number"
                      placeholder="H"
                      value={height || ""}
                      onChange={(e) => setHeight(Number.parseFloat(e.target.value) || 0)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {volumetricWeight > 0 && (
                <div className="p-3 bg-muted rounded-lg space-y-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">Volumetric Weight</span>
                    <span className="font-semibold text-foreground">{volumetricWeight.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">Chargeable Weight</span>
                    <span className="font-bold text-primary">{chargeableWeight.toFixed(2)} kg</span>
                  </div>
                  <p className="text-xs text-foreground/60 pt-2 border-t">
                    Chargeable weight is the greater of actual vs volumetric weight
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Quantity (pieces)</label>
                <Input
                  type="number"
                  placeholder="Number of items"
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Number.parseFloat(e.target.value) || 1)}
                  min="1"
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sea Shipping Inputs */}
        {shippingType === "sea" && (
          <Card>
            <CardHeader>
              <CardTitle>Sea Shipping Details</CardTitle>
              <CardDescription>Choose by container size or CBM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Container Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setContainerType("20ft")}
                    className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                      containerType === "20ft"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/50"
                    }`}
                  >
                    20ft Container
                  </button>
                  <button
                    onClick={() => setContainerType("40ft")}
                    className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                      containerType === "40ft"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/50"
                    }`}
                  >
                    40ft Container
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Or enter CBM volume</label>
                <Input
                  type="number"
                  placeholder="Enter CBM (cubic meters)"
                  value={cbm || ""}
                  onChange={(e) => setCbm(Number.parseFloat(e.target.value) || 0)}
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reset Button */}
        <Button onClick={handleReset} variant="outline" className="w-full border-2 bg-transparent">
          Reset Calculator
        </Button>
      </div>

      {/* Cost Summary */}
      <div>
        <Card className="sticky top-20 border-2 border-primary bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-primary">Estimated Cost</CardTitle>
            <CardDescription>Based on your inputs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-foreground/60 text-sm mb-2">Total Cost</p>
              <p className="text-5xl font-bold text-primary">${calculate.cost.toFixed(2)}</p>
            </div>

            <div className="p-3 bg-muted rounded">
              <p className="text-xs text-foreground/60 mb-1">Breakdown</p>
              <p className="font-semibold text-foreground text-sm">{calculate.breakdown}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-foreground/60">Delivery Time</p>
              <Badge className="bg-primary/20 text-primary">{shippingType === "air" ? "10-15 days" : "45-60 days"}</Badge>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-xs text-foreground/60 font-semibold">✓ Insurance Included</p>
              <p className="text-xs text-foreground/60 font-semibold">✓ Customs Handling</p>
              <p className="text-xs text-foreground/60 font-semibold">✓ Real-time Tracking</p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold">
              Request Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
