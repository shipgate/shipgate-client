# Shipgate Shipping & Config API Documentation

## Base URL
`/api/v1/shipping`

## Authentication & Role Notes
- Endpoints using `verifyToken` require `Authorization: Bearer <token>`.
- Middleware checks `req.user.userType` from JWT.
- Valid userType values are: `customer`, `admin`, `super_admin`, `operational_staff`.
- The shipping route file uses `requireRole(['customer'])` for customer creation/listing, and `requireRole(['ADMIN', 'SUPER_ADMIN'])` for admin actions.

---

## 1. Customer Shipping Endpoints

### 1.1 Create Shipment
**POST /shipments**
- Auth: `verifyToken`
- Role: `customer`

**Body**:
- `shipmentType` (required): `SINGLE` or `CONSOLIDATION`
- `shipmentMethod` (required): `AIR`, `SEA_CBM`, `SEA_20FT`, `SEA_40FT`
- `deliveryMethod` (required): `HOME_DELIVERY` or `WAREHOUSE_PICKUP`
- `singleShipment` required for `SINGLE`
- `parcels` required for `CONSOLIDATION`
- `cosignees` optional

**Single shipment example**:
```json
{
  "shipmentType": "SINGLE",
  "shipmentMethod": "AIR",
  "deliveryMethod": "HOME_DELIVERY",
  "singleShipment": {
    "supplierName": "Supplier Co.",
    "companyName": "Supplier Co.",
    "phoneNumber": "+8613812345678",
    "email": "supplier@example.com"
  },
  "items": [
    {
      "description": "Smartphone",
      "weight": 0.5,
      "dimensions": { "length": 15, "width": 8, "height": 1 },
      "quantity": 2,
      "unitPrice": 350,
      "currency": "USD",
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "cosignees": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+2348012345678"
    }
  ]
}
```

**Consolidation shipment example**:
```json
{
  "shipmentType": "CONSOLIDATION",
  "shipmentMethod": "SEA_CBM",
  "deliveryMethod": "WAREHOUSE_PICKUP",
  "parcels": [
    {
      "parcelId": "P001",
      "supplierName": "Supplier A",
      "companyName": "Company A",
      "phoneNumber": "+8613812345678",
      "email": "supplierA@example.com",
      "items": [
        {
          "description": "Clothing",
          "weight": 5,
          "dimensions": { "length": 40, "width": 30, "height": 20 },
          "quantity": 3,
          "unitPrice": 25,
          "currency": "USD"
        }
      ]
    },
    {
      "parcelId": "P002",
      "supplierName": "Supplier B",
      "companyName": "Company B",
      "phoneNumber": "+8613912345678",
      "email": "supplierB@example.com",
      "items": [
        {
          "description": "Shoes",
          "weight": 4,
          "quantity": 2,
          "unitPrice": 45,
          "currency": "USD"
        }
      ]
    }
  ],
  "cosignees": [
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phoneNumber": "+2349012345678"
    }
  ]
}
```

**Success response (201)**:
```json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "shipmentId": "642a1bf5c8d4f11223344556",
    "items": [
      {
        "_id": "643a1bf5c8d4f11223344556",
        "shipmentId": "642a1bf5c8d4f11223344556",
        "parcelId": null,
        "description": "Smartphone",
        "weight": 0.5,
        "dimensions": { "length": 15, "width": 8, "height": 1, "volumetricWeight": 0.024 },
        "quantity": 2,
        "unitPrice": 350,
        "currency": "USD",
        "imageUrl": "https://example.com/image.jpg"
      }
    ]
  }
}
```

---

### 1.2 Get Customer Shipments
**GET /shipments**
- Auth: `verifyToken`
- Role: `customer`

**Query parameters**:
- `page` (optional, default `1`)
- `limit` (optional, default `10`)

