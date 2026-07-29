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

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

interface PaginatedShippingResponse<T = unknown> extends ShippingResponse<T> {
  pagination?: PaginationInfo
}

export type TrackingStage =
  | "PACKAGE_RECEIVED"
  | "IN_CUSTOMS"
  | "IN_TRANSIT"
  | "ARRIVED_NIGERIAN_CUSTOMS"
  | "ARRIVED_WAREHOUSE"
  | "OUT_FOR_DELIVERY"
  | "PENDING_DELIVERY"
  | "COMPLETED"

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

export interface ShippingRatesConfig {
  AIR: number
  SEA_CBM: number
  SEA_20FT: number
  SEA_40FT: number
  currency: string
}

export interface WarehouseAddressConfig {
  address: string
  number: number
  name: string
}

export const DEFAULT_SHIPPING_RATES: ShippingRatesConfig = {
  AIR: 8.9,
  SEA_CBM: 510,
  SEA_20FT: 5400,
  SEA_40FT: 7200,
  currency: "$",
}

export const DEFAULT_WAREHOUSE_ADDRESS: WarehouseAddressConfig = {
  name: "Guangzhou Distribution Center",
  number: 123,
  address: "Logistics Avenue, Tianhe District, Guangzhou, Guangdong 510610, China",
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

export async function createAdminShipment(payload: unknown, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/admin/shipments', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function getCustomerShipments(token: string, page = 1, limit = 10) {
  return request<PaginatedShippingResponse<any[]>>(`/api/v1/shipping/shipments?page=${page}&limit=${limit}`, {
    method: 'GET',
    token,
  })
}

export async function getAdminShipments(
  token: string,
  page = 1,
  limit = 10,
  status?: string,
  shipmentType?: string,
  shipmentMethod?: string,
  customerId?: string,
  deliveryMethod?: string
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (status) query.set('status', status)
  if (shipmentType) query.set('shipmentType', shipmentType)
  if (shipmentMethod) query.set('shipmentMethod', shipmentMethod)
  if (customerId) query.set('customerId', customerId)
  if (deliveryMethod) query.set('deliveryMethod', deliveryMethod)

  return request<PaginatedShippingResponse<any[]>>(`/api/v1/shipping/admin/shipments?${query.toString()}`, {
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

export async function assignCourierToShipment(shipmentNumber: string, payload: { courierId: string }, token: string) {
  return request<ShippingResponse>(`/api/v1/shipping/admin/shipments/${encodeURIComponent(shipmentNumber)}/assign-courier`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function getCourierShipments(token: string, page = 1, limit = 10) {
  return request<PaginatedShippingResponse<any[]>>(`/api/v1/shipping/courier/shipments?page=${page}&limit=${limit}`, {
    method: 'GET',
    token,
  })
}

export async function markCourierShipmentOutForDelivery(
  shipmentNumber: string,
  payload: { location?: string; notes?: string },
  token: string,
) {
  return request<ShippingResponse>(`/api/v1/shipping/courier/shipments/${encodeURIComponent(shipmentNumber)}/out-for-delivery`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
    token,
  })
}

export async function markCourierShipmentCompleted(
  shipmentNumber: string,
  payload: { location?: string; notes?: string },
  token: string,
) {
  return request<ShippingResponse>(`/api/v1/shipping/courier/shipments/${encodeURIComponent(shipmentNumber)}/complete`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
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

export async function assignShipmentWeight(shipmentNumber: string, payload: { weight: number }, token: string) {
  return request<ShippingResponse>(`/api/v1/shipping/admin/shipments/${encodeURIComponent(shipmentNumber)}/weight`, {
    method: 'PUT',
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

export async function getShippingRatesConfig(token?: string) {
  const response = await request<ShippingResponse<Partial<ShippingRatesConfig>> | Partial<ShippingRatesConfig>>(
    '/api/v1/shipping/config/rates',
    {
      method: 'GET',
      token,
    },
  )

  const payload = ((response as ShippingResponse<Partial<ShippingRatesConfig>>)?.data || response) as Partial<ShippingRatesConfig>

  return {
    ...DEFAULT_SHIPPING_RATES,
    ...payload,
  }
}

export async function setShippingRatesConfig(payload: ShippingRatesConfig, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/config/rates', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function getWarehouseAddressConfig(token?: string) {
  const response = await request<ShippingResponse<Partial<WarehouseAddressConfig>> | Partial<WarehouseAddressConfig>>(
    '/api/v1/shipping/config/warehouse-address',
    {
      method: 'GET',
      token,
    },
  )

  const payload = ((response as ShippingResponse<Partial<WarehouseAddressConfig>>)?.data || response) as Partial<WarehouseAddressConfig>

  return {
    ...DEFAULT_WAREHOUSE_ADDRESS,
    ...payload,
  }
}

export async function setWarehouseAddressConfig(payload: WarehouseAddressConfig, token: string) {
  return request<ShippingResponse>('/api/v1/shipping/config/warehouse-address', {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  })
}
