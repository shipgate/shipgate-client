# Support Tickets, RFQ, and Admin Customer Creation API Documentation

## Overview
This document covers three capabilities:
- Admin and super admin can add customers
- Public and admin RFQ workflow
- Public and customer support tickets with admin response workflow

## Base URLs
- Auth: /api/v1/auth
- RFQ: /api/v1/rfq
- Support Tickets: /api/v1/support-tickets

## Authentication
Protected endpoints require:
- Authorization: Bearer token

---

## 1) Admin and Super Admin Add Customer

### POST /api/v1/auth/customer/add
Create a customer account from admin or super admin dashboard.

Auth:
- Required
- Roles: admin, super_admin

Request Body:
```json
{
  "fullName": "Jane Customer",
  "email": "jane.customer@example.com",
  "phone": "+2348012345678",
  "address": "Lekki, Lagos",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

Success Response (201):
```json
{
  "success": true,
  "message": "Customer created successfully. Verification email sent.",
  "customer": {
    "id": "6888f4f7a6a5e92313c4cc10",
    "fullName": "Jane Customer",
    "email": "jane.customer@example.com",
    "phone": "+2348012345678"
  }
}
```

### POST /api/v1/shipping/admin/shipments
Create a shipment for an existing customer.

Auth:
- Required
- Roles: admin, super_admin

Request Body:
```json
{
  "customerId": "6888f4f7a6a5e92313c4cc10",
  "shipmentType": "SINGLE",
  "shipmentMethod": "AIR",
  "deliveryMethod": "HOME_DELIVERY",
  "singleShipment": {
    "supplierName": "Shenzhen Supplier Ltd",
    "phoneNumber": "+8613812345678",
    "email": "supplier@example.com"
  },
  "items": [
    {
      "description": "Bluetooth Headsets",
      "weight": 8,
      "dimensions": {
        "length": 45,
        "width": 30,
        "height": 25
      },
      "quantity": 50,
      "unitPrice": 10,
      "currency": "USD"
    }
  ],
  "cosignees": [
    {
      "name": "Receiver Name",
      "email": "receiver@example.com",
      "phoneNumber": "+2348011111111"
    }
  ]
}
```

Success Response (201):
```json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "shipmentNumber": "SHP-20260729-123456",
    "shipmentId": "6888fac8a6a5e92313c4cc13",
    "customer": {
      "id": "6888f4f7a6a5e92313c4cc10",
      "fullName": "Jane Customer",
      "email": "jane.customer@example.com"
    },
    "items": [
      {
        "_id": "6888fac8a6a5e92313c4cc14",
        "description": "Bluetooth Headsets"
      }
    ]
  }
}
```

Notes:
- This endpoint does not alter existing customer self-service shipment operations.
- It reuses the same shipment rules for SINGLE and CONSOLIDATION payloads.

---

## 2) RFQ Endpoints

### 2.1 POST /api/v1/rfq
Public endpoint for submitting a request for quote.

Auth:
- Not required

Request Body:
```json
{
  "fullName": "John Doe",
  "company": "Acme Imports",
  "email": "john@acme.com",
  "phone": "+2348099999999",
  "shipmentMethod": "Air Shipping",
  "itemsDescription": "Electronics and accessories",
  "weight": 120,
  "cbmVolume": 4.2,
  "containerType": "20FT",
  "specialRequirements": "Handle with care"
}
```

Notes:
- shipmentMethod accepts: AIR, SEA, Air Shipping, Sea Shipping
- Admin and super admin receive an email notification on submission

Success Response (201):
```json
{
  "success": true,
  "message": "RFQ submitted successfully",
  "data": {
    "rfqId": "6888f5d9a6a5e92313c4cc11",
    "status": "PENDING"
  }
}
```

### 2.2 GET /api/v1/rfq/admin
Admin and super admin can list RFQs.

Auth:
- Required
- Roles: admin, super_admin

Query:
- page (default 1)
- limit (default 10)
- status (PENDING or RESPONDED)
- shipmentMethod (AIR, SEA, Air Shipping, Sea Shipping)

### 2.3 GET /api/v1/rfq/admin/:rfqId
Get one RFQ by id.

Auth:
- Required
- Roles: admin, super_admin

### 2.4 POST /api/v1/rfq/admin/:rfqId/respond
Respond to an RFQ.

Auth:
- Required
- Roles: admin, super_admin

Request Body:
```json
{
  "message": "Thanks for your request. Estimated total cost is USD 1,250 and transit time is 8-10 business days."
}
```

Behavior:
- RFQ status changes to RESPONDED
- Requester receives the response by email

---

## 3) Support Ticket Endpoints

### 3.1 POST /api/v1/support-tickets
Public one-time support ticket submission.

Auth:
- Not required

Request Body:
```json
{
  "fullName": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Need help with delivery timeline",
  "message": "Please share expected transit duration for sea shipping."
}
```

Behavior:
- Ticket is created with status OPEN
- Admin and super admin receive an email notification
- Submitter receives future responses only by email

Success Response (201):
```json
{
  "success": true,
  "message": "Support ticket submitted successfully",
  "data": {
    "ticketId": "6888f6bca6a5e92313c4cc12",
    "status": "OPEN"
  }
}
```

### 3.2 POST /api/v1/support-tickets/customer
Authenticated customer creates a ticket.

Auth:
- Required
- Role: customer

Request Body:
```json
{
  "subject": "Wrong parcel status",
  "message": "My parcel still shows pending after supplier delivery."
}
```

Behavior:
- fullName and email are derived from customer profile
- Ticket is linked to customer account
- Admin and super admin receive email notification

### 3.3 GET /api/v1/support-tickets/customer
Authenticated customer lists own tickets.

Auth:
- Required
- Role: customer

Query:
- page (default 1)
- limit (default 10)
- status (OPEN or RESOLVED)

### 3.4 GET /api/v1/support-tickets/customer/:ticketId
Authenticated customer fetches one own ticket.

Auth:
- Required
- Role: customer

### 3.5 POST /api/v1/support-tickets/customer/:ticketId/respond
Authenticated customer replies on an OPEN ticket.

Auth:
- Required
- Role: customer

Request Body:
```json
{
  "message": "Thanks. Please also confirm if customs fee is included."
}
```

Behavior:
- Reply is appended to ticket conversation
- Admin and super admin are notified by email
- Cannot reply if ticket is RESOLVED

### 3.6 GET /api/v1/support-tickets/admin/unresolved
List unresolved tickets for support team.

Auth:
- Required
- Roles: admin, super_admin

Query:
- page (default 1)
- limit (default 10)

### 3.7 GET /api/v1/support-tickets/admin/:ticketId
Get full ticket thread for admin/support handling.

Auth:
- Required
- Roles: admin, super_admin

### 3.8 POST /api/v1/support-tickets/admin/:ticketId/respond
Admin or super admin replies to an OPEN ticket.

Auth:
- Required
- Roles: admin, super_admin

Request Body:
```json
{
  "message": "Thank you for reaching out. We have now updated your parcel to received."
}
```

Behavior:
- Reply is appended to ticket conversation
- Submitter receives email notification
- Cannot reply if ticket is RESOLVED

### 3.9 PATCH /api/v1/support-tickets/admin/:ticketId/resolve
Mark ticket as resolved.

Auth:
- Required
- Roles: admin, super_admin

Request Body (optional):
```json
{
  "resolutionMessage": "This issue has now been fully resolved."
}
```

Behavior:
- Ticket status becomes RESOLVED
- Optional resolutionMessage is appended to conversation
- Submitter receives resolution email

---

## Back-and-Forth Ticket Flow
1. Public user or customer submits ticket
2. Admin and super admin receive email notification
3. Admin responds and submitter receives email
4. Customer can continue reply via authenticated customer endpoint
5. Each customer reply emails admin and super admin
6. Admin marks ticket RESOLVED when issue is closed

---

## Files Added/Updated
- models/SupportTicket.js
- services/supportTicketService.js
- controllers/supportTickets/index.js
- routes/v1/supportTickets.js
- index.js
- Existing RFQ and auth customer-add endpoints are included in this document
