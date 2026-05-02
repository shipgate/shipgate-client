"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Home, Warehouse } from "lucide-react"

export default function AddShipmentPage() {
  const [formData, setFormData] = useState({
    shippingType: "air",
    senderName: "",
    deliveryMethod: "home-delivery",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    itemDescription: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.senderName || !formData.senderPhone || !formData.recipientName || !formData.weight) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Shipment created successfully! Tracking number: TRK-2024-NEW")
    setFormData({
      shippingType: "air",
      senderName: "",
      deliveryMethod: "home-delivery",
      senderPhone: "",
      recipientName: "",
      recipientAddress: "",
      recipientPhone: "",
      itemDescription: "",
      weight: "",
      length: "",
      width: "",
      height: "",
    })
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create New Shipment</h1>
        <p className="text-foreground/60 text-sm md:text-base">Fill in the details to start a new shipment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Type */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
            <CardDescription>Choose how you want to ship</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              name="shippingType"
              value={formData.shippingType}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg bg-background"
            >
              <option value="air">Air Shipping ($8.9/kg)</option>
              <option value="sea-cbm">Sea Shipping - CBM ($510/CBM)</option>
              <option value="sea-20ft">Sea Shipping - 20ft Container ($5400)</option>
              <option value="sea-40ft">Sea Shipping - 40ft Container ($7200)</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Method</CardTitle>
            <CardDescription>Choose how you want to receive your shipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "home-delivery",
                  label: "Home Delivery",
                  icon: Home,
                  description: "Delivered to your address",
                },
                {
                  value: "warehouse-pickup",
                  label: "Warehouse Pickup",
                  icon: Warehouse,
                  description: "Pick up at our warehouse",
                },
              ].map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: option.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
                      formData.deliveryMethod === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-foreground/60">{option.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sender Details */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Sender Details</CardTitle>
            <CardDescription>Your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  name="senderName"
                  placeholder="Your full name"
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number *</label>
                <Input
                  name="senderPhone"
                  placeholder="Your phone number"
                  value={formData.senderPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Recipient Details */}
        <Card>
          <CardHeader>
            <CardTitle>Recipient Details</CardTitle>
            <CardDescription>Recipient information in Nigeria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  name="recipientName"
                  placeholder="Recipient's full name"
                  value={formData.recipientName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input
                  name="recipientPhone"
                  placeholder="Recipient's phone number"
                  value={formData.recipientPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <Input
                  name="recipientAddress"
                  placeholder="Recipient's Address"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>What are you shipping?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Item Description</label>
              <textarea
                name="itemDescription"
                placeholder="Describe what you're shipping..."
                value={formData.itemDescription}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg bg-background resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Weight (kg) *</label>
              <Input
                type="number"
                name="weight"
                placeholder="Enter weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            {/* Dimensions for volumetric weight */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Dimensions (Optional - for volumetric weight)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Length (cm)</label>
                  <Input type="number" name="length" placeholder="L" value={formData.length} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Width (cm)</label>
                  <Input type="number" name="width" placeholder="W" value={formData.width} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Height (cm)</label>
                  <Input type="number" name="height" placeholder="H" value={formData.height} onChange={handleChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
        >
          {loading ? "Creating Shipment..." : "Create Shipment"}
        </Button>
      </form>
    </div>
  )
}
