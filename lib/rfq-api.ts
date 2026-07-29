import { API } from "@/lib/constants"

interface RequestOptions extends RequestInit {
  token?: string
}

export interface RfqPayload {
  fullName: string
  company?: string
  email: string
  phone: string
  shipmentMethod: "AIR" | "SEA" | "Air Shipping" | "Sea Shipping"
  itemsDescription: string
  weight?: number
  cbmVolume?: number
  containerType?: string
  specialRequirements?: string
}

export interface RfqItem {
  _id?: string
  rfqId?: string
  fullName?: string
  company?: string
  email?: string
  phone?: string
  shipmentMethod?: string
  itemsDescription?: string
  weight?: number
  cbmVolume?: number
  containerType?: string
  specialRequirements?: string
  status?: "PENDING" | "RESPONDED"
  responseMessage?: string
  createdAt?: string
  updatedAt?: string
}

export interface RfqListResponse {
  data: RfqItem[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
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

export async function submitPublicRfq(payload: RfqPayload) {
  return request<{ success: boolean; message?: string; data?: { rfqId?: string; status?: string } }>("/api/v1/rfq", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function getAdminRfqs(
  token: string,
  page = 1,
  limit = 10,
  status?: "PENDING" | "RESPONDED",
  shipmentMethod?: "AIR" | "SEA" | "Air Shipping" | "Sea Shipping",
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (status) query.set("status", status)
  if (shipmentMethod) query.set("shipmentMethod", shipmentMethod)

  const response = await request<
    {
      success?: boolean
      data?: RfqItem[]
      pagination?: { total?: number; page?: number; limit?: number; pages?: number }
    } | RfqItem[]
  >(`/api/v1/rfq/admin?${query.toString()}`, {
    method: "GET",
    token,
  })

  const payload = Array.isArray(response) ? response : response.data || []
  const pagination = Array.isArray(response)
    ? { total: payload.length, page, limit, pages: Math.ceil(payload.length / limit) }
    : {
        total: response.pagination?.total ?? payload.length,
        page: response.pagination?.page ?? page,
        limit: response.pagination?.limit ?? limit,
        pages: response.pagination?.pages ?? Math.ceil((response.pagination?.total ?? payload.length) / limit),
      }

  return {
    data: payload,
    pagination,
  } as RfqListResponse
}

export async function getAdminRfqById(rfqId: string, token: string) {
  return request<{ success?: boolean; data?: RfqItem } | RfqItem>(`/api/v1/rfq/admin/${encodeURIComponent(rfqId)}`, {
    method: "GET",
    token,
  })
}

export async function respondToAdminRfq(rfqId: string, message: string, token: string) {
  return request<{ success: boolean; message?: string }>(`/api/v1/rfq/admin/${encodeURIComponent(rfqId)}/respond`, {
    method: "POST",
    token,
    body: JSON.stringify({ message }),
  })
}
