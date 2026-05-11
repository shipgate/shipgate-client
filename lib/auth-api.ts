import { API } from "@/lib/constants"
import type { AuthUser } from "@/store/auth"

interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  token?: string
  user?: AuthUser
  [key: string]: unknown
}

async function request<T = ApiResponse>(path: string, options: RequestInit & { token?: string } = {}) {
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
    const errorMessage =
      (data && (data.message || data.error)) || "Unable to complete request."
    throw new Error(String(errorMessage))
  }

  return data as T
}

export async function signupCustomer(payload: {
  fullName: string
  email: string
  phone?: string
  address?: string
  password: string
  confirmPassword: string
}) {
  return request<Pick<ApiResponse, "success" | "message">>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ ...payload, userType: "customer" }),
  })
}

export async function verifyEmail(token: string) {
  return request<Pick<ApiResponse, "success" | "message">>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  })
}

export async function sendPasswordReset(email: string) {
  return request<Pick<ApiResponse, "success" | "message">>(
    "/api/v1/auth/password-reset/send",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  )
}

export async function resetPassword(payload: {
  token: string
  newPassword: string
  confirmPassword: string
}) {
  return request<Pick<ApiResponse, "success" | "message">>(
    "/api/v1/auth/password-reset/verify",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
}

export async function loginUser(payload: { email: string; password: string }) {
  return request<{
    success: boolean
    message?: string
    token: string
    user: AuthUser
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function adminLogin(payload: { email: string; password: string }) {
  return request<{
    success: boolean
    message?: string
    token: string
    user: AuthUser
  }>("/api/v1/auth/admin-login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function authenticateUser(payload: { email: string; password: string }) {
    return await loginUser(payload)
}

export async function getUsers(type: string, token: string) {
  return request<{ users: AuthUser[] }>(`/api/v1/auth/users?type=${type}`, {
    method: "GET",
    token,
  })
}

export async function deleteUser(userId: string, token: string) {
  return request<Pick<ApiResponse, "success" | "message">>(`/api/v1/auth/user/${userId}`, {
    method: "DELETE",
    token,
  })
}

export async function addAdmin(payload: {
  fullName: string
  email: string
  phone: string
  address: string
  password: string
  confirmPassword: string
  department?: string
  permissions?: string[]
}, token: string) {
  return request<Pick<ApiResponse, "success" | "message" | "admin">>("/api/v1/auth/admin/add", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  })
}

export async function addCourier(payload: {
  fullName: string
  email: string
  phone: string
  address: string
  password: string
  confirmPassword: string
  courierLicense: string
  vehicleType: string
}, token: string) {
  return request<Pick<ApiResponse, "success" | "message" | "courier">>("/api/v1/auth/courier/add", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  })
}

export async function addStaff(payload: {
  fullName: string
  email: string
  phone: string
  address: string
  password: string
  confirmPassword: string
  checkpoint: string
  checkpointCode: string
  department?: string
}, token: string) {
  return request<Pick<ApiResponse, "success" | "message" | "staff">>("/api/v1/auth/staff/add", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  })
}
