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

export interface WalletTransaction {
  reference?: string
  type?: string
  amount?: number
  source?: string
  status?: string
  [key: string]: unknown
}

export interface WalletResponse {
  balance?: number
  customer?: {
    fullName?: string
    email?: string
    walletBalance?: number
    [key: string]: unknown
  }
  transactions?: WalletTransaction[]
  [key: string]: unknown
}

export interface FundWalletResponse {
  reference?: string
  authorizationUrl?: string
  authorization_url?: string
  accessCode?: string
  access_code?: string
  amount?: number
  currency?: string
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

export async function payShipmentWithWallet(shipmentNumber: string, token: string, description = "Payment for shipment") {
  return request<PaymentsResponse<{ walletBalance?: number }>>(
    `/api/v1/payments/shipments/${encodeURIComponent(shipmentNumber)}/wallet`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ description }),
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

export async function getCustomerWallet(token: string) {
  return request<PaymentsResponse<WalletResponse>>("/api/v1/payments/wallet", {
    method: "GET",
    token,
  })
}

export async function fundWallet(amount: number, email: string, description: string, token: string) {
  return request<PaymentsResponse<FundWalletResponse>>("/api/v1/payments/wallet/fund", {
    method: "POST",
    token,
    body: JSON.stringify({ amount, email, description }),
  })
}

export async function verifyWalletFunding(reference: string, token: string) {
  return request<PaymentsResponse<VerifyPaymentResponse>>(
    `/api/v1/payments/wallet/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      token,
    },
  )
}
