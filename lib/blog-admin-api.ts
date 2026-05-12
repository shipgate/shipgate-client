import { API } from "@/lib/constants"

interface BlogPost {
  _id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  image?: string
  status: "draft" | "published"
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Admin blog API functions
 */

export async function createBlogPost(
  formData: FormData,
  token: string
): Promise<{
  success: boolean
  message: string
  data?: BlogPost
}> {
  try {
    const response = await fetch(`${API}/api/v1/blog`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create blog post")
    }

    return { success: true, message: data.message, data: data.data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create blog post",
    }
  }
}

export async function updateBlogPost(
  postId: string,
  formData: FormData,
  token: string
): Promise<{
  success: boolean
  message: string
  data?: BlogPost
}> {
  try {
    const response = await fetch(`${API}/api/v1/blog/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to update blog post")
    }

    return { success: true, message: data.message, data: data.data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update blog post",
    }
  }
}

export async function publishBlogPost(
  postId: string,
  token: string
): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch(`${API}/api/v1/blog/${postId}/publish`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to publish blog post")
    }

    return { success: true, message: data.message }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to publish blog post",
    }
  }
}

export async function deleteBlogPost(
  postId: string,
  token: string
): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch(`${API}/api/v1/blog/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete blog post")
    }

    return { success: true, message: data.message }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete blog post",
    }
  }
}

export async function getAdminBlogPosts(
  token: string,
  page = 1,
  limit = 10,
  status?: "draft" | "published"
): Promise<{
  posts: BlogPost[]
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  try {
    let url = `${API}/api/v1/blog/admin/all?page=${page}&limit=${limit}`
    if (status) url += `&status=${status}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch blog posts")
    }

    return {
      posts: data.data || [],
      pagination: data.pagination || { page, limit, total: 0, pages: 0 },
    }
  } catch (error: any) {
    console.error("Error fetching admin blog posts:", error)
    return { posts: [], pagination: { page, limit, total: 0, pages: 0 } }
  }
}
