"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Ship, Package, CheckCircle2 } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"



export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Services</h1>
              <p className="text-lg text-foreground/70">
                Comprehensive shipping solutions tailored to your needs. Fast, reliable, and transparent logistics.
              </p>
            </div>
          </div>
        </section>

        {/* Air Freight Section */}
        <section id="air-freight" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
              <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Plane className="w-10 h-10 text-primary" />
                  <h2 className="text-4xl font-bold text-foreground">Air Freight</h2>
                </div>
                <p className="text-lg text-foreground/70 mb-6">
                  Fast and efficient air shipping for time-sensitive cargo. Perfect for urgent shipments that need to
                  reach Nigeria quickly.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    { title: "Speed", desc: "10-15 days delivery from China to Nigeria" },
                    { title: "Tracking", desc: "Real-time tracking including flight routes" },
                    { title: "Pricing", desc: "$8.90 per kilogram" },
                    { title: "Ideal For", desc: "Electronics, documents, urgent items" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-foreground/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
                <Link href="/calculator">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                    Get Air Shipping Quote
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
              className="flex-1 bg-gradient-to-br  from-primary/10 to-primary/5 rounded-lg flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              >
                <img loading="lazy" src="/air.jpg" alt="" className="w-full h-full object-cover rounded-lg" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sea Freight Section */}
        <section id="sea-freight" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-12">
              <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Ship className="w-10 h-10 text-primary" />
                  <h2 className="text-4xl font-bold text-foreground">Sea Freight</h2>
                </div>
                <p className="text-lg text-foreground/70 mb-6">
                  Cost-effective shipping for large volumes and heavy cargo. Our sea freight service offers flexible
                  container options.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    { title: "Options", desc: "$510/CBM, $5400/20ft container, $7200/40ft container" },
                    { title: "Duration", desc: "45-60 days delivery time" },
                    { title: "Tracking", desc: "Port-to-port tracking with detailed updates" },
                    { title: "Ideal For", desc: "Bulk orders, heavy items, cost-sensitive shipments" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-foreground/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
                <Link href="/calculator">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                    Get Sea Shipping Quote
                  </Button>
                </Link>
              </motion.div>
              <motion.div 
              className="flex-1 bg-gradient-to-br  from-primary/10 to-primary/5 rounded-lg flex items-center justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              >
                <img loading="lazy" src="/sea.jpg" alt="" className="w-full h-full object-cover rounded-lg" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Consolidation Section */}
        <section id="consolidation" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-10 h-10 text-primary" />
                  <h2 className="text-4xl font-bold text-foreground">Consolidation</h2>
                </div>
                <p className="text-lg text-foreground/70 mb-6">
                  Combine multiple shipments into one to save up to 60% on shipping costs. Our consolidation service is
                  perfect for frequent shippers.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    { title: "Savings", desc: "Save up to 60% compared to individual shipments" },
                    { title: "Process", desc: "Drop packages at warehouse, we consolidate and ship" },
                    { title: "Tracking", desc: "Full tracking from warehouse to final delivery" },
                    { title: "Ideal For", desc: "Frequent shippers, small business owners, resellers" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-foreground/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
                <Link href="/support">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold">
                    Learn More About Consolidation
                  </Button>
                </Link>
              </div>
              <div  className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                <img loading="lazy" src="/consolidation.jpg" alt="" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>

            {/* Warehouse Address */}
            <Card className="mt-12 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">China Warehouse Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-foreground mb-2">Guangzhou Distribution Center</p>
                    <p className="text-foreground/70">123 Logistics Avenue, Tianhe District</p>
                    <p className="text-foreground/70">Guangzhou, Guangdong 510610</p>
                    <p className="text-foreground/70">China</p>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "Guangzhou Distribution Center, 123 Logistics Avenue, Tianhe District, Guangzhou, Guangdong 510610, China",
                      )
                    }
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Address to Clipboard
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Service Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Air Freight</th>
                    <th className="px-6 py-4 text-center font-semibold">Sea Freight</th>
                    <th className="px-6 py-4 text-center font-semibold">Consolidation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Delivery Time", air: "10-15 days", sea: "45-60 days", cons: "Varies" },
                    { feature: "Cost", air: "$8.90/kg", sea: "$510/CBM", cons: "60% Savings" },
                    { feature: "Best For", air: "Urgent Items", sea: "Bulk Orders", cons: "Multiple Items" },
                    { feature: "Tracking", air: "Real-time", sea: "Real-time", cons: "Full Tracking" },
                    { feature: "Insurance", air: "Available", sea: "Available", cons: "Available" },
                  ].map((row, idx) => (
                    <tr key={idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-muted/50"}`}>
                      <td className="px-6 py-4 font-semibold text-foreground">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-foreground/70">{row.air}</td>
                      <td className="px-6 py-4 text-center text-foreground/70">{row.sea}</td>
                      <td className="px-6 py-4 text-center text-foreground/70">{row.cons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Choose Your Shipping Method</h2>
            <p className="text-lg mb-8 opacity-90">
              Select the service that best fits your needs and budget. Need help? Contact our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator">
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-lg font-semibold">
                  Get Quote
                </Button>
              </Link>
              <Link href="/support">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg font-semibold bg-transparent"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">SHIPGATE</h4>
              <p className="text-sm opacity-80">Fast and reliable shipping from China to Nigeria.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <button className="hover:opacity-100">Air Freight</button>
                </li>
                <li>
                  <button className="hover:opacity-100">Sea Freight</button>
                </li>
                <li>
                  <button className="hover:opacity-100">Consolidation</button>
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
                  <Link href="/calculator" className="hover:opacity-100">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:opacity-100">
                    Track Package
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm opacity-80 mb-2">WhatsApp: +234 XXX XXX XXX</p>
              <p className="text-sm opacity-80">Email: support@shipgate.com</p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2025 SHIPGATE by BowaGate. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
