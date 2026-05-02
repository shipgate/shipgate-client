"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShippingCalculator } from "@/components/calculator/shipping-calculator"
import { RFQForm } from "@/components/calculator/rfq-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("calculator")

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">Shipping Calculator</h1>
            <p className="text-lg text-foreground/70">
              Get instant quotes for your shipments or submit a Request for Quote (RFQ)
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="calculator">Quick Calculator</TabsTrigger>
              <TabsTrigger value="rfq">Request for Quote</TabsTrigger>
            </TabsList>

            {/* Calculator Tab */}
            <TabsContent value="calculator">
              <ShippingCalculator />
            </TabsContent>

            {/* RFQ Tab */}
            <TabsContent value="rfq">
              <RFQForm />
            </TabsContent>
          </Tabs>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Air Shipping</CardTitle>
                <CardDescription>Fast and reliable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-foreground">
                    $8.90 <span className="text-lg font-normal text-foreground/60">/kg</span>
                  </p>
                  <p className="text-sm text-foreground/70">Minimum charge may apply</p>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Fastest delivery option
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Real-time flight tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Full insurance coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Delivery in 10-15 days
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Sea Shipping</CardTitle>
                <CardDescription>Economical for large volumes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">Per CBM</p>
                    <p className="text-2xl font-bold text-foreground">$510</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold text-foreground">20ft Container</p>
                      <p className="text-xl font-bold text-foreground">$5,400</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">40ft Container</p>
                      <p className="text-xl font-bold text-foreground">$7,200</p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Most economical option
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Container tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Full insurance included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Delivery in 45-60 days
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "How are weights calculated?",
                  a: "Actual weight is used for air shipping. For sea shipping, we use CBM (cubic meters) or container size.",
                },
                {
                  q: "Is insurance included?",
                  a: "Yes, all shipments include basic insurance coverage. Additional coverage available upon request.",
                },
                {
                  q: "What are the payment terms?",
                  a: "We accept wallet transfers, bank transfers, and credit cards. 50% upfront, balance upon delivery.",
                },
                {
                  q: "Do you offer customs clearance?",
                  a: "Yes, we handle all customs documentation and clearance at both Chinese and Nigerian ports/airports.",
                },
              ].map((item, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                    <p className="text-foreground/70 text-sm">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
