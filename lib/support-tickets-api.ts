import { API } from "@/lib/constants"

interface RequestOptions extends RequestInit {
  token?: string
}

export interface SupportTicketMessage {
  message?: string
  senderType?: string
  createdAt?: string
  createdBy?: {
    _id?: string
    fullName?: string
    email?: string
  }
}

export interface SupportTicket {
  _id?: string
  ticketId?: string
  fullName?: string
  email?: string
  subject?: string
  message?: string
  status?: "OPEN" | "RESOLVED"
  conversation?: SupportTicketMessage[]
  createdAt?: string
  updatedAt?: string
}

export interface SupportTicketPagination {
  total: number
  page: number
  limit: number
  pages: number
}

export interface SupportTicketListResponse {
  data: SupportTicket[]
  pagination: SupportTicketPagination
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

function normalizeListResponse(
  response:
    | {
        success?: boolean
        data?: SupportTicket[]
        pagination?: { total?: number; page?: number; limit?: number; pages?: number }
      }
    | SupportTicket[],
  page: number,
  limit: number,
): SupportTicketListResponse {
  const data = Array.isArray(response) ? response : response.data || []
  const pagination = Array.isArray(response)
    ? { total: data.length, page, limit, pages: Math.ceil(data.length / limit) }
    : {
        total: response.pagination?.total ?? data.length,
        page: response.pagination?.page ?? page,
        limit: response.pagination?.limit ?? limit,
        pages: response.pagination?.pages ?? Math.ceil((response.pagination?.total ?? data.length) / limit),
      }

  return {
    data,
    pagination,
  }
}

export async function submitPublicSupportTicket(payload: {
  fullName: string
  email: string
  subject: string
  message: string
}) {
  return request<{ success: boolean; message?: string; data?: { ticketId?: string; status?: string } }>("/api/v1/support-tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function submitCustomerSupportTicket(
  payload: {
    subject: string
    message: string
  },
  token: string,
) {
  return request<{ success: boolean; message?: string; data?: { ticketId?: string; status?: string } }>("/api/v1/support-tickets/customer", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  })
}

export async function getCustomerSupportTickets(token: string, page = 1, limit = 10, status?: "OPEN" | "RESOLVED") {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (status) query.set("status", status)

  const response = await request<
    {
      success?: boolean
      data?: SupportTicket[]
      pagination?: { total?: number; page?: number; limit?: number; pages?: number }
    } | SupportTicket[]
  >(`/api/v1/support-tickets/customer?${query.toString()}`, {
    method: "GET",
    token,
  })

  return normalizeListResponse(response, page, limit)
}

export async function getCustomerSupportTicketById(ticketId: string, token: string) {
  return request<{ success?: boolean; data?: SupportTicket } | SupportTicket>(
    `/api/v1/support-tickets/customer/${encodeURIComponent(ticketId)}`,
    {
      method: "GET",
      token,
    },
  )
}

export async function respondToCustomerSupportTicket(ticketId: string, message: string, token: string) {
  return request<{ success: boolean; message?: string }>(
    `/api/v1/support-tickets/customer/${encodeURIComponent(ticketId)}/respond`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ message }),
    },
  )
}

export async function getAdminUnresolvedSupportTickets(token: string, page = 1, limit = 10) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  const response = await request<
    {
      success?: boolean
      data?: SupportTicket[]
      pagination?: { total?: number; page?: number; limit?: number; pages?: number }
    } | SupportTicket[]
  >(`/api/v1/support-tickets/admin/unresolved?${query.toString()}`, {
    method: "GET",
    token,
  })

  return normalizeListResponse(response, page, limit)
}

export async function getAdminSupportTicketById(ticketId: string, token: string) {
  return request<{ success?: boolean; data?: SupportTicket } | SupportTicket>(
    `/api/v1/support-tickets/admin/${encodeURIComponent(ticketId)}`,
    {
      method: "GET",
      token,
    },
  )
}

export async function respondToAdminSupportTicket(ticketId: string, message: string, token: string) {
  return request<{ success: boolean; message?: string }>(
    `/api/v1/support-tickets/admin/${encodeURIComponent(ticketId)}/respond`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ message }),
    },
  )
}

export async function resolveAdminSupportTicket(ticketId: string, token: string, resolutionMessage?: string) {
  return request<{ success: boolean; message?: string }>(
    `/api/v1/support-tickets/admin/${encodeURIComponent(ticketId)}/resolve`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(resolutionMessage ? { resolutionMessage } : {}),
    },
  )
}
