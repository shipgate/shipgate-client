# Notifications API Documentation

## Overview

The Notifications API provides endpoints for managing user notifications including shipment updates, account notifications, and announcements. All endpoints require authentication via JWT token.

**Base URL:** `/api/v1/notifications`

**Authentication:** All endpoints require a valid JWT token in the `Authorization` header.

```
Authorization: Bearer <your_jwt_token>
```

---

## Notification Types

The system supports three types of notifications:

| Type | Description | When Created |
|------|-------------|--------------|
| **SHIPMENT** | Updates about shipment tracking progress | When a shipment stage changes |
| **ACCOUNT** | Account-related notifications | When account events occur |
| **ANNOUNCEMENT** | Blog posts and general announcements | When a new blog post is published |

---

## Notification Object

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "SHIPMENT|ACCOUNT|ANNOUNCEMENT",
  "title": "string",
  "message": "string",
  "read": false,
  "readAt": null,
  "shipmentId": "ObjectId (optional)",
  "shipmentNumber": "string (optional)",
  "shipmentStage": "string (optional)",
  "accountAction": "string (optional)",
  "blogPostId": "ObjectId (optional)",
  "metadata": {
    "key": "value"
  },
  "createdAt": "2026-06-22T10:00:00Z",
  "updatedAt": "2026-06-22T10:00:00Z"
}
```

---

## Endpoints

### 1. Get All Notifications

Retrieve all notifications for the authenticated user with optional filtering and pagination.

**Endpoint:** `GET /`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 20 | Number of notifications per page |
| `type` | string | No | - | Filter by type: `SHIPMENT`, `ACCOUNT`, `ANNOUNCEMENT` |
| `read` | boolean | No | - | Filter by read status: `true` or `false` |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "type": "SHIPMENT",
      "title": "In Transit",
      "message": "Shipment #SHP-2025-002 is now in transit and on its way to you.",
      "read": false,
      "readAt": null,
      "shipmentNumber": "SHP-2025-002",
      "shipmentStage": "IN_TRANSIT",
      "createdAt": "2026-06-22T10:00:00Z",
      "updatedAt": "2026-06-22T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

**Examples:**

```bash
# Get all notifications
curl -X GET "http://localhost:5000/api/v1/notifications" \
  -H "Authorization: Bearer <token>"

# Get unread notifications
curl -X GET "http://localhost:5000/api/v1/notifications?read=false" \
  -H "Authorization: Bearer <token>"

# Get shipment notifications (page 2, 10 per page)
curl -X GET "http://localhost:5000/api/v1/notifications?type=SHIPMENT&page=2&limit=10" \
  -H "Authorization: Bearer <token>"

# Get unread shipment notifications
curl -X GET "http://localhost:5000/api/v1/notifications?type=SHIPMENT&read=false" \
  -H "Authorization: Bearer <token>"
```

---

### 2. Get Unread Notification Count

Get the count of unread notifications for the authenticated user.

**Endpoint:** `GET /unread-count`

**Response:**

```json
{
  "success": true,
  "unreadCount": 3
}
```

**Example:**

```bash
curl -X GET "http://localhost:5000/api/v1/notifications/unread-count" \
  -H "Authorization: Bearer <token>"
```

---

### 3. Get Notifications by Type

Retrieve notifications filtered by a specific type with pagination.

**Endpoint:** `GET /type/:type`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Notification type: `SHIPMENT`, `ACCOUNT`, or `ANNOUNCEMENT` |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 20 | Number of notifications per page |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "type": "SHIPMENT",
      "title": "Package Received",
      "message": "Your package has been received at our facility. Shipment #SHP-2025-001 is now in our warehouse.",
      "read": true,
      "readAt": "2026-06-22T11:00:00Z",
      "shipmentNumber": "SHP-2025-001",
      "shipmentStage": "PACKAGE_RECEIVED",
      "createdAt": "2026-06-22T09:00:00Z",
      "updatedAt": "2026-06-22T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

**Examples:**

```bash
# Get all shipment notifications
curl -X GET "http://localhost:5000/api/v1/notifications/type/SHIPMENT" \
  -H "Authorization: Bearer <token>"

