# Courier Shipping API Documentation

This document describes the courier-related shipment endpoints added for home delivery workflows.

Base URL:
- /api/v1/shipping

Authentication:
- All courier endpoints require a JWT bearer token.
- The token must belong to a user with userType = courier.

## 1. Get Assigned Shipments for Courier

Get all home delivery shipments assigned to the authenticated courier.

- Method: GET
- Endpoint: /api/v1/shipping/courier/shipments
- Auth: Required (courier)
- Query params:
  - page (optional, default: 1)
  - limit (optional, default: 10)

### Success response
```json
{
  "success": true,
  "data": [
    {
      "_id": "shipment-id",
      "shipmentNumber": "SG-20260701-001",
      "deliveryMethod": "HOME_DELIVERY",
      "currentStatus": "ARRIVED_WAREHOUSE",
      "assignedCourier": {
        "_id": "courier-id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "08012345678"
      },
      "customerId": {
        "_id": "customer-id",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "phone": "08087654321"
      },
      "createdAt": "2026-07-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

---

## 2. Mark Shipment as Out for Delivery

Allows a courier to update an assigned shipment to OUT_FOR_DELIVERY when the parcel is ready to leave.

- Method: POST
- Endpoint: /api/v1/shipping/courier/shipments/:shipmentNumber/out-for-delivery
- Auth: Required (courier)
- Params:
  - shipmentNumber: shipment identifier
- Body (optional):
```json
{
  "location": "Lagos Warehouse",
  "notes": "Parcel is ready to depart"
}
```

### Success response
```json
{
  "success": true,
  "message": "Shipment marked out for delivery",
  "data": {
    "shipment": {
      "shipmentNumber": "SG-20260701-001",
      "currentStatus": "OUT_FOR_DELIVERY"
    },
    "trackingRecord": {
      "stage": "OUT_FOR_DELIVERY",
      "newStatus": "COMPLETED"
    }
  }
}
```

### Notes
- Only works if the shipment is already assigned to the authenticated courier.
- Only home delivery shipments are eligible.
- The shipment must currently be in a valid courier transition state.

---

## 3. Mark Shipment as Completed

Allows a courier to mark an assigned shipment as completed after delivery.

- Method: POST
- Endpoint: /api/v1/shipping/courier/shipments/:shipmentNumber/complete
- Auth: Required (courier)
- Params:
  - shipmentNumber: shipment identifier
- Body (optional):
```json
{
  "location": "Customer Address",
  "notes": "Delivered successfully"
}
```

### Success response
```json
{
  "success": true,
  "message": "Shipment marked as completed",
  "data": {
    "shipment": {
      "shipmentNumber": "SG-20260701-001",
      "currentStatus": "COMPLETED"
    },
    "trackingRecord": {
      "stage": "COMPLETED",
      "newStatus": "COMPLETED"
    }
  }
}
```

### Notes
- The shipment must already be in OUT_FOR_DELIVERY before it can be completed.
- Only shipments assigned to the authenticated courier can be updated.

---

## 4. Admin / Super Admin: Assign Courier to Shipment

Assign a home delivery shipment to a courier.

- Method: POST
- Endpoint: /api/v1/shipping/admin/shipments/:shipmentNumber/assign-courier
- Auth: Required (admin or super_admin)
- Body:
```json
{
  "courierId": "courier-object-id"
}
```

### Success response
```json
{
  "success": true,
  "message": "Shipment assigned to courier successfully",
  "data": {
    "_id": "shipment-id",
    "shipmentNumber": "SG-20260701-001",
    "assignedCourier": "courier-object-id"
  }
}
```

---

## 5. Admin / Super Admin: View Shipments Assigned to a Courier

Get all shipments assigned to a specific courier, along with simple status summary counts.

- Method: GET
- Endpoint: /api/v1/shipping/admin/couriers/:courierId/shipments
- Auth: Required (admin or super_admin)
- Query params:
  - page (optional, default: 1)
  - limit (optional, default: 10)

### Success response
```json
{
  "success": true,
  "data": [
    {
      "_id": "shipment-id",
      "shipmentNumber": "SG-20260701-001",
      "currentStatus": "OUT_FOR_DELIVERY"
    }
  ],
  "stats": {
    "total": 8,
    "pending": 2,
    "outForDelivery": 3,
    "completed": 3
  },
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

## Expected Shipment Status Flow

For home delivery shipments:
1. Shipment created
2. Admin assigns courier
3. Courier marks shipment as OUT_FOR_DELIVERY
4. Courier marks shipment as COMPLETED

Useful frontend states:
- ARRIVED_WAREHOUSE
- OUT_FOR_DELIVERY
- COMPLETED
