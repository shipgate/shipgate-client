"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth"
import { getBlogPost, updateBlogPost } from "@/lib/blog-admin-api"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useParams } from "next/navigation"

const categories = ["Packaging", "Shipping Guide", "Customs", "Tutorial", "Insurance", "Pricing"]

export default function EditBlogArticlePage() {
  const token = useAuthStore((state) => state.token)
  const params = useParams()
  const articleId = params.id
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Shipping Guide",
    excerpt: "",
    content: "",
    published: false,
  })
  const [imageType, setImageType] = useState<'file' | 'url'>('url')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!token) return
      setIsFetching(true)
      const result = await getBlogPost(String(articleId), token)
      if (result.success && result.data) {
        const post = result.data
        setFormData({
          title: post.title,
          slug: post.slug,
          category: post.category.charAt(0).toUpperCase() + post.category.slice(1), // capitalize
          excerpt: post.excerpt,
          content: post.content,
          published: post.status === 'published',
        })
        if (post.image) {
          if (post.image.startsWith('http')) {
            setImageType('url')
            setImageUrl(post.image)
          } else {
            // assume it's a file, but since we can't load file, set to url
            setImageType('url')
            setImageUrl(post.image)
          }
        }
      } else {
        toast.error(result.message)
      }
      setIsFetching(false)
    }
    fetchPost()
  }, [articleId, token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSave = async () => {
    if (!token) {
      toast.error("Authentication required")
      return
    }

    setIsLoading(true)
    const data = new FormData()
    data.append('title', formData.title)
    data.append('slug', formData.slug)
    data.append('category', formData.category.toLowerCase())
    data.append('excerpt', formData.excerpt)
    data.append('content', formData.content)
    data.append('status', formData.published ? 'published' : 'draft')

    if (imageType === 'file' && imageFile) {
      data.append('image', imageFile)
    } else if (imageType === 'url' && imageUrl) {
      data.append('image', imageUrl)
    }

    const result = await updateBlogPost(String(articleId), data, token)
    if (result.success) {
      setSaveSuccess(true)
      toast.success("Blog post updated successfully")
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      toast.error(result.message)
    }
    setIsLoading(false)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    handleChange(e)
    setFormData((prev) => ({ ...prev, slug: generateSlug(title) }))
  }

  if (isFetching) {
    return <div className="text-center py-12"><LoadingSpinner /></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/super-admin/blog">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
          <p className="text-foreground/70 mt-1">Update the article details</p>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-green-800">Article updated successfully!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Slug */}
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter article title"
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Slug (URL)</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2 bg-muted text-foreground/60 text-sm rounded-lg">
                    /blog/
                  </span>
                  <Input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="article-slug"
                    className="h-11 flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-11 px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article (shown in blog listing)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-foreground/40"
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article content here. Use markdown format."
                rows={12}
                className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-foreground/40 font-mono text-sm"
              />
              <p className="text-xs text-foreground/60 mt-2">Supports markdown formatting</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={imageType === 'url'}
                    onChange={() => setImageType('url')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Enter URL</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageType"
                    value="file"
                    checked={imageType === 'file'}
                    onChange={() => setImageType('file')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Upload File</span>
                </label>
              </div>

              {imageType === 'url' ? (
                <Input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-11"
                />
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="h-11"
                />
              )}

              {((imageType === 'url' && imageUrl) || (imageType === 'file' && imageFile)) && (
                <div className="w-full h-40 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={imageType === 'url' ? imageUrl : URL.createObjectURL(imageFile!)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publish */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Publish</span>
              </label>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-foreground/60 mb-4">
                  {formData.published ? "This article is visible on the blog." : "This article is saved as draft."}
                </p>

                <Button onClick={handleSave} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                  {isLoading ? <LoadingSpinner /> : <Save className="w-4 h-4" />}
                  Update Article
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