# Get announcement notifications (page 1, 5 per page)
curl -X GET "http://localhost:5000/api/v1/notifications/type/ANNOUNCEMENT?limit=5" \
  -H "Authorization: Bearer <token>"

# Get account notifications (page 3, 15 per page)
curl -X GET "http://localhost:5000/api/v1/notifications/type/ACCOUNT?page=3&limit=15" \
  -H "Authorization: Bearer <token>"
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Notifications retrieved successfully |
| 400 | Invalid notification type |
| 401 | Unauthorized - missing or invalid token |

---

### 4. Get Single Notification

Retrieve details of a specific notification by ID.

**Endpoint:** `GET /:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Notification ID (MongoDB ObjectId) |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "type": "SHIPMENT",
    "title": "In Transit",
    "message": "Shipment #SHP-2025-002 is now in transit and on its way to you.",
    "read": false,
    "readAt": null,
    "shipmentId": "507f1f77bcf86cd799439013",
    "shipmentNumber": "SHP-2025-002",
    "shipmentStage": "IN_TRANSIT",
    "metadata": {
      "shipmentMethod": "AIR",
      "deliveryMethod": "HOME_DELIVERY"
    },
    "createdAt": "2026-06-22T10:00:00Z",
    "updatedAt": "2026-06-22T10:00:00Z"
  }
}
```

**Example:**

```bash
curl -X GET "http://localhost:5000/api/v1/notifications/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <token>"
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Notification retrieved successfully |
| 404 | Notification not found |
| 401 | Unauthorized - missing or invalid token |

---

### 5. Mark Notification as Read

Mark a single notification as read and set the `readAt` timestamp.

**Endpoint:** `PUT /:id/read`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Notification ID (MongoDB ObjectId) |

**Response:**

```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "type": "SHIPMENT",
    "title": "In Transit",
    "message": "Shipment #SHP-2025-002 is now in transit and on its way to you.",
    "read": true,
    "readAt": "2026-06-22T11:30:00Z",
    "shipmentNumber": "SHP-2025-002",
    "shipmentStage": "IN_TRANSIT",
    "createdAt": "2026-06-22T10:00:00Z",
    "updatedAt": "2026-06-22T11:30:00Z"
  }
}
```

**Example:**

```bash
curl -X PUT "http://localhost:5000/api/v1/notifications/507f1f77bcf86cd799439011/read" \
  -H "Authorization: Bearer <token>"
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Notification marked as read successfully |
| 403 | Forbidden - notification belongs to another user |
| 404 | Notification not found |
| 401 | Unauthorized - missing or invalid token |

---

### 6. Mark Multiple Notifications as Read

Bulk mark multiple notifications as read in a single request.

**Endpoint:** `PUT /read-all`

**Request Body:**

```json
{
  "notificationIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "3 notifications marked as read",
  "data": {
    "acknowledged": true,
    "modifiedCount": 3,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 3
  }
}
```

**Examples:**

```bash
# Mark multiple notifications as read
curl -X PUT "http://localhost:5000/api/v1/notifications/read-all" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationIds": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012"
    ]
  }'
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Notifications marked as read successfully |
| 400 | Invalid request - notificationIds must be an array |
| 403 | Forbidden - one or more notifications belong to another user |
| 401 | Unauthorized - missing or invalid token |

---

### 7. Delete Notification

Delete a single notification permanently.

**Endpoint:** `DELETE /:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Notification ID (MongoDB ObjectId) |

**Response:**

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

**Example:**

```bash
curl -X DELETE "http://localhost:5000/api/v1/notifications/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <token>"
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Notification deleted successfully |
| 403 | Forbidden - notification belongs to another user |
| 404 | Notification not found |
| 401 | Unauthorized - missing or invalid token |

---

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad request - invalid parameters |
| 401 | Unauthorized - missing or invalid token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found - resource doesn't exist |
| 500 | Internal server error |

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Examples:**

```json
{
  "success": false,
  "message": "Notification not found"
}
```

```json
{
  "success": false,
  "message": "Invalid notification type"
}
```

---

## Usage Examples

### 1. Check for New Notifications on App Load

```bash
# Get all unread notifications
curl -X GET "http://localhost:5000/api/v1/notifications?read=false" \
  -H "Authorization: Bearer <token>"
