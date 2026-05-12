import { API } from "@/lib/constants"

export async function subscribeToNewsletter(email: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch(`${API}/api/v1/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to subscribe")
    }

    return {
      success: true,
      message: data.message || "Subscribed successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to subscribe to newsletter",
    }
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch(`${API}/api/v1/newsletter/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to unsubscribe")
    }

    return {
      success: true,
      message: data.message || "Unsubscribed successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to unsubscribe",
    }
  }
}

export async function getNewsletterSubscribers(token: string, page = 1, limit = 10): Promise<{
  subscribers: Array<{ _id: string; email: string; subscribedAt: string; isActive: boolean }>
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  try {
    const response = await fetch(`${API}/api/v1/newsletter/subscribers?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch subscribers")
    }

    return {
      subscribers: data.data || [],
      pagination: data.pagination || { page, limit, total: 0, pages: 0 },
    }
  } catch (error: any) {
    console.error("Error fetching subscribers:", error)
    return {
      subscribers: [],
      pagination: { page, limit, total: 0, pages: 0 },
    }
  }
}
