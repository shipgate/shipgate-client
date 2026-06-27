import { StatusUpdateForm } from "@/components/dashboard/status-update-form"

export default function AdminStatusUpdates() {
  return (
    <StatusUpdateForm
      title="Update Shipment Status"
      description="Post tracking stage updates for any shipment."
      searchDescription="Enter the shipment number you want to update."
      submitLabel="Confirm Status Update"
      successDetail="Customer-facing tracking has been updated."
    />
  )
}
