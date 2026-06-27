# Payments and Invoices Implementation Plan

## 1. CORE FLOW

### 1.1 Pricing to Invoice Lifecycle

1. Admin assigns pricing to a shipment through `POST /api/v1/shipping/admin/shipments/:shipmentNumber/pricing`.
2. The system creates or refreshes a pending invoice for that shipment.
3. Customer initializes direct checkout through Paystack.
4. Paystack returns an authorization URL and payment reference.
5. Backend verifies the payment using the Paystack reference.
6. On successful verification:
   - `shipment.pricing.status` becomes `PAID`
   - the invoice status becomes `PAID`
   - a payment transaction record is stored for history and audit

### 1.2 Payment Modes

| Mode | Status |
|------|--------|
| Direct checkout | Implemented now through Paystack |
| Wallet funding | Reserved for future expansion |

The current implementation keeps wallet payment in the schema and transaction architecture so it can be added later without breaking the model.

---

## 2. DATABASE MODELS

### 2.1 `Invoice`

| Field | Purpose |
|------|---------|
| `invoiceId` | Public invoice identifier |
| `shipmentId` | Links invoice to shipment |
| `shipmentNumber` | Human-readable shipment reference |
| `customerId` | Invoice owner |
| `description` | Example: `Air Freight - Shipment #SHP-2025-001` |
| `amount` | Final amount to pay |
| `currency` | Invoice currency |
| `status` | `PENDING`, `PAID`, or `VOID` |
| `paymentReference` | Paystack or manual reference |
| `paystackAccessCode` | Stored when checkout is initialized |
| `authorizationUrl` | Redirect URL returned by Paystack |
| `paidAt` | Timestamp when the invoice was settled |

### 2.2 `PaymentTransaction`

| Field | Purpose |
|------|---------|
| `reference` | Unique payment reference |
| `paystackTransactionId` | Paystack transaction id |
| `invoiceId` | Linked invoice |
| `shipmentId` | Linked shipment |
| `customerId` | Transaction owner |
| `amount` | Amount paid |
| `currency` | Transaction currency |
| `provider` | `paystack`, `wallet`, or `manual` |
| `status` | `PENDING`, `SUCCESS`, or `FAILED` |
| `channel` | Payment channel reported by Paystack |
| `gatewayResponse` | Raw gateway response string |
| `authorizationCode` | Authorization code from Paystack |
| `fees` | Gateway fees |
| `verifiedAt` | Verification timestamp |
| `rawResponse` | Full provider payload for audit |

---

## 3. API ENDPOINTS

### 3.1 Shipping Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/shipments/:shipmentNumber/pricing` | Assign pricing to a shipment and create its invoice | Admin/SuperAdmin |
| PUT | `/shipments/:shipmentNumber/pricing` | Update assigned pricing and refresh invoice amount | Admin/SuperAdmin |
| POST | `/shipments/:shipmentNumber/payment` | Manually mark payment as received | Admin/SuperAdmin |
| GET | `/shipments/:shipmentNumber/invoice` | Fetch a shipment invoice | Authenticated user |
| GET | `/admin/shipments/:shipmentNumber/invoice` | Fetch invoice details for admin review | Admin/SuperAdmin |

### 3.2 Payments Routes

Base URL: `/api/v1/payments`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/shipments/:shipmentNumber/initialize` | Initialize Paystack checkout for a shipment | Customer |
| GET | `/verify/:reference` | Verify a payment reference with Paystack | Customer/Admin/SuperAdmin |
| GET | `/transactions` | List payment history | Customer/Admin/SuperAdmin |
| GET | `/transactions/:reference` | Fetch a single transaction | Customer/Admin/SuperAdmin |
| GET | `/invoices` | List invoices | Customer/Admin/SuperAdmin |
| GET | `/invoices/:invoiceId` | Fetch a single invoice | Customer/Admin/SuperAdmin |

---

## 4. PAYSTACK INTEGRATION NOTES

1. Add `PAYSTACK_SECRET_KEY` to the environment.
2. Optionally add `PAYSTACK_CALLBACK_URL` if the frontend needs a specific redirect target.
3. Amounts are sent in the smallest currency unit expected by Paystack.
4. Verification is always performed server-side using the secret key.
5. Payment records are persisted even if the frontend never returns, so history remains auditable.

---

## 5. FUTURE WALLET ARCHITECTURE

The current schema already supports:

- `invoice.provider`
- `paymentTransaction.provider`
- `shipment.pricing.paymentProvider`

That means wallet payments can later reuse the same invoice and transaction records while swapping the settlement source from Paystack to wallet balance.