```

### 2. Display Unread Badge

```bash
# Get unread count for badge display
curl -X GET "http://localhost:5000/api/v1/notifications/unread-count" \
  -H "Authorization: Bearer <token>"
```

### 3. Mark Notification as Read When User Views It

```bash
# Mark a notification as read
curl -X PUT "http://localhost:5000/api/v1/notifications/507f1f77bcf86cd799439011/read" \
  -H "Authorization: Bearer <token>"
```

### 4. Load Shipment Notifications

```bash
# Get all shipment notifications with pagination
curl -X GET "http://localhost:5000/api/v1/notifications/type/SHIPMENT?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 5. Mark All Notifications as Read

```bash
# First, get all unread notification IDs
UNREAD=$(curl -X GET "http://localhost:5000/api/v1/notifications?read=false" \
  -H "Authorization: Bearer <token>" | jq '.data[].id')

# Then mark them all as read
curl -X PUT "http://localhost:5000/api/v1/notifications/read-all" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d "{\"notificationIds\": [${UNREAD}]}"
```

### 6. Clean Up Old Notifications

```bash
# Get a notification by ID
NOTIF_ID=$(curl -X GET "http://localhost:5000/api/v1/notifications?limit=1" \
  -H "Authorization: Bearer <token>" | jq '.data[0]._id')

# Delete it
curl -X DELETE "http://localhost:5000/api/v1/notifications/${NOTIF_ID}" \
  -H "Authorization: Bearer <token>"
```

---

## Automatic Notifications

### Shipment Notifications

The system automatically creates notifications when a shipment's tracking stage changes:

| Stage | Title | Message |
|-------|-------|---------|
| PACKAGE_RECEIVED | Package Received | Your package has been received at our facility. Shipment #[number] is now in our warehouse. |
| IN_CUSTOMS | In Customs | Shipment #[number] is currently being processed through customs. |
| IN_TRANSIT | In Transit | Shipment #[number] is now in transit and on its way to you. |
| ARRIVED_NIGERIAN_CUSTOMS | Arrived Nigerian Customs | Shipment #[number] has arrived at Nigerian customs. |
| ARRIVED_WAREHOUSE | Arrived at Warehouse | Shipment #[number] has arrived at our warehouse and is ready for delivery. |
| OUT_FOR_DELIVERY | Out for Delivery | Shipment #[number] is out for delivery. You should receive it shortly. |

**How it works:**
1. Admin/Staff updates shipment tracking stage
2. Notification is automatically created for the customer
3. Customer sees notification in their notification center

### Announcement Notifications

When a new blog post is published, announcement notifications are created for all active customers:

**Title:** `New Blog Post: [blog_title]`

**Message:** `[blog_excerpt]`

**How it works:**
1. Blog post is published
2. Notifications created for all active customers
3. Customers receive in-app notification
4. Email is also sent (if configured)

---

## Pagination

Most list endpoints support pagination. Use the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (starts at 1) |
| `limit` | number | 20 | Number of items per page (max 100 recommended) |

**Response includes:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

## Best Practices

1. **Always check for unread count** when user opens the app to update UI badges
2. **Mark notifications as read** immediately when user views them
3. **Use type filters** to display different notification categories
4. **Implement pagination** for performance with many notifications
5. **Delete old notifications** periodically to manage database size
6. **Handle 401 errors** by redirecting to login
7. **Display shipment notifications** in a tracking timeline view
8. **Show announcements** in a dedicated announcements section

---

## Rate Limiting

Currently no rate limiting is applied. Consider implementing rate limiting for production:

- List endpoints: 60 requests/minute
- Update endpoints: 120 requests/minute

---

## Future Enhancements

- Real-time notifications via WebSocket
- Email digest notifications
- User notification preferences
- Notification templates management
- Push notifications integration
- Notification expiration/archival
- Notification grouping by date

---

## Support

For issues or questions about the Notifications API, please refer to the main API documentation or contact support.
