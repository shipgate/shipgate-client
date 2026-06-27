import { API } from "@/lib/constants"

interface ShippingApiOptions extends RequestInit {
  token?: string
}

interface ShippingResponse<T = unknown> {
  success: boolean
  message?: string
  data: T
  [key: string]: unknown
}

export type TrackingStage =
  | "PACKAGE_RECEIVED"
  | "IN_CUSTOMS"
  | "IN_TRANSIT"
  | "ARRIVED_NIGERIAN_CUSTOMS"
  | "ARRIVED_WAREHOUSE"
  | "PENDING_DELIVERY"

export type TrackingStageStatus = "PENDING" | "COMPLETED"

export interface TrackingStageUpdatePayload {
  stage: TrackingStage
  status: TrackingStageStatus
  location?: string
  notes?: string
  parcelUpdates?: Array<{
    parcelId: string
    status: TrackingStage | string
  }>
}

async function request<T = ShippingResponse>(path: string, options: ShippingApiOptions = {}) {
  const { token, ...restOptions } = options
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API}${path}`, {
    headers,
    ...restOptions,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMessage = (data && (data.message || data.error)) || "Unable to complete request."
    throw new Error(String(errorMessage))
  }

  return data as T
}

export async function createShipment(payload: unknown, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/shipments', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function getCustomerShipments(token: string, page = 1, limit = 20) {
  return request<ShippingResponse<any[]>>(`/api/v1/shipping/shipments?page=${page}&limit=${limit}`, {
    method: 'GET',
    token,
  })
}

export async function getAdminShipments(
  token: string,
  page = 1,
  limit = 20,
  status?: string,
  shipmentType?: string,
  shipmentMethod?: string,
  customerId?: string,
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (status) query.set('status', status)
  if (shipmentType) query.set('shipmentType', shipmentType)
  if (shipmentMethod) query.set('shipmentMethod', shipmentMethod)
  if (customerId) query.set('customerId', customerId)

  return request<ShippingResponse<any[]>>(`/api/v1/shipping/admin/shipments?${query.toString()}`, {
    method: 'GET',
    token,
  })
}

export async function markPackageAsReceived(shipmentNumber: string, payload: unknown, token: string) {
  return request<ShippingResponse>(`/api/v1/shipping/admin/shipments/${encodeURIComponent(
    shipmentNumber,
  )}/package-received`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  })
}

export async function updateTrackingStage(
  shipmentNumber: string,
  payload: TrackingStageUpdatePayload,
  token: string,
) {
  return request<ShippingResponse>(
    `/api/v1/shipping/admin/shipments/${encodeURIComponent(shipmentNumber)}/update-tracking`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    },
  )
}

export async function assignShipmentPricing(shipmentNumber: string, payload: unknown, token: string) {
  return request<ShippingResponse>(`/api/v1/shipping/admin/shipments/${encodeURIComponent(shipmentNumber)}/pricing`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function getShipmentDetails(shipmentNumber: string, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/shipments/' + encodeURIComponent(shipmentNumber), {
    method: 'GET',
    token,
  })
}

export async function updateShipment(shipmentNumber: string, payload: unknown, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/shipments/' + encodeURIComponent(shipmentNumber), {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  })
}

export async function cancelShipment(shipmentNumber: string, reason: string, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/shipments/' + encodeURIComponent(shipmentNumber), {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
    token,
  })
}

export async function getPublicShipmentTracking(shipmentNumber: string) {
  return request<ShippingResponse>('/api/v1/shipping/shipments/' + encodeURIComponent(shipmentNumber) + '/tracking', {
    method: 'GET',
  })
}
