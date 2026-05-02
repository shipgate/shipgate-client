"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export function RFQForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    shippingType: "air",
    origin: "Shanghai, China",
    destination: "Lagos, Nigeria",
    weight: "",
    cbm: "",
    containerType: "20ft",
    items: "",
    specialRequirements: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Request for Quote (RFQ)</CardTitle>
          <CardDescription>
            Submit your shipping requirements for a personalized quote. We'll respond within 2 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">Quote request submitted!</p>
              <p className="text-green-600 text-sm">We'll contact you shortly with a detailed quote.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Shipping Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Shipping Type</label>
                  <select
                    name="shippingType"
                    value={formData.shippingType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="air">Air Shipping</option>
                    <option value="sea">Sea Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Items Description</label>
                  <Input
                    type="text"
                    name="items"
                    value={formData.items}
                    onChange={handleChange}
                    placeholder="What are you shipping?"
                    required
                  />
                </div>
                {formData.shippingType === "air" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                    <Input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                )}
                {formData.shippingType === "sea" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">CBM Volume</label>
                      <Input type="number" name="cbm" value={formData.cbm} onChange={handleChange} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Container Type</label>
                      <select
                        name="containerType"
                        value={formData.containerType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="20ft">20ft Container</option>
                        <option value="40ft">40ft Container</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any special handling, fragile items, temperature control, etc."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit RFQ
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
