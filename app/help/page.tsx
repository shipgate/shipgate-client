"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, Clock, MessageCircle } from "lucide-react"

export default function SupportPage() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Air shipping takes 10-15 days from warehouse to warehouse. Sea shipping takes 45-60 days. Actual delivery depends on customs clearance times.",
    },
    {
      q: "What happens if my package is damaged?",
      a: "All shipments include basic insurance. Report damage within 24 hours of delivery with photos. We'll file a claim immediately. Additional coverage available for high-value items.",
    },
    {
      q: "Can I track my shipment in real-time?",
      a: "Yes! Use your tracking number on our website to see live updates. You'll see every checkpoint including warehouse, airport/port, and final delivery location.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept bank transfers, credit cards, and wallet transfers. Payment is typically 50% upfront and 50% upon delivery confirmation.",
    },
    {
      q: "Do you handle customs clearance?",
      a: "Yes, we handle all customs documentation and clearance. Proper HS codes and documentation ensure smooth clearance without delays.",
    },
    {
      q: "Can I insure high-value items?",
      a: "Absolutely. Additional insurance is available. Declare the full value of your items for proper coverage. Premium rates apply for high-value shipments.",
    },
    {
      q: "What items cannot be shipped?",
      a: "Prohibited items include: flammable/explosive materials, hazardous chemicals, certain medications, weapons, and counterfeit goods. Consult us for restricted items.",
    },
    {
      q: "How do I get a quote for my shipment?",
      a: "Use our online calculator for instant quotes or submit an RFQ for complex shipments. Our team responds to RFQs within 2 hours.",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Customer Support</h1>
            <p className="text-lg text-foreground/70">
              We're here to help. Get answers quickly and connect with our support team.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                <p className="text-sm text-foreground/70 mb-4">Instant messaging support</p>
                <a
                  href="https://wa.me/234XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-semibold text-sm"
                >
                  Chat Now →
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-sm text-foreground/70 mb-4">Call our support team</p>
                <a href="tel:+234XXXXXXXXX" className="text-primary hover:text-primary/80 font-semibold text-sm">
                  +234 XXX XXX XXX →
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-sm text-foreground/70 mb-4">Response within 2 hours</p>
                <a
                  href="mailto:support@.com"
                  className="text-primary hover:text-primary/80 font-semibold text-sm"
                >
                  support@.com →
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                <p className="text-sm text-foreground/70 mb-4">24/7 WhatsApp support</p>
                <div className="text-sm">
                  <p className="text-primary font-semibold">Mon-Fri: 8AM-6PM WAT</p>
                  <p className="text-foreground/60 text-xs">Sat-Sun: Limited support</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Form */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
                  <Input placeholder="What is this about?" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                  <textarea
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white w-full h-12 font-semibold">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-semibold text-foreground">{faq.q}</h3>
                      <span className="text-primary text-xl">{selectedFaq === index ? "−" : "+"}</span>
                    </div>
                    {selectedFaq === index && (
                      <p className="text-foreground/70 mt-4 pt-4 border-t border-border">{faq.a}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
            <CardContent className="pt-12 pb-12">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                <p className="text-white/90 mb-8">
                  Join thousands of satisfied customers. Our support team is ready to assist you 24/7 via WhatsApp.
                </p>
                <a href="https://wa.me/234XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold">
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
