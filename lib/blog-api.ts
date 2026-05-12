import { API } from "@/lib/constants"

interface BlogPost {
  _id: string
  title: string
  slug: string
  category: string
  author: {
    _id: string
    fullName: string
    email: string
  }
  excerpt: string
  content: string
  image?: string
  status: "draft" | "published"
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface BlogResponse {
  success: boolean
  data?: BlogPost | BlogPost[]
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

/**
 * Server-side blog API functions
 * These should be used in Server Components and API Routes
 */

export async function getBlogPosts(page = 1, limit = 10): Promise<{
  posts: BlogPost[]
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  try {
    const response = await fetch(`${API}/api/v1/blog?page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) throw new Error("Failed to fetch blog posts")

    const data: BlogResponse = await response.json()
    return {
      posts: (Array.isArray(data.data) ? data.data : []) as BlogPost[],
      pagination: data.pagination || { page, limit, total: 0, pages: 0 },
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { posts: [], pagination: { page, limit, total: 0, pages: 0 } }
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API}/api/v1/blog/slug/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) return null

    const data: BlogResponse = await response.json()
    return (data.data as BlogPost) || null
  } catch (error) {
    console.error("Error fetching blog by slug:", error)
    return null
  }
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API}/api/v1/blog/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) return null

    const data: BlogResponse = await response.json()
    return (data.data as BlogPost) || null
  } catch (error) {
    console.error("Error fetching blog by ID:", error)
    return null
  }
}

export async function getBlogByCategory(
  category: string,
  page = 1,
  limit = 10
): Promise<{ posts: BlogPost[]; pagination: any }> {
  try {
    const response = await fetch(`${API}/api/v1/blog/category/${category}?page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) throw new Error("Failed to fetch blog posts by category")

    const data: BlogResponse = await response.json()
    return {
      posts: (Array.isArray(data.data) ? data.data : []) as BlogPost[],
      pagination: data.pagination || { page, limit, total: 0, pages: 0 },
    }
  } catch (error) {
    console.error("Error fetching blog posts by category:", error)
    return { posts: [], pagination: { page, limit, total: 0, pages: 0 } }
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${API}/api/v1/blog?limit=1000`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) return []

    const data: BlogResponse = await response.json()
    const posts = Array.isArray(data.data) ? (data.data as BlogPost[]) : []
    return posts.map((post) => post.slug)
  } catch (error) {
    console.error("Error fetching blog slugs:", error)
    return []
  }
}
