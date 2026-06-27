import { StatusUpdateForm } from "@/components/dashboard/status-update-form"

export default function StaffStatusUpdates() {
  return (
    <StatusUpdateForm
      title="Update Tracking Status"
      description="Record operational tracking updates for active shipments."
      searchDescription="Enter the shipment number from the package label or shipment record."
      submitLabel="Update Tracking"
      successDetail="Tracking timeline has been updated."
    />
  )
}
