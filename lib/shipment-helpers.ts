// Timeline stages in order
const TIMELINE_STAGES = [
  { stage: "SHIPMENT_CREATED", label: "Shipment Created" },
  { stage: "PACKAGE_RECEIVED", label: "Package Received" },
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
  parcelUpdates?: Array<{ parcelId: string; previousStatus?: string; newStatus?: string }>
}

/**
 * Build a complete timeline from existing tracking history and current status
 */
export function buildTimelineFromShipment(shipment: any): ShipmentTimelineEvent[] {
  // If explicit tracking history exists, use it as-is
  if (Array.isArray(shipment?.tracking) && shipment.tracking.length > 0) {
    return shipment.tracking
  }

  if (Array.isArray(shipment?.timeline) && shipment.timeline.length > 0) {
    return shipment.timeline
  }

  if (Array.isArray(shipment?.trackingTimeline) && shipment.trackingTimeline.length > 0) {
    const mappedTimeline: ShipmentTimelineEvent[] = shipment.trackingTimeline.map((event: any) => ({
      location: event.location || shipment?.currentLocation || "In Transit",
      status: event.stage || event.status || "Unknown",
      timestamp: event.completedAt || event.updatedAt || new Date().toLocaleString(),
      completed: event.status === "COMPLETED" || event.stageStatus === "COMPLETED" || false,
      details: event.notes || event.details || `${event.stage || event.status || "Stage"} updated`,
      parcelUpdates: Array.isArray(event.parcelUpdates)
        ? event.parcelUpdates.map((update: any) => ({
            parcelId: update.parcelId,
            previousStatus: update.previousStatus,
            newStatus: update.newStatus || update.status,
          }))
        : Array.isArray(event.parcelStatus)
        ? event.parcelStatus.map((update: any) => ({
            parcelId: update.parcelId,
            previousStatus: update.previousStatus,
            newStatus: update.newStatus || update.status,
          }))
        : undefined,
    }))

    const createdEventExists = mappedTimeline.some((event: ShipmentTimelineEvent) =>
      ["SHIPMENT_CREATED", "Shipment Created", "shipment_created", "shipment created"].includes(
        `${event.status}`.toString().toUpperCase().replace(/ /g, "_")
      )
    )

    if (!createdEventExists) {
      mappedTimeline.unshift({
        location: shipment?.origin || shipment?.currentLocation || "Origin",
        status: "Shipment Created",
        timestamp: shipment?.createdAt || new Date().toLocaleString(),
        completed: true,
        details: "Shipment record created",
        parcelUpdates: [],
      })
    }

    return mappedTimeline
  }

  // Otherwise, build from current status
  const currentStatus = shipment?.currentStatus || shipment?.status || "PENDING_PICKUP"
  const timeline: ShipmentTimelineEvent[] = []

  // Find the index of the current status
  const currentStageIndex = TIMELINE_STAGES.findIndex((s) => s.stage === currentStatus)

  TIMELINE_STAGES.forEach((stageConfig, index) => {
    const isCreatedStage = stageConfig.stage === "SHIPMENT_CREATED"
    const isCompleted = isCreatedStage || (currentStageIndex !== -1 && index <= currentStageIndex)
    const isCurrent = index === currentStageIndex

    timeline.push({
      location: shipment?.currentLocation || "In Transit",
      status: stageConfig.label,
      timestamp: isCompleted ? new Date(shipment?.updatedAt || shipment?.createdAt || Date.now()).toLocaleString() : "Pending",
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