**Success response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "642a1bf5c8d4f11223344556",
      "shipmentNumber": "SHIP-1685000000000-1",
      "customerId": "642a0bf5c8d4f11223344555",
      "shipmentType": "SINGLE",
      "shipmentMethod": "AIR",
      "deliveryMethod": "HOME_DELIVERY",
      "currentStatus": "PENDING_PICKUP",
      "pricing": { "status": "PENDING" },
      "createdAt": "2026-05-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 1.3 Get Shipment Details
**GET /shipments/:shipmentNumber**
- Auth: `verifyToken`
- Role: any authenticated user
- Customers may only view their own shipments.

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "shipment": {
      "_id": "642a1bf5c8d4f11223344556",
      "shipmentNumber": "SHIP-1685000000000-1",
      "customerId": {
        "_id": "642a0bf5c8d4f11223344555",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+2348012345678"
      },
      "shipmentType": "SINGLE",
      "shipmentMethod": "AIR",
      "deliveryMethod": "HOME_DELIVERY",
      "singleShipment": { /* supplier info */ },
      "parcels": [],
      "cosignees": [ /* cosignee list */ ],
      "pricing": { /* pricing data */ },
      "trackingTimeline": [ /* timeline entries */ ],
      "currentStatus": "PENDING_PICKUP",
      "createdAt": "2026-05-25T10:00:00.000Z",
      "updatedAt": "2026-05-25T10:00:00.000Z"
    },
    "items": [
      {
        "_id": "643a1bf5c8d4f11223344556",
        "shipmentId": "642a1bf5c8d4f11223344556",
        "parcelId": null,
        "description": "Smartphone",
        "weight": 0.5,
        "dimensions": { "length": 15, "width": 8, "height": 1, "volumetricWeight": 0.024 },
        "quantity": 2,
        "unitPrice": 350,
        "currency": "USD"
      }
    ],
    "summary": {
      "totalItems": 1,
      "totalWeight": 1.0,
      "totalVolumetricWeight": 0.048
    }
  }
}
```

---

### 1.4 Get Shipment Tracking (Public)
**GET /shipments/:shipmentNumber/tracking**
- Auth: none

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "currentStatus": "IN_TRANSIT",
    "deliveryMethod": "HOME_DELIVERY",
    "trackingTimeline": [
      {
        "stage": "PACKAGE_RECEIVED",
        "status": "COMPLETED",
        "completedAt": "2026-05-26T10:00:00.000Z",
        "location": "Shanghai Warehouse",
        "updatedBy": "642b1bf5c8d4f11223344557",
        "notes": "Package received",
        "parcelStatus": []
      }
    ]
  }
}
```

---

### 1.5 Get Shipment Status Summary (Public)
**GET /shipments/:shipmentNumber/status-summary**
- Auth: none

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "currentStatus": "IN_TRANSIT",
    "shipmentType": "SINGLE",
    "deliveryMethod": "HOME_DELIVERY",
    "completedStages": 1,
    "totalStages": 3,
    "progress": 33,
    "nextStage": "IN_TRANSIT",
    "lastUpdate": "2026-05-26T10:00:00.000Z"
  }
}
```

---

### 1.6 Get Pricing Details
**GET /shipments/:shipmentNumber/pricing**
- Auth: none

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "currentStatus": "ARRIVED_WAREHOUSE",
    "pricing": {
      "assignedBy": {
        "_id": "642b1bf5c8d4f11223344557",
        "fullName": "Admin User",
        "email": "admin@example.com"
      },
      "assignedAt": "2026-05-27T10:00:00.000Z",
      "basePrice": 450,
      "currency": "USD",
      "charges": [
        { "description": "Fuel surcharge", "amount": 45 },
        { "description": "Documentation", "amount": 25 }
      ],
      "totalPrice": 520,
      "status": "ASSIGNED"
    }
  }
}
```

---

### 1.7 Update Shipment (Before Confirmation)
**PUT /shipments/:shipmentNumber**
- Auth: `verifyToken`
- Role: `customer`

**Allowed body fields**:
- `deliveryMethod`
- `cosignees`
- `singleShipment`

