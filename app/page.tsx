"use client"

import type React from "react"
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Truck, Globe, Clock, Shield, Zap, Package } from "lucide-react"
import Link from "next/link" 
import { ExchangeRatesTicker } from "@/components/exchange-rates-ticker"
import { toast } from "sonner"
import { AnimatedStats } from "@/components/animated-stats"
import { PartnersTicker } from "@/components/partners-ticker"
import { motion } from "framer-motion"
import { ShippingRoutesSection } from "@/components/shipping-routes"
import { CustomerReviews } from "@/components/customer-reviews"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("track")
  const [text, count] = useTypewriter({
        words: [
            "SHIP SMARTER.",
            "TRACK FASTER.",
            "DELIVER BETTER.",
            "We deliver straight to your doorstep."
        ],
        loop: true,
        delaySpeed: 2000,
  })

  const handleTrack = async (e: React.FormEvent) => {
   e.preventDefault()
    window.location.href = `/track?id=${trackingNumber}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <>
      <ExchangeRatesTicker />
      <Navbar />
      {isSearching && <LoadingOverlay />}
      <main className="w-full">
        {/* Hero Section */}
        <section
          className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&h=900&fit=crop")',
            backgroundSize: "",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/80"></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-12 leading-tight">
              {text}
              <Cursor/>
            </h1>

            {/* Action Tabs */}
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveTab("rate")}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "rate" ? "bg-white text-foreground" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Package className="w-5 h-5" />
                RATE & SHIP
              </button>
              <button
                onClick={() => setActiveTab("track")}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "track" ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                TRACK
              </button>
              <button
                onClick={() => setActiveTab("consolidation")}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "consolidation" ? "bg-white text-foreground" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Globe className="w-5 h-5" />
                CONSOLIDATION
              </button>
            </motion.div>

            {/* Tracking Form */}
            {activeTab === "track" && (
             <motion.div 
             className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              
             >
                <form onSubmit={handleTrack} className="flex flex-row gap-3 mb-6">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Enter tracking number (e.g., SHP-XXXXX-XXXXX)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="px-4 bg-white py-6 text-lg border-2 border-border rounded-lg focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Track
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-center text-white  text-sm">
                  Don't have a tracking number?{" "}
                  <Link href="/signup" className="text-primary font-semibold hover:underline">
                    Create an account
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Rate & Ship Form */}
            {activeTab === "rate" && (
              <motion.div 
              className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">Get Shipping Quote</h3>
                <Link href="/calculator">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                    Open Calculator
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Locations Tab */}
            {activeTab === "consolidation" && (
              <motion.div 
              className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-8">Consolidation Services</h3>

                {/* FAQ Section */}
                <div className="space-y-6 mb-10">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-foreground mb-2 text-lg">What is Consolidation?</h4>
                    <p className="text-foreground/70 text-sm mb-3">
                      Consolidation is a cost-effective shipping method where multiple smaller shipments are combined
                      into one larger shipment, reducing your per-unit shipping costs significantly.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-foreground mb-2 text-lg">How to Consolidate?</h4>
                    <p className="text-foreground/70 text-sm mb-3">
                      Simply send your individual packages to our China warehouse. We'll receive, inspect, and
                      consolidate them into one shipment, then send to Nigeria at a fraction of the cost.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-foreground mb-2 text-lg">Consolidation Benefits</h4>
                    <ul className="text-foreground/70 text-sm space-y-1">
                      <li>• Save up to 60% on shipping costs</li>
                      <li>• Flexible pickup scheduling</li>
                      <li>• Full package tracking and insurance</li>
                      <li>• Professional handling and packaging</li>
                    </ul>
                  </div>
                </div>

                {/* Warehouse Address Section */}
                <div className="bg-primary/10 rounded-lg p-6 border border-primary/20 mb-6">
                  <h4 className="font-bold text-foreground mb-4">China Warehouse Address</h4>
                  <div className="space-y-3">
                    <p className="text-foreground font-semibold text-sm">
                      Guangzhou Distribution Center
                      <br />
                      123 Logistics Avenue, Tianhe District
                      <br />
                      Guangzhou, Guangdong 510610
                      <br />
                      China
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          "Guangzhou Distribution Center, 123 Logistics Avenue, Tianhe District, Guangzhou, Guangdong 510610, China",
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy to Clipboard
                    </button>
                  </div>
                </div>

                <Link href="/help">
                  <Button
                    variant="outline"
                    className="w-full px-8 py-3 rounded-lg font-semibold bg-transparent border-primary text-primary hover:bg-primary/10"
                  >
                    Learn More About Consolidation
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
            className="text-3xl font-bold text-center text-foreground mb-12"
            initial={{opacity: 0, x: -20}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.5}}
            >
              Why Choose SHIPGATE?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Real-time Tracking",
                  description:
                    "Track your packages every step of the journey from China warehouse to Nigeria delivery.",
                },
                {
                  icon: Globe,
                  title: "Competitive Pricing",
                  description: "Air: $8.9/kg | Sea: $510/CBM or $5400-$7200 for containers.",
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Your packages are insured and handled by professional logistics experts.",
                },
                {
                  icon: Zap,
                  title: "Fast Processing",
                  description: "Quick quote generation and efficient shipping management.",
                },
                {
                  icon: Truck,
                  title: "Multiple Shipping Options",
                  description: "Choose between air and sea shipping based on your timeline and budget.",
                },
                {
                  icon: Shield,
                  title: "24/7 Support",
                  description: "Customer support via WhatsApp, email, and phone.",
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div 
                  key={index}
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{duration: 0.5, delay: index * 0.2}}
                  className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition">
                    <Icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-foreground/70">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Shipping Routes */}
        <ShippingRoutesSection />

        <AnimatedStats />

        <PartnersTicker />

        <CustomerReviews />

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Ship?</h2>
            <p className="text-lg mb-8 opacity-90">
              Get started today with SHIPGATE by Bowagate. Fast, transparent, and reliable shipping solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator">
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-lg font-semibold">
                  Calculate Shipping Cost
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg font-semibold bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <ScrollToTop />

        {/* Footer */}
        <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">SHIPGATE by Bowagate</h4>
              <p className="text-sm opacity-80">Fast and reliable shipping from China to Nigeria.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="/" className="hover:opacity-100">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:opacity-100">
                    Track
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:opacity-100">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="/blog" className="hover:opacity-100">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:opacity-100">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="hover:opacity-100">
                    Calculator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm opacity-80 mb-2">WhatsApp: +234 XXX XXX XXX</p>
              <p className="text-sm opacity-80">Email: support@</p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2025 SHIPGATE by Bowagate. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
