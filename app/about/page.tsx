"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Award, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">About ShipGate</h1>
              <p className="text-lg text-foreground/70">
                Bridging commerce between China and Nigeria with fast, reliable, and transparent logistics solutions
                since 2020.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  To provide fast, affordable, and transparent shipping solutions that empower businesses to trade
                  seamlessly between China and Nigeria.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  To become the most trusted logistics partner for Africa-Asia trade, known for innovation, reliability,
                  and exceptional customer service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Our Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-foreground/70 text-sm">Transparency</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-foreground/70 text-sm">Reliability</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-foreground/70 text-sm">Excellence</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">5000+</p>
              <p className="text-foreground/70 mt-2">Shipments Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">2000+</p>
              <p className="text-foreground/70 mt-2">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">98%</p>
              <p className="text-foreground/70 mt-2">On-Time Delivery Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">24/7</p>
              <p className="text-foreground/70 mt-2">Customer Support</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose SHIPGATE by Bowagate?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Global Reach, Local Expertise",
                  description:
                    "We understand both Chinese and Nigerian logistics requirements, ensuring smooth operations at both ends.",
                },
                {
                  icon: Award,
                  title: "Competitive Pricing",
                  description:
                    "Direct partnerships with airlines and shipping companies ensure you get the best rates in the market.",
                },
                {
                  icon: Users,
                  title: "Expert Team",
                  description:
                    "Our experienced team handles customs, documentation, and logistics with precision and professionalism.",
                },
                {
                  icon: CheckCircle2,
                  title: "Transparent Operations",
                  description:
                    "Real-time tracking and clear pricing mean no surprises. You know exactly what you're paying for.",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <Icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Partners */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Partners</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Logistics Partners</h3>
                <ul className="space-y-3">
                  {[
                    "China Eastern Airlines",
                    "Air China Cargo",
                    "MSC (Mediterranean Shipping Company)",
                    "CMA CGM",
                    "Shanghai International Port",
                    "Lagos Port Authority",
                  ].map((partner, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{partner}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Financial & Insurance Partners</h3>
                <ul className="space-y-3">
                  {[
                    "Allianz Global Insurance",
                    "AIG (American International Group)",
                    "First Bank Nigeria",
                    "Access Bank",
                    "Zenith Bank",
                    "Standard Chartered",
                  ].map((partner, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{partner}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-4">China Office</h3>
                  <p className="text-foreground/70 text-sm mb-2">Shanghai International Port</p>
                  <p className="text-foreground/70 text-sm mb-4">Shanghai, China</p>
                  <p className="text-sm font-semibold text-primary">+86 XXX XXXX XXXX</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Nigeria Office</h3>
                  <p className="text-foreground/70 text-sm mb-2">Murtala Muhammed International Airport</p>
                  <p className="text-foreground/70 text-sm mb-4">Lagos, Nigeria</p>
                  <p className="text-sm font-semibold text-primary">+234 XXX XXX XXXX</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Email & Support</h3>
                  <p className="text-foreground/70 text-sm mb-2">support@.com</p>
                  <p className="text-foreground/70 text-sm mb-4">info@.com</p>
                  <p className="text-sm font-semibold text-primary">WhatsApp: 24/7</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