**Example request**:
```json
{
  "deliveryMethod": "WAREHOUSE_PICKUP",
  "singleShipment": {
    "supplierName": "Supplier Co.",
    "companyName": "Supplier Co.",
    "phoneNumber": "+8613812345678",
    "email": "supplier@example.com"
  }
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Shipment updated successfully",
  "data": {
    "_id": "642a1bf5c8d4f11223344556",
    "shipmentNumber": "SHIP-1685000000000-1",
    "deliveryMethod": "WAREHOUSE_PICKUP",
    "singleShipment": { /* updated supplier info */ },
    "updatedAt": "2026-05-25T12:00:00.000Z"
  }
}
```

---

### 1.8 Cancel Shipment
**DELETE /shipments/:shipmentNumber**
- Auth: `verifyToken`
- Role: `customer`

**Example request**:
```json
{
  "reason": "I need to change the shipment details"
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Shipment cancelled successfully",
  "data": {
    "_id": "642a1bf5c8d4f11223344556",
    "shipmentNumber": "SHIP-1685000000000-1",
    "deletedAt": "2026-05-25T12:30:00.000Z"
  }
}
```

---

## 2. Admin Shipping Endpoints

### 2.1 Get All Shipments
**GET /admin/shipments**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Query parameters**:
- `page` (optional, default `1`)
- `limit` (optional, default `10`)
- `status` (optional)
- `shipmentType` (optional)
- `shipmentMethod` (optional)
- `customerId` (optional)

**Success response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "642a1bf5c8d4f11223344556",
      "shipmentNumber": "SHIP-1685000000000-1",
      "customerId": {
        "_id": "642a0bf5c8d4f11223344555",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+2348012345678"
      },
      "shipmentType": "SINGLE",
      "shipmentMethod": "AIR",
      "currentStatus": "PENDING_PICKUP",
      "pricing": { "status": "PENDING" },
      "createdAt": "2026-05-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 2.2 Get Shipments Pending Pricing
**GET /admin/shipments/pending-pricing**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Success response (200)**:
```json
{
  "success": true,
  "data": [ /* shipments pending pricing */ ],
  "pagination": { /* pagination info */ }
}
```

---

### 2.3 Get Shipments Pending Payment
**GET /admin/shipments/pending-payment**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Query parameters**:
- `page` (optional, default `1`)
- `limit` (optional, default `10`)
- `customerId` (optional)

**Success response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "shipmentNumber": "SHIP-1685000000000-1",
      "currentStatus": "ARRIVED_WAREHOUSE",
      "pricing": {
        "status": "ASSIGNED",
        "totalPrice": 520
      }
    }
  ],
  "pagination": { /* pagination info */ }
}
```

---

### 2.4 Mark Package as Received
**PUT /admin/shipments/:shipmentNumber/package-received**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Body**:
- `parcelUpdates` required for consolidation shipments
- `location` optional
- `notes` optional

**Example request**:
```json
{
  "parcelUpdates": [
    { "parcelId": "P001", "status": "RECEIVED" },
    { "parcelId": "P002", "status": "RECEIVED" }
  ],
  "location": "Shanghai Warehouse",
  "notes": "All parcels received"
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Package marked as received",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "shipmentType": "CONSOLIDATION",
    "packageStatus": "COMPLETED",
    "parcels": [
      { "parcelId": "P001", "status": "RECEIVED" },
      { "parcelId": "P002", "status": "RECEIVED" }
    ]
  }
}
```

---

### 2.5 Update Tracking Stage
**POST /admin/shipments/:shipmentNumber/update-tracking**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`, `operational_staff`

**Body**:
- `stage` required: one of `PACKAGE_RECEIVED`, `IN_CUSTOMS`, `IN_TRANSIT`, `ARRIVED_NIGERIAN_CUSTOMS`, `ARRIVED_WAREHOUSE`, `PENDING_DELIVERY`
- `status` required: `PENDING` or `COMPLETED`
- `location` optional
- `notes` optional
- `parcelUpdates` optional for consolidation

