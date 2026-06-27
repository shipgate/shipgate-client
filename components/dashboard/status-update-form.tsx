"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, PackageCheck, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/auth"
import {
  TrackingStage,
  TrackingStageStatus,
  updateTrackingStage,
} from "@/lib/shipping-api"

const TRACKING_STAGES: Array<{ value: TrackingStage; label: string; helper: string }> = [
  { value: "PACKAGE_RECEIVED", label: "Package Received", helper: "Shipment is confirmed at origin." },
  { value: "IN_CUSTOMS", label: "In Customs", helper: "Shipment is being processed by customs." },
  { value: "IN_TRANSIT", label: "In Transit", helper: "Shipment is moving between facilities." },
  {
    value: "ARRIVED_NIGERIAN_CUSTOMS",
    label: "Arrived Nigerian Customs",
    helper: "Shipment has reached Nigerian customs.",
  },
  { value: "ARRIVED_WAREHOUSE", label: "Arrived Warehouse", helper: "Shipment is available at the warehouse." },
  { value: "PENDING_DELIVERY", label: "Pending Delivery", helper: "Shipment is queued for final delivery." },
]

const STAGE_STATUSES: Array<{ value: TrackingStageStatus; label: string }> = [
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
]

interface ParcelUpdate {
  parcelId: string
  status: TrackingStage | ""
}

interface StatusUpdateFormProps {
  title: string
  description: string
  searchDescription: string
  submitLabel?: string
  successDetail: string
}

export function StatusUpdateForm({
  title,
  description,
  searchDescription,
  submitLabel = "Update Tracking",
  successDetail,
}: StatusUpdateFormProps) {
  const token = useAuthStore((state) => state.token)
  const [shipmentNumber, setShipmentNumber] = useState("")
  const [stage, setStage] = useState<TrackingStage>("IN_TRANSIT")
  const [status, setStatus] = useState<TrackingStageStatus>("COMPLETED")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [parcelUpdates, setParcelUpdates] = useState<ParcelUpdate[]>([{ parcelId: "", status: "" }])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const selectedStage = TRACKING_STAGES.find((item) => item.value === stage)
  const canSubmit = Boolean(token && shipmentNumber.trim() && stage && status && !submitting)

  const updateParcel = (index: number, field: keyof ParcelUpdate, value: string) => {
    setParcelUpdates((current) =>
      current.map((parcel, parcelIndex) => (parcelIndex === index ? { ...parcel, [field]: value } : parcel)),
    )
  }

  const addParcelUpdate = () => {
    setParcelUpdates((current) => [...current, { parcelId: "", status: "" }])
  }

  const removeParcelUpdate = (index: number) => {
    setParcelUpdates((current) =>
      current.length === 1 ? [{ parcelId: "", status: "" }] : current.filter((_, parcelIndex) => parcelIndex !== index),
    )
  }

  const resetForm = () => {
    setStage("IN_TRANSIT")
    setStatus("COMPLETED")
    setLocation("")
    setNotes("")
    setParcelUpdates([{ parcelId: "", status: "" }])
  }

  const handleSubmit = async () => {
    if (!token) {
      setError("You need to be signed in to update tracking.")
      return
    }

    const normalizedShipmentNumber = shipmentNumber.trim()
    if (!normalizedShipmentNumber) {
      setError("Enter a shipment number before submitting.")
      return
    }

    setSubmitting(true)
    setError("")
    setMessage("")

    try {
      const payload: Parameters<typeof updateTrackingStage>[1] = {
        stage,
        status,
      }
      const trimmedLocation = location.trim()
      const trimmedNotes = notes.trim()
      const validParcelUpdates = parcelUpdates.filter((parcel) => parcel.parcelId.trim() && parcel.status)

      if (trimmedLocation) payload.location = trimmedLocation
      if (trimmedNotes) payload.notes = trimmedNotes
      if (validParcelUpdates.length > 0) {
        payload.parcelUpdates = validParcelUpdates.map((parcel) => ({
          parcelId: parcel.parcelId.trim(),
          status: parcel.status,
        }))
      }

      const response = await updateTrackingStage(normalizedShipmentNumber, payload, token)
      setMessage(response.message || "Tracking updated successfully.")
      setShipmentNumber(normalizedShipmentNumber)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update tracking.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-foreground/60">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment</CardTitle>
          <CardDescription>{searchDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-4 w-4 h-4 text-foreground/40" />
              <Input
                value={shipmentNumber}
                onChange={(event) => setShipmentNumber(event.target.value)}
                placeholder="SHIP-1685000000000-1"
                className="h-12 pl-10 font-mono"
              />
            </div>
            <Button onClick={handleSubmit} disabled={!canSubmit} className="h-12">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
              {submitLabel}
            </Button>
          </div>
          {!token ? (
            <p className="mt-3 text-sm text-destructive">Sign in with an admin or operational staff account.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/15">
        <CardHeader className="bg-primary/5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <CardTitle>Tracking Stage</CardTitle>
              <CardDescription>{selectedStage?.helper}</CardDescription>
            </div>
            <Badge className="w-fit">{status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Stage</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TRACKING_STAGES.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setStage(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    stage === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-xs text-foreground/60 mt-1">{option.value}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TrackingStageStatus)}
                className="h-12 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STAGE_STATUSES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Location</label>
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Beijing Sorting Center"
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Departed on schedule"
              rows={4}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="text-sm font-semibold text-foreground">Parcel Updates</label>
                <p className="text-xs text-foreground/60">Optional for consolidation shipments.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addParcelUpdate}>
                <Plus className="w-4 h-4" />
                Add Parcel
              </Button>
            </div>

            <div className="space-y-3">
              {parcelUpdates.map((parcel, index) => (
                <div key={index} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 rounded-lg border border-border p-3">
                  <Input
                    value={parcel.parcelId}
                    onChange={(event) => updateParcel(index, "parcelId", event.target.value)}
                    placeholder="Parcel ID"
                    className="h-11"
                  />
                  <select
                    value={parcel.status}
                    onChange={(event) => updateParcel(index, "status", event.target.value)}
                    className="h-11 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Parcel status</option>
                    {TRACKING_STAGES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button type="button" variant="outline" size="icon" onClick={() => removeParcelUpdate(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : null}

          {message ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">{message}</p>
                <p className="text-sm text-green-800">{successDetail}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
