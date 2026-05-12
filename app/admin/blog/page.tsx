"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getAdminBlogPosts, deleteBlogPost } from "@/lib/blog-admin-api"
import { ConfirmationDialog } from "@/components/confirm-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"

interface BlogPost {
  _id: string
  title: string
  slug: string
  category: string
  excerpt: string
  status: "draft" | "published"
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface ConfirmDialogState {
  open: boolean
  id: string
  title: string
  message: string
  actionText: string
}

export default function BlogAdminPage() {
  const { token } = useAuthStore()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all")
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    id: "",
    title: "",
    message: "",
    actionText: "Delete post",
  })

  useEffect(() => {
    if (token) {
      fetchPosts()
    }
  }, [token])

  const fetchPosts = async () => {
    try {
      const status = statusFilter === "all" ? undefined : (statusFilter as "draft" | "published")
      const data = await getAdminBlogPosts(token!, 1, 100, status)
      setPosts(data.posts)
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch blog posts")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id) return

    setIsDeleting(true)
    try {
      const result = await deleteBlogPost(confirmDialog.id, token!)
      if (result.success) {
        toast.success("Blog post deleted successfully")
        fetchPosts()
      } else {
        toast.error(result.message)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete blog post")
    } finally {
      setIsDeleting(false)
      setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete post" })
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = Array.from(new Set(posts.map((p) => p.category)))

  if (loading) {
    return <LoadingSpinner label="Loading blog posts..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Blog Articles</h1>
          <p className="text-foreground/70 mt-1">Create, edit, and manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-foreground hover:border-primary"
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "draft"
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-foreground hover:border-primary"
                }`}
              >
                Drafts
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "published"
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-foreground hover:border-primary"
                }`}
              >
                Published
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{post.title}</p>
                          <p className="text-xs text-foreground/60">{post.slug}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{post.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground/70">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/blog/${post._id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                id: post._id,
                                title: "Delete post",
                                message: `Delete "${post.title}"? This cannot be undone.`,
                                actionText: "Delete post",
                              })
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-foreground/60">
                      No blog posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.actionText}
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, id: "", title: "", message: "", actionText: "Delete post" })}
      />
    </div>
  )
}
