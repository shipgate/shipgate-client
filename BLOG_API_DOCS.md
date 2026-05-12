# Shipgate Blog and Newsletter API Documentation

## Overview
Blog management system for admins and super admins, with newsletter functionality for email notifications.

## Features
- Admin-only blog post creation and management
- Public blog post retrieval by category, slug, or ID
- Newsletter subscription/unsubscription
- Automatic email notifications for new blog posts

## Environment Variables Required
Ensure these are set in your `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_email_api_key
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Blog API Endpoints

### Admin Endpoints (Require Authentication + Admin/Super Admin Role)

#### **POST /api/v1/blog**
Create a new blog post

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` (string, required): Blog post title
- `slug` (string, required): URL-friendly slug
- `category` (string, required): One of: packaging, shipping guide, customs, Tutorial, Insurance, pricing, other
- `excerpt` (string, required): Short description
- `content` (string, required): Full blog content
- `status` (string, optional): 'draft' or 'published' (defaults to 'draft')
- `image` (file, optional): Blog post image

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "_id": "60d5ec49d1c7f12345678901",
    "title": "Shipping Guide 101",
    "slug": "shipping-guide-101",
    "category": "shipping guide",
    "author": "60d5ec49d1c7f12345678902",
    "excerpt": "Learn the basics of shipping",
    "content": "Full content here...",
    "image": "https://cloudinary.com/image.jpg",
    "status": "draft",
    "publishedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **PUT /api/v1/blog/:id**
Edit an existing blog post

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` (string, optional): Updated title
- `slug` (string, optional): Updated slug
- `category` (string, optional): Updated category
- `excerpt` (string, optional): Updated excerpt
- `content` (string, optional): Updated content
- `image` (file, optional): New image

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Blog post updated successfully",
  "data": { ... }
}
```

#### **PATCH /api/v1/blog/:id/publish**
Publish a draft blog post

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Blog post published successfully",
  "data": { ... }
}
```

#### **DELETE /api/v1/blog/:id**
Delete a blog post

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

#### **GET /api/v1/blog/admin/all**
Get all blog posts (admin view with drafts)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status ('draft' or 'published')

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Public Endpoints

#### **GET /api/v1/blog**
Get all published posts (user view)


**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status ('draft' or 'published')

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```


#### **GET /api/v1/blog/category/:category**
Get published blog posts by category

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

#### **GET /api/v1/blog/:id**
Get a blog post by ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49d1c7f12345678901",
    "title": "Shipping Guide 101",
    "slug": "shipping-guide-101",
    "category": "shipping guide",
    "author": {
      "_id": "60d5ec49d1c7f12345678902",
      "fullName": "Admin User",
      "email": "admin@shipgate.ng"
    },
    "excerpt": "Learn the basics of shipping",
    "content": "Full content here...",
    "image": "https://cloudinary.com/image.jpg",
    "status": "published",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **GET /api/v1/blog/slug/:slug**
Get a published blog post by slug

**Response (Success - 200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Newsletter API Endpoints

### Public Endpoints

#### **POST /api/v1/newsletter/subscribe**
Subscribe to newsletter

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Subscribed to newsletter successfully"
}
```

#### **POST /api/v1/newsletter/unsubscribe**
Unsubscribe from newsletter

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Unsubscribed from newsletter successfully"
}
```

### Admin Endpoints (Require Authentication + Admin/Super Admin Role)

#### **GET /api/v1/newsletter/subscribers**
Get all newsletter subscribers

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49d1c7f12345678903",
      "email": "subscriber@example.com",
      "subscribedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Error Responses

All endpoints may return the following error formats:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "You are not authenticated. Please provide a token."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Only admins can access this resource"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Blog post not found"
}
```

---

## Notes

- Blog posts are created as drafts by default unless `status: 'published'` is specified
- Publishing a blog post automatically sends email notifications to newsletter subscribers and customers
- Image uploads are handled via Cloudinary
- Slugs must be unique across all blog posts
- Newsletter subscriptions prevent duplicate emails
- Unsubscribing sets `isActive: false` but keeps the record for audit purposes