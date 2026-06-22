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
const normalizeStage = (value: string | undefined) =>
  value
    ?.toString()
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, "_") || ""

const getStageLabel = (stageKey: string) =>
  TIMELINE_STAGES.find(
    (stage) => normalizeStage(stage.stage) === stageKey || normalizeStage(stage.label) === stageKey
  )?.label

const getStageIndex = (stageKey: string) =>
  TIMELINE_STAGES.findIndex(
    (stage) => normalizeStage(stage.stage) === stageKey || normalizeStage(stage.label) === stageKey
  )

function mapTrackingTimelineEvent(event: any, shipment: any): ShipmentTimelineEvent {
  const stageKey = normalizeStage(event.stage || event.status || event.stageName || event.type)
  const statusLabel =
    getStageLabel(stageKey) || event.label || event.stage || event.status || "Unknown"

  return {
    location: event.location || shipment?.currentLocation || "In Transit",
    status: statusLabel,
    timestamp: event.completedAt || event.updatedAt || shipment?.updatedAt || new Date().toLocaleString(),
    completed:
      event.completed === true ||
      event.status === "COMPLETED" ||
      event.stageStatus === "COMPLETED" ||
      ["DELIVERED", "PACKAGE_RECEIVED", "IN_CUSTOMS", "IN_TRANSIT", "ARRIVED_NIGERIAN_CUSTOMS", "ARRIVED_WAREHOUSE", "PENDING_DELIVERY", "SHIPMENT_CREATED"].includes(
        normalizeStage(event.status || event.stage),
      ),
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
  }
}

export function buildTimelineFromShipment(shipment: any): ShipmentTimelineEvent[] {
  // If explicit tracking history exists, merge it with the full stage list so pending stages remain visible.
  if (Array.isArray(shipment?.trackingTimeline) && shipment.trackingTimeline.length > 0) {
    const normalizedTimeline = shipment.trackingTimeline.map((event: any) => mapTrackingTimelineEvent(event, shipment))
    const eventsByStage = new Map<string, ShipmentTimelineEvent>()

    normalizedTimeline.forEach((event: ShipmentTimelineEvent) => {
      const stageKey = normalizeStage(event.status)
      eventsByStage.set(stageKey, event)
    })

    const currentStageKey = normalizeStage(shipment?.currentStatus || shipment?.status)
    let currentStageIndex = getStageIndex(currentStageKey)

    if (currentStageIndex === -1) {
      currentStageIndex = normalizedTimeline
        .map((event: ShipmentTimelineEvent) => getStageIndex(normalizeStage(event.status)))
        .filter((index: number) => index >= 0)
        .sort((a: number, b: number) => b - a)[0] ?? -1
    }

    const timeline = TIMELINE_STAGES.map((stageConfig, index) => {
      const stageKey = normalizeStage(stageConfig.stage)
      const existing = eventsByStage.get(stageKey)

      if (existing) {
        return existing
      }

      const isCompleted = currentStageIndex !== -1 && index <= currentStageIndex
      const isCurrent = index === currentStageIndex

      return {
        location: shipment?.currentLocation || shipment?.origin || "In Transit",
        status: stageConfig.label,
        timestamp: isCompleted
          ? new Date(shipment?.updatedAt || shipment?.createdAt || Date.now()).toLocaleString()
          : "Pending",
        completed: isCompleted,
        details: isCompleted
          ? `${stageConfig.label} - ${isCurrent ? "Current stage" : "Completed"}`
          : `${stageConfig.label} - Awaiting this stage`,
      }
    })

    const extraEvents = normalizedTimeline.filter((event: ShipmentTimelineEvent) => {
      const normalizedStatus = normalizeStage(event.status)
      return !TIMELINE_STAGES.some(
        (stage) => normalizeStage(stage.stage) === normalizedStatus || normalizeStage(stage.label) === normalizedStatus,
      )
    })

    return [...timeline, ...extraEvents]
  }

  if (Array.isArray(shipment?.tracking) && shipment.tracking.length > 0) {
    return shipment.tracking
  }

  if (Array.isArray(shipment?.timeline) && shipment.timeline.length > 0) {
    return shipment.timeline
  }

  const currentStatus = shipment?.currentStatus || shipment?.status || "PENDING_PICKUP"
  const timeline: ShipmentTimelineEvent[] = []
  const currentStageIndex = getStageIndex(normalizeStage(currentStatus))

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
