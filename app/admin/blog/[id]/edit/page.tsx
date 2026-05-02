"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const categories = ["Packaging", "Shipping Guide", "Customs", "Tutorial", "Insurance", "Pricing"]

// Mock articles database
const mockArticles: Record<number, any> = {
  1: {
    id: 1,
    title: "Tips for Optimal Packaging: Ensure Safe Delivery",
    slug: "tips-optimal-packaging",
    category: "Packaging",
    author: "John Smith",
    excerpt: "Learn the best practices for packaging your items to prevent damage during transit.",
    content: "# Optimal Packaging Tips\n\nProper packaging is essential for safe delivery...",
    image: "/shipping-packaging.jpg",
    published: true,
  },
  2: {
    id: 2,
    title: "Air vs Sea Shipping: Which One is Right for You?",
    slug: "air-vs-sea-shipping",
    category: "Shipping Guide",
    author: "Sarah Johnson",
    excerpt: "Compare air and sea shipping options to make the best choice for your business needs.",
    content: "# Air vs Sea Shipping\n\nChoosing between air and sea shipping...",
    image: "/airport-cargo-logistics.jpg",
    published: true,
  },
  3: {
    id: 3,
    title: "Complete Guide to Customs Documentation",
    slug: "customs-documentation-guide",
    category: "Customs",
    author: "Michael Chen",
    excerpt: "Everything you need to know about customs forms, HS codes, and required documentation.",
    content: "# Customs Documentation Guide\n\nCustoms documentation is crucial...",
    image: "/customs-border-checkpoint.jpg",
    published: true,
  },
}

export default function EditBlogArticlePage({ params }: { params: { id: string } }) {
  const articleId = Number.parseInt(params.id)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Shipping Guide",
    author: "",
    excerpt: "",
    content: "",
    image: "",
    published: false,
  })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const article = mockArticles[articleId]
    if (article) {
      setFormData(article)
    }
    setIsLoading(false)
  }, [articleId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSave = () => {
    console.log("[v0] Article updated:", formData)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
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

  if (isLoading) {
    return <div className="text-center py-12">Loading article...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
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

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Author</label>
                  <Input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    className="h-11"
                  />
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
              <Input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/shipping-example.jpg"
                className="h-11"
              />
              {formData.image && (
                <div className="w-full h-40 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={formData.image || "/placeholder.svg"}
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

                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                  <Save className="w-4 h-4" />
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