**Example request**:
```json
{
  "stage": "IN_TRANSIT",
  "status": "COMPLETED",
  "location": "Beijing Sorting Center",
  "notes": "Departed on schedule",
  "parcelUpdates": [
    { "parcelId": "P001", "status": "IN_TRANSIT" }
  ]
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Tracking updated successfully",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "currentStatus": "IN_TRANSIT",
    "trackingRecord": {
      "_id": "643b1bf5c8d4f11223344558",
      "stage": "IN_TRANSIT",
      "previousStatus": "IN_CUSTOMS",
      "newStatus": "COMPLETED",
      "updatedBy": "642b1bf5c8d4f11223344557",
      "userRole": "admin",
      "location": "Beijing Sorting Center",
      "notes": "Departed on schedule",
      "parcelUpdates": [
        { "parcelId": "P001", "status": "IN_TRANSIT" }
      ]
    }
  }
}
```

---

### 2.6 Update Parcel Status
**POST /admin/shipments/:shipmentNumber/parcel-status**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Body**:
- `parcelId` required
- `status` required: `PENDING`, `RECEIVED`, `IN_TRANSIT`, or `DELIVERED`
- `location` optional
- `notes` optional

**Example request**:
```json
{
  "parcelId": "P001",
  "status": "LOADED",
  "location": "Shanghai Hub",
  "notes": "Parcel loaded into container"
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Parcel status updated",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "parcelId": "P001",
    "newStatus": "LOADED",
    "packageStatus": "RECEIVED"
  }
}
```

---

### 2.7 Get Tracking History
**GET /admin/shipments/:shipmentNumber/tracking-history**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Success response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "643b1bf5c8d4f11223344558",
      "shipmentId": "642a1bf5c8d4f11223344556",
      "stage": "PACKAGE_RECEIVED",
      "previousStatus": "PENDING_PICKUP",
      "newStatus": "COMPLETED",
      "updatedBy": {
        "_id": "642b1bf5c8d4f11223344557",
        "fullName": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
      },
      "userRole": "admin",
      "location": "Shanghai Warehouse",
      "notes": "Package received",
      "parcelUpdates": [ /* parcel update objects */ ],
      "createdAt": "2026-05-26T10:00:00.000Z"
    }
  ]
}
```

---

## 3. Pricing Endpoints

### 3.1 Assign Pricing
**POST /admin/shipments/:shipmentNumber/pricing**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Body**:
- `basePrice` required
- `currency` optional, defaults to `USD`
- `charges` optional array

**Example request**:
```json
{
  "basePrice": 450.00,
  "currency": "USD",
  "charges": [
    { "description": "Fuel surcharge", "amount": 45.00 },
    { "description": "Documentation", "amount": 25.00 }
  ]
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Pricing assigned successfully",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "pricing": {
      "basePrice": 450,
      "charges": [
        { "description": "Fuel surcharge", "amount": 45 },
        { "description": "Documentation", "amount": 25 }
      ],
      "totalPrice": 520,
      "currency": "USD"
    }
  }
}
```

---

### 3.2 Update Pricing
**PUT /admin/shipments/:shipmentNumber/pricing**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Body**:
- `basePrice` optional
- `currency` optional
- `charges` optional array

**Example request**:
```json
{
  "basePrice": 460.00,
  "currency": "USD",
  "charges": [
    { "description": "Fuel surcharge", "amount": 47.00 }
  ]
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Pricing updated successfully",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "pricingUpdate": {
      "oldTotal": 520,
      "newTotal": 527,
      "basePrice": 460,
      "charges": [
        { "description": "Fuel surcharge", "amount": 47 }
      ],
      "currency": "USD"
    }
  }
}
```

---

### 3.3 Mark Payment as Paid
**POST /admin/shipments/:shipmentNumber/payment**
- Auth: `verifyToken`
- Role: `admin`, `super_admin`

**Body**:
- `method` required
- `transactionId` required

**Example request**:
```json
{
  "method": "BANK_TRANSFER",
  "transactionId": "TXN-987654321"
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Payment marked as paid",
  "data": {
    "shipmentNumber": "SHIP-1685000000000-1",
    "paymentStatus": "PAID"
  }
}
```

---

## 4. Configuration Endpoints

### 4.1 Get Warehouse Address
**GET /config/warehouse-address**
- Auth: none

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "address": "123 Warehouse Rd",
    "city": "Shanghai",
    "postalCode": "200000",
    "country": "China",
    "fullAddress": "123 Warehouse Rd, Shanghai, 200000, China"
  }
}
```

