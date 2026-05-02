export interface User {
  id: string
  email: string
  password: string
  fullName: string
  phone: string
  company: string
  walletBalance: number
  kyc_verified: boolean
  kyc_documents: string[]
  created_at: Date
  updated_at: Date
}

export interface Shipment {
  id: string
  userId: string
  trackingNumber: string
  shippingType: "air" | "sea" // air or sea
  containerType?: "20ft" | "40ft" | "cbm" // for sea shipping
  weight?: number // kg for air
  cbmVolume?: number // for sea shipping
  origin: string
  destination: string
  status: "pending" | "in_transit" | "arrived" | "delivered"
  totalCost: number
  created_at: Date
  updated_at: Date
}

export interface TrackingUpdate {
  id: string
  shipmentId: string
  location: string
  status: string
  timestamp: Date
  details: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  featured_image: string
  published: boolean
  created_at: Date
  updated_at: Date
}

export interface Notification {
  id: string
  userId: string
  type: "fee_update" | "exchange_rate" | "blog_post" | "shipment_update"
  title: string
  message: string
  link?: string
  read: boolean
  created_at: Date
}

export interface ExchangeRate {
  id: string
  currency: string // 'USD_NGN' or 'CNY_NGN'
  rate: number
  updated_at: Date
}

// Shipping prices
export const SHIPPING_PRICES = {
  air: 7.2, // USD per kg
  sea: {
    cbm: 510, // USD per CBM
    "20ft": 5400, // USD
    "40ft": 7200, // USD
  },
}
