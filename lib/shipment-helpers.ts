// Timeline stages in order
const TIMELINE_STAGES = [
  { stage: "PACKAGE_RECEIVED", label: "Shipment Created" },
  { stage: "IN_CUSTOMS", label: "In Customs" },
  { stage: "IN_TRANSIT", label: "In Transit" },
  { stage: "ARRIVED_NIGERIAN_CUSTOMS", label: "Arrived Nigerian Customs" },
  { stage: "ARRIVED_WAREHOUSE", label: "Arrived Warehouse" },
  { stage: "PENDING_DELIVERY", label: "Pending Delivery" },
]

interface ShipmentTimelineEvent {
  location: string
  status: string
  timestamp: string
  completed: boolean
  details: string
}

/**
 * Build a complete timeline from existing tracking history and current status
 */
export function buildTimelineFromShipment(shipment: any): ShipmentTimelineEvent[] {
  // If tracking history exists, use it as-is
  if (Array.isArray(shipment?.tracking) && shipment.tracking.length > 0) {
    return shipment.tracking
  }

  if (Array.isArray(shipment?.timeline) && shipment.timeline.length > 0) {
    return shipment.timeline
  }

  // Otherwise, build from current status
  const currentStatus = shipment?.currentStatus || shipment?.status || "PENDING_PICKUP"
  const timeline: ShipmentTimelineEvent[] = []

  // Find the index of the current status
  const currentStageIndex = TIMELINE_STAGES.findIndex((s) => s.stage === currentStatus)

  TIMELINE_STAGES.forEach((stageConfig, index) => {
    const isCompleted = index <= currentStageIndex && currentStageIndex !== -1
    const isCurrent = index === currentStageIndex

    timeline.push({
      location: shipment?.currentLocation || "In Transit",
      status: stageConfig.label,
      timestamp: isCompleted ? new Date(shipment?.updatedAt || Date.now()).toLocaleString() : "Pending",
      completed: isCompleted,
      details: isCompleted
        ? `${stageConfig.label} - ${isCurrent ? "Current stage" : "Completed"}`
        : `${stageConfig.label} - Awaiting this stage`,
    })
  })

  return timeline
}

/**
 * Get badge styling based on shipment status
 */
export function getStatusBadgeClass(status: string): string {
  const normalizedStatus = status?.toString().toUpperCase() || ""

  switch (normalizedStatus) {
    case "DELIVERED":
    case "OUT_FOR_DELIVERY":
      return "bg-green-500 text-white"
    case "IN_TRANSIT":
    case "IN_CUSTOMS":
    case "ARRIVED_CUSTOMS":
    case "ARRIVED_NIGERIAN_CUSTOMS":
    case "ARRIVED_WAREHOUSE":
      return "bg-blue-500 text-white"
    case "PENDING_PICKUP":
    case "PENDING_DELIVERY":
    case "PENDING":
      return "bg-yellow-500 text-black"
    case "CANCELLED":
    case "CANCELED":
      return "bg-destructive text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

/**
 * Format status label for display
 */
export function formatStatusLabel(status: string): string {
  return status
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown"
}

/**
 * Determine if shipment is by air or sea based on method
 */
export function isAirShipment(shipmentMethod: string): boolean {
  return shipmentMethod?.toUpperCase() === "AIR"
}

export function isSeaShipment(shipmentMethod: string): boolean {
  const method = shipmentMethod?.toUpperCase() || ""
  return method.includes("SEA") || method.includes("CBM") || method.includes("FT")
}