---

### 4.2 Update Warehouse Address
**PUT /config/warehouse-address**
- Auth: `verifyToken`
- Role: `super_admin`

**Body**:
- `address` required
- `city` required
- `postalCode` required
- `country` required
- `fullAddress` optional, auto-generated if missing

**Example request**:
```json
{
  "address": "123 Warehouse Rd",
  "city": "Shanghai",
  "postalCode": "200000",
  "country": "China",
  "fullAddress": "123 Warehouse Rd, Shanghai, 200000, China"
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Warehouse address updated successfully",
  "data": {
    "address": "123 Warehouse Rd",
    "city": "Shanghai",
    "postalCode": "200000",
    "country": "China",
    "fullAddress": "123 Warehouse Rd, Shanghai, 200000, China"
  }
}
```

---

### 4.3 Get Shipping Rates
**GET /config/rates**
- Auth: none

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "AIR": 10.0,
    "SEA_CBM": 120.0,
    "SEA_20FT": 450.0,
    "SEA_40FT": 800.0,
    "currency": "USD"
  }
}
```

---

### 4.4 Set Shipping Rates
**POST /config/rates**
- Auth: `verifyToken`
- Role: `super_admin`

**Body**:
- `AIR` required
- `SEA_CBM` required
- `SEA_20FT` required
- `SEA_40FT` required
- `currency` optional

**Example request**:
```json
{
  "AIR": 10.0,
  "SEA_CBM": 120.0,
  "SEA_20FT": 450.0,
  "SEA_40FT": 800.0,
  "currency": "USD"
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Shipping rates updated successfully",
  "data": {
    "AIR": 10.0,
    "SEA_CBM": 120.0,
    "SEA_20FT": 450.0,
    "SEA_40FT": 800.0,
    "currency": "USD"
  }
}
```

---

### 4.5 Get System Config
**GET /config**
- Auth: none

**Success response (200)**:
```json
{
  "success": true,
  "data": {
    "CHINA_WAREHOUSE_ADDRESS": {
      "address": "123 Warehouse Rd",
      "city": "Shanghai",
      "postalCode": "200000",
      "country": "China",
      "fullAddress": "123 Warehouse Rd, Shanghai, 200000, China"
    },
    "SHIPPING_RATES": {
      "AIR": 10.0,
      "SEA_CBM": 120.0,
      "SEA_20FT": 450.0,
      "SEA_40FT": 800.0,
      "currency": "USD"
    },
    "SYSTEM_CONFIG": { /* arbitrary config object */ }
  }
}
```

---

### 4.6 Update System Config
**PUT /config**
- Auth: `verifyToken`
- Role: `super_admin`

**Body**:
- `key` required
- `value` required

**Example request**:
```json
{
  "key": "SYSTEM_CONFIG",
  "value": {
    "supportEmail": "support@shipgate.com"
  }
}
```

**Success response (200)**:
```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "data": {
    "_id": "643c1bf5c8d4f11223344559",
    "key": "SYSTEM_CONFIG",
    "value": {
      "supportEmail": "support@shipgate.com"
    },
    "updatedBy": "642b1bf5c8d4f11223344557",
    "version": 2,
    "updatedAt": "2026-05-27T12:00:00.000Z"
  }
}
```

---

## 5. Common Error Responses
- `400` Bad Request: missing required fields or invalid payload
- `403` Forbidden: unauthorized role or ownership denied
- `404` Not Found: shipment, config, or system state not found
- `500` Internal Server Error: unhandled server error
