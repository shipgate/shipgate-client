import { API } from "@/lib/constants"

interface PaymentsApiOptions extends RequestInit {
  token?: string
}

interface PaymentsResponse<T = unknown> {
  success: boolean
  message?: string
  data: T
  [key: string]: unknown
}

export interface Invoice {
  _id?: string
  invoiceId: string
  shipmentNumber: string
  description?: string
  amount: number
  currency?: string
  status: "PENDING" | "PAID" | "VOID" | string
  paymentReference?: string
  authorizationUrl?: string
  createdAt?: string
  updatedAt?: string
  paidAt?: string
  dueDate?: string
}

export interface InitializePaymentResponse {
  authorizationUrl?: string
  authorization_url?: string
  reference?: string
  accessCode?: string
  access_code?: string
  invoice?: Invoice
  [key: string]: unknown
}

export interface VerifyPaymentResponse {
  reference?: string
  status?: string
  amount?: number
  currency?: string
  invoice?: Invoice
  transaction?: unknown
  [key: string]: unknown
}

async function request<T = PaymentsResponse>(path: string, options: PaymentsApiOptions = {}) {
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
    const errorMessage = (data && (data.message || data.error)) || "Unable to complete payment request."
    throw new Error(String(errorMessage))
  }

  return data as T
}

export async function getCustomerInvoices(token: string) {
  return request<PaymentsResponse<Invoice[] | { invoices?: Invoice[] }>>("/api/v1/payments/invoices", {
    method: "GET",
    token,
  })
}

export async function initializeShipmentPayment(shipmentNumber: string, token: string) {
  return request<PaymentsResponse<InitializePaymentResponse>>(
    `/api/v1/payments/shipments/${encodeURIComponent(shipmentNumber)}/initialize`,
    {
      method: "POST",
      token,
    },
  )
}

export async function verifyPayment(reference: string, token: string) {
  return request<PaymentsResponse<VerifyPaymentResponse>>(
    `/api/v1/payments/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      token,
    },
  )
}
