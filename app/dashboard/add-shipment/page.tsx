"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Home, Warehouse, Plus, Trash2 } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { createShipment } from "@/lib/shipping-api"

const defaultSingleShipment = {
  supplierName: "",
  companyName: "",
  phoneNumber: "",
  email: "",
  supplierAddress: "",
}

const defaultItem = {
  description: "",
  quantity: "",
  weight: "",
  value: "",
}

const defaultCosignee = {
  name: "",
  phone: "",
  email: "",
}

const defaultParcel = {
  parcelId: "",
  supplierName: "",
  companyName: "",
  phoneNumber: "",
  email: "",
  weight: "",
  length: "",
  width: "",
  height: "",
}

export default function AddShipmentPage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  const [shipmentType, setShipmentType] = useState("SINGLE")
  const [shipmentMethod, setShipmentMethod] = useState("AIR")
  const [deliveryMethod, setDeliveryMethod] = useState("HOME_DELIVERY")
  const [singleShipment, setSingleShipment] = useState(defaultSingleShipment)
  const [items, setItems] = useState([defaultItem])
  const [parcels, setParcels] = useState([defaultParcel])
  const [cosignees, setCosignees] = useState([defaultCosignee])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSingleShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSingleShipment((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
    setError("")
  }

  const handleParcelChange = (index: number, field: string, value: string) => {
    setParcels((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
    setError("")
  }

  const handleCosigneeChange = (index: number, field: string, value: string) => {
    setCosignees((prev) => prev.map((cosignee, idx) => (idx === index ? { ...cosignee, [field]: value } : cosignee)))
    setError("")
  }

  const addItem = () => setItems((prev) => [...prev, { ...defaultItem }])
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, idx) => idx !== index))
  const addParcel = () => setParcels((prev) => [...prev, { ...defaultParcel }])
  const removeParcel = (index: number) => setParcels((prev) => prev.filter((_, idx) => idx !== index))
  const addCosignee = () => setCosignees((prev) => [...prev, { ...defaultCosignee }])
  const removeCosignee = (index: number) => setCosignees((prev) => prev.filter((_, idx) => idx !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("You must be logged in to create a shipment.")
      return
    }

    if (shipmentType === "SINGLE") {
      if (!singleShipment.supplierName.trim()) {
        setError("Supplier name is required for single shipments.")
        return
      }
      if (!singleShipment.phoneNumber.trim()) {
        setError("Supplier phone number is required for single shipments.")
        return
      }
      if (!singleShipment.email.trim()) {
        setError("Supplier email is required for single shipments.")
        return
      }
    }

    const validItems = items.filter((item) => item.description.trim())

    if (shipmentType === "CONSOLIDATION") {
      const validParcels = parcels.filter(
        (parcel) =>
          parcel.parcelId.trim() &&
          parcel.supplierName.trim() &&
          parcel.companyName.trim() &&
          parcel.phoneNumber.trim() &&
          parcel.email.trim(),
      )
      if (validParcels.length === 0) {
        setError("Please add at least one parcel with supplier details for consolidation shipments.")
        return
      }
    }

    const payload: any = {
      shipmentType,
      shipmentMethod,
      deliveryMethod,
      cosignees: cosignees
        .filter((cosignee) => cosignee.name.trim() || cosignee.email.trim() || cosignee.phone.trim())
        .map((cosignee) => ({
          name: cosignee.name,
          phoneNumber: cosignee.phone,
          email: cosignee.email,
        })),
    }

    if (validItems.length > 0) {
      payload.items = validItems.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity) || 1,
        weight: Number(item.weight) || 0,
        unitPrice: Number(item.value) || 0,
        currency: "USD",
      }))
    }

    if (shipmentType === "SINGLE") {
      payload.singleShipment = {
        supplierName: singleShipment.supplierName,
        companyName: singleShipment.companyName,
        phoneNumber: singleShipment.phoneNumber,
        email: singleShipment.email,
        supplierAddress: singleShipment.supplierAddress,
      }
    }

    if (shipmentType === "CONSOLIDATION") {
      payload.parcels = parcels
        .filter(
          (parcel) =>
            parcel.parcelId.trim() &&
            parcel.supplierName.trim() &&
            parcel.companyName.trim() &&
            parcel.phoneNumber.trim() &&
            parcel.email.trim(),
        )
        .map((parcel) => ({
          parcelId: parcel.parcelId,
          supplierName: parcel.supplierName,
          companyName: parcel.companyName,
          phoneNumber: parcel.phoneNumber,
          email: parcel.email,
          weight: Number(parcel.weight) || 0,
          length: Number(parcel.length) || 0,
          width: Number(parcel.width) || 0,
          height: Number(parcel.height) || 0,
        }))
    }

    setLoading(true)

    try {
      await createShipment(payload, token)
      router.push("/dashboard/shipments")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create shipment.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create New Shipment</h1>
        <p className="text-foreground/60 text-sm md:text-base">Use the official shipment form and submit directly to the shipping API.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Type</CardTitle>
            <CardDescription>Choose a single shipment or consolidation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: "SINGLE", label: "Single Shipment" },
                { value: "CONSOLIDATION", label: "Consolidation" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setShipmentType(option.value)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    shipmentType === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold text-foreground">{option.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
            <CardDescription>Choose your preferred transport route</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              value={shipmentMethod}
              onChange={(e) => setShipmentMethod(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background"
            >
              <option value="AIR">Air</option>
              <option value="SEA_CBM">Sea CBM</option>
              <option value="SEA_20FT">Sea 20ft Container</option>
              <option value="SEA_40FT">Sea 40ft Container</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Method</CardTitle>
            <CardDescription>Choose how your shipment should be delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "HOME_DELIVERY",
                  label: "Home Delivery",
                  icon: Home,
                  description: "Delivered directly to your door",
                },
                {
                  value: "WAREHOUSE_PICKUP",
                  label: "Warehouse Pickup",
                  icon: Warehouse,
                  description: "Pick up from the warehouse",
                },
              ].map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDeliveryMethod(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
                      deliveryMethod === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mt-1 shrink-0 text-primary" />
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

        {shipmentType === "SINGLE" ? (
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
              <CardDescription>Details required for single shipments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Supplier Name *</label>
                  <Input
                    name="supplierName"
                    placeholder="Supplier Co."
                    value={singleShipment.supplierName}
                    onChange={handleSingleShipmentChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Supplier Phone</label>
                  <Input
                    name="phoneNumber"
                    placeholder="+86 138 0000 0000"
                    value={singleShipment.phoneNumber}
                    onChange={handleSingleShipmentChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Supplier Email</label>
                  <Input
                    name="email"
                    placeholder="supplier@example.com"
                    value={singleShipment.email}
                    onChange={handleSingleShipmentChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Supplier Address</label>
                  <Input
                    name="supplierAddress"
                    placeholder="Shanghai, China"
                    value={singleShipment.supplierAddress}
                    onChange={handleSingleShipmentChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Parcels</CardTitle>
              <CardDescription>Add parcel details for consolidation shipments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parcels.map((parcel, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">Parcel #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeParcel(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Parcel ID"
                      value={parcel.parcelId}
                      onChange={(e) => handleParcelChange(index, "parcelId", e.target.value)}
                    />
                    <Input
                      placeholder="Supplier Name"
                      value={parcel.supplierName}
                      onChange={(e) => handleParcelChange(index, "supplierName", e.target.value)}
                    />
                    <Input
                      placeholder="Company Name"
                      value={parcel.companyName}
                      onChange={(e) => handleParcelChange(index, "companyName", e.target.value)}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={parcel.phoneNumber}
                      onChange={(e) => handleParcelChange(index, "phoneNumber", e.target.value)}
                    />
                    <Input
                      placeholder="Supplier Email"
                      value={parcel.email}
                      onChange={(e) => handleParcelChange(index, "email", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={parcel.weight}
                      onChange={(e) => handleParcelChange(index, "weight", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Length (cm)"
                      value={parcel.length}
                      onChange={(e) => handleParcelChange(index, "length", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Width (cm)"
                      value={parcel.width}
                      onChange={(e) => handleParcelChange(index, "width", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Height (cm)"
                      value={parcel.height}
                      onChange={(e) => handleParcelChange(index, "height", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addParcel} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Parcel
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Optional item data. You can submit a shipment without items if parcel/supplier details are complete.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">Item #{index + 1}</p>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Weight (kg)"
                    value={item.weight}
                    onChange={(e) => handleItemChange(index, "weight", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) => handleItemChange(index, "value", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cosignees</CardTitle>
            <CardDescription>Add one or more cosignees for this shipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cosignees.map((cosignee, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">Cosignee #{index + 1}</p>
                  {cosignees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCosignee(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Name"
                    value={cosignee.name}
                    onChange={(e) => handleCosigneeChange(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={cosignee.phone}
                    onChange={(e) => handleCosigneeChange(index, "phone", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    value={cosignee.email}
                    onChange={(e) => handleCosigneeChange(index, "email", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addCosignee} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Cosignee
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
          {loading ? "Creating Shipment..." : "Create Shipment"}
        </Button>
      </form>
    </div>
  )
}
