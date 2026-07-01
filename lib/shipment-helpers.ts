// Timeline stages in order
const TIMELINE_STAGES = [
  { stage: "SHIPMENT_CREATED", label: "Shipment Created", description: "We’ve received your shipment details and are expecting your package at our warehouse." },
  { stage: "PACKAGE_RECEIVED", label: "Received at Shipgate Warehouse in China", description: "Your package has arrived at our warehouse and has been received, inspected, and processed." },
  { stage: "IN_CUSTOMS", label: "Arrived at [location]", description: "Your shipment has arrived at [location] and is being prepared for international departure." },
  { stage: "IN_TRANSIT", label: "In Transit", description: "Your shipment is in transit and has arrived at the [location]." },
  { stage: "ARRIVED_NIGERIAN_CUSTOMS", label: "Arrived in Nigeria", description: "Your shipment has arrived at [location] and is awaiting customs clearance." },
  { stage: "ARRIVED_WAREHOUSE", label: "Ready for Pickup", description: "Your shipment has arrived at our local Shipgate warehouse and is ready for pickup." },
  { stage: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "Your shipment has been dispatched and is on its way to your delivery address." },
  { stage: "COMPLETED", label: "Shipment Completed", description: "Your shipment has been successfully received by you and signed for." },
]

interface ShipmentTimelineEvent {
  stageKey?: string
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

const getStageConfig = (stageKey: string) =>
  TIMELINE_STAGES.find(
    (stage) => normalizeStage(stage.stage) === stageKey || normalizeStage(stage.label) === stageKey
  )

const getStageIndex = (stageKey: string) =>
  TIMELINE_STAGES.findIndex(
    (stage) => normalizeStage(stage.stage) === stageKey || normalizeStage(stage.label) === stageKey
  )

const getShipmentMethod = (shipment: any) =>
  String(shipment?.shipmentMethod || shipment?.shippingMethod || shipment?.shippingType || shipment?.method || "").toUpperCase()

const isAirShipmentMethod = (shipment: any) => getShipmentMethod(shipment) === "AIR"

const getDefaultTimelineLocation = (stageKey: string, shipment: any) => {
  const normalizedStage = normalizeStage(stageKey)
  const air = isAirShipmentMethod(shipment)

  switch (normalizedStage) {
    case "IN_CUSTOMS":
      return air ? "Hong Kong Airport" : "Chinese Seaport"
    case "IN_TRANSIT":
      return "Addis Ababa transit hub"
    case "ARRIVED_NIGERIAN_CUSTOMS":
      return air ? "Lagos International Airport" : "Apapa sea port"
    default:
      return shipment?.currentLocation || shipment?.origin || "In Transit"
  }
}

const getResolvedTimelineLocation = (stageKey: string, shipment: any, fallbackLocation?: string) => {
  const explicitLocation = fallbackLocation?.toString().trim()
  return explicitLocation || getDefaultTimelineLocation(stageKey, shipment)
}

const getResolvedStageText = (stageConfig: any, shipment: any, stageKey: string, location: string) => {
  const baseLabel = stageConfig?.label || stageConfig?.stage || "Unknown"
  const resolvedLabel = baseLabel.includes("[location]") ? baseLabel.replace("[location]", location) : baseLabel
  let description = stageConfig?.description || ""

  if (description.includes("[location]")) {
    description = description.replace("[location]", location)
  }

  if (stageConfig?.stage === "ARRIVED_WAREHOUSE") {
    const deliveryMethod = (shipment?.deliveryMethod || shipment?.delivery_type || "").toString().toUpperCase()
    if (deliveryMethod === "HOME_DELIVERY") {
      description = "Your shipment has arrived at our local Shipgate warehouse and is being prepared for delivery."
    }
  }

  if (stageConfig?.stage === "OUT_FOR_DELIVERY") {
    const deliveryMethod = (shipment?.deliveryMethod || shipment?.delivery_type || "").toString().toUpperCase()
    if (deliveryMethod !== "HOME_DELIVERY") {
      description = "Your shipment has been dispatched and is on its way to the next delivery milestone."
    }
  }

  return { label: resolvedLabel, description }
}

function mapTrackingTimelineEvent(event: any, shipment: any): ShipmentTimelineEvent {
  const stageKey = normalizeStage(event.stage || event.status || event.stageName || event.type)
  const stageConfig = getStageConfig(stageKey)
  const resolvedLocation = getResolvedTimelineLocation(stageKey, shipment, event.location)
  const { label, description } = getResolvedStageText(stageConfig, shipment, stageKey, resolvedLocation)

  return {
    stageKey,
    location: resolvedLocation,
    status: label || event.label || event.stage || event.status || "Unknown",
    timestamp: event.completedAt || event.updatedAt || shipment?.updatedAt || new Date().toLocaleString(),
    completed:
      event.completed === true ||
      event.status === "COMPLETED" ||
      event.stageStatus === "COMPLETED" ||
      ["DELIVERED", "PACKAGE_RECEIVED", "IN_CUSTOMS", "IN_TRANSIT", "ARRIVED_NIGERIAN_CUSTOMS", "ARRIVED_WAREHOUSE", "PENDING_DELIVERY", "SHIPMENT_CREATED", "COMPLETED"].includes(
        normalizeStage(event.status || event.stage),
      ),
    details: description || event.notes || event.details || `${event.stage || event.status || "Stage"} updated`,
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
      const stageKey = event.stageKey || normalizeStage(event.status)
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
      const location = getResolvedTimelineLocation(stageConfig.stage, shipment, shipment?.currentLocation || shipment?.origin)
      const { label, description } = getResolvedStageText(stageConfig, shipment, stageConfig.stage, location)

      return {
        stageKey,
        location,
        status: label,
        timestamp: isCompleted
          ? new Date(shipment?.updatedAt || shipment?.createdAt || Date.now()).toLocaleString()
          : "Pending",
        completed: isCompleted,
        details: description || `${stageConfig.label} - ${isCurrent ? "Current stage" : "Completed"}`,
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
    const location = getResolvedTimelineLocation(stageConfig.stage, shipment, shipment?.currentLocation || shipment?.origin)
    const { label, description } = getResolvedStageText(stageConfig, shipment, stageConfig.stage, location)

    timeline.push({
      stageKey: normalizeStage(stageConfig.stage),
      location,
      status: label,
      timestamp: isCompleted ? new Date(shipment?.updatedAt || shipment?.createdAt || Date.now()).toLocaleString() : "Pending",
      completed: isCompleted,
      details: description || `${stageConfig.label} - ${isCompleted ? "Completed" : "Awaiting this stage"}`,
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
