"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Home, Plus, Search, Trash2, Warehouse, X } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { createAdminShipment } from "@/lib/shipping-api"
import { getUsers } from "@/lib/auth-api"
import type { AuthUser } from "@/store/auth"

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
  itemCategory: "",
  amount: "",
  supplierName: "",
  companyName: "",
  phoneNumber: "",
  email: "",
  weight: "",
  length: "",
  width: "",
  height: "",
}

export default function AdminAddShipmentPage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  const [customerId, setCustomerId] = useState("")
  const [customerQuery, setCustomerQuery] = useState("")
  const [customerResults, setCustomerResults] = useState<AuthUser[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<AuthUser | null>(null)
  const [searchingCustomers, setSearchingCustomers] = useState(false)
  const [showCustomerResults, setShowCustomerResults] = useState(false)
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

  const handleSearchCustomers = async () => {
    if (!token) return
    const query = customerQuery.trim().toLowerCase()
    if (!query) {
      setCustomerResults([])
      setShowCustomerResults(false)
      return
    }

    setSearchingCustomers(true)
    try {
      const response = await getUsers("customer", token, 1, 100)
      const users = response.users || []
      const results = users.filter((user) => user.fullName.toLowerCase().includes(query))
      setCustomerResults(results)
      setShowCustomerResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to search customers.")
    } finally {
      setSearchingCustomers(false)
    }
  }

  const handleSelectCustomer = (customer: AuthUser) => {
    setSelectedCustomer(customer)
    setCustomerId(customer._id)
    setCustomerQuery(customer.fullName)
    setShowCustomerResults(false)
    setError("")
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
    setCustomerId("")
    setCustomerQuery("")
    setCustomerResults([])
    setShowCustomerResults(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("You must be logged in to create a shipment.")
      return
    }

    if (!customerId.trim()) {
      setError("Customer ID is required.")
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
        (parcel) => parcel.parcelId.trim() && parcel.itemCategory.trim() && parcel.amount.trim(),
      )
      if (validParcels.length === 0) {
        setError("Please add at least one parcel for consolidation shipments.")
        return
      }
    }

    const payload: any = {
      customerId,
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
        currency: "NGN",
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
        .filter((parcel) => parcel.parcelId.trim() && parcel.itemCategory.trim() && parcel.amount.trim())
        .map((parcel) => ({
          parcelId: parcel.parcelId,
          itemCategory: parcel.itemCategory,
          amount: Number(parcel.amount) || 1,
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
      await createAdminShipment(payload, token)
      router.push("/admin/shipments")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create shipment.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create Shipment For Customer</h1>
        <p className="text-foreground/60 text-sm md:text-base">Use admin endpoint to create shipment for an existing customer.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Search and select the customer by name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Search customer name"
                value={customerQuery}
                onChange={(e) => {
                  setCustomerQuery(e.target.value)
                  if (selectedCustomer) {
                    setSelectedCustomer(null)
                    setCustomerId("")
                  }
                }}
                onFocus={() => {
                  if (customerResults.length > 0) setShowCustomerResults(true)
                }}
                required
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSearchCustomers}
                className="absolute right-1 top-1 h-8"
                disabled={searchingCustomers}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {showCustomerResults ? (
              <div className="rounded-lg border border-border bg-background max-h-56 overflow-auto">
                {searchingCustomers ? (
                  <p className="px-3 py-2 text-sm text-foreground/60">Searching...</p>
                ) : customerResults.length > 0 ? (
                  customerResults.map((customer) => (
                    <button
                      key={customer._id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted/50 border-b last:border-b-0 border-border"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <p className="text-sm font-semibold text-foreground">{customer.fullName}</p>
                      <p className="text-xs text-foreground/60">{customer.email}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-foreground/60">No customer found.</p>
                )}
              </div>
            ) : null}

            {selectedCustomer ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedCustomer.fullName}</p>
                  <p className="text-xs text-foreground/60">ID: {selectedCustomer.customerId}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={handleClearCustomer}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : null}

            <input type="hidden" value={customerId} />
          </CardContent>
        </Card>

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
              {shipmentType === "CONSOLIDATION" && <option value="AIR_EXPRESS">Air Express</option>}
              <option value="SEA_CBM">Sea CBM</option>
              <option value="SEA_20FT">Sea 20ft Container</option>
              <option value="SEA_40FT">Sea 40ft Container</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Method</CardTitle>
            <CardDescription>Choose how this shipment should be delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "HOME_DELIVERY",
                  label: "Home Delivery",
                  icon: Home,
                  description: "Delivered directly to customer door",
                },
                {
                  value: "WAREHOUSE_PICKUP",
                  label: "Warehouse Pickup",
                  icon: Warehouse,
                  description: "Customer picks up from warehouse",
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
                    type='tel'
                    placeholder="+86 138 0000 0000"
                    value={singleShipment.phoneNumber}
                    onChange={handleSingleShipmentChange}
                    maxLength={20}
                    pattern="^\+?[1-9]\d{7,14}$"
                    title="Enter a valid phone number (8–15 digits, optional + prefix)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Supplier Email</label>
                  <Input
                    name="email"
                    placeholder="supplier@example.com"
                    value={singleShipment.email}
                    onChange={handleSingleShipmentChange}
                    maxLength={100}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Enter a valid email address"
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
              <CardDescription>Add parcel information for consolidation shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parcels.map((parcel, index) => (
                <div key={index} className="rounded-xl border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">Parcel {index + 1}</p>
                    {parcels.length > 1 ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeParcel(index)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Parcel ID"
                      value={parcel.parcelId}
                      onChange={(e) => handleParcelChange(index, "parcelId", e.target.value)}
                    />
                    <Input
                      placeholder="Item Category"
                      value={parcel.itemCategory}
                      onChange={(e) => handleParcelChange(index, "itemCategory", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Item Quantity"
                      value={parcel.amount}
                      onChange={(e) => handleParcelChange(index, "amount", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addParcel}>
                <Plus className="w-4 h-4 mr-2" /> Add Parcel
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Describe shipment contents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">Item {index + 1}</p>
                  {items.length > 1 ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
                  <Input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                  <Input type="number" placeholder="Weight" value={item.weight} onChange={(e) => handleItemChange(index, "weight", e.target.value)} />
                  <Input type="number" placeholder="Value" value={item.value} onChange={(e) => handleItemChange(index, "value", e.target.value)} />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cosignees</CardTitle>
            <CardDescription>Add one or more destination contacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cosignees.map((cosignee, index) => (
              <div key={index} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">Cosignee {index + 1}</p>
                  {cosignees.length > 1 ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeCosignee(index)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Name" value={cosignee.name} onChange={(e) => handleCosigneeChange(index, "name", e.target.value)} />
                  <Input placeholder="Phone" value={cosignee.phone} onChange={(e) => handleCosigneeChange(index, "phone", e.target.value)} />
                  <Input type="email" placeholder="Email" value={cosignee.email} onChange={(e) => handleCosigneeChange(index, "email", e.target.value)} />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addCosignee}>
              <Plus className="w-4 h-4 mr-2" /> Add Cosignee
            </Button>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/shipments")}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Shipment"}
          </Button>
        </div>
      </form>
    </div>
  )
}
