import { API } from "@/lib/constants"

export interface NotificationItem {
  _id: string
  title: string
  message: string
  type: "SHIPMENT" | "ACCOUNT" | "ANNOUNCEMENT" | string
  read: boolean
  readAt?: string | null
  shipmentId?: string
  shipmentNumber?: string
  shipmentStage?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

interface NotificationsApiOptions extends RequestInit {
  token?: string
}

interface NotificationsResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  [key: string]: unknown
}

async function request<T = NotificationsResponse>(path: string, options: NotificationsApiOptions = {}) {
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

export async function getNotifications(
  params: {
    type?: string
    read?: boolean
    page?: number
    limit?: number
  } = {},
  token?: string,
) {
  const query = new URLSearchParams()

  if (params.type) query.set("type", params.type)
  if (params.read !== undefined) query.set("read", String(params.read))
  if (params.page !== undefined) query.set("page", String(params.page))
  if (params.limit !== undefined) query.set("limit", String(params.limit))

  const path = `/api/v1/notifications${query.toString() ? `?${query.toString()}` : ""}`

  return request<NotificationsResponse<NotificationItem[]>>(path, {
    method: "GET",
    token,
  })
}

export async function getUnreadNotificationCount(token: string) {
  return request<{ unreadCount: number }>("/api/v1/notifications/unread-count", {
    method: "GET",
    token,
  })
}

export async function markNotificationAsRead(notificationId: string, token: string) {
  return request<Pick<NotificationsResponse, "success" | "message">>(
    `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: "PUT",
      token,
    },
  )
}

export async function markNotificationsAsRead(notificationIds: string[], token: string) {
  return request<Pick<NotificationsResponse, "success" | "message">>("/api/v1/notifications/read-all", {
    method: "PUT",
    token,
    body: JSON.stringify({ notificationIds }),
  })
}
