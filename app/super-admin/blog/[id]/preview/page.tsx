"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bookmark, Calendar, Save, Share2, User } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth"
import { getBlogPost, updateBlogPost } from "@/lib/blog-admin-api"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    publishedAt: "",
    author: "",
    image: "",
    createdAt: "",
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
          publishedAt: post.publishedAt??'',
          createdAt: post.createdAt,
          author: post.author?.fullName??'',
          image: post.image??'',
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
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/admin/blog" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Exit Preview
          </Link>

          {/* Article Header */}
          <Card className="mb-8">
            <CardContent className="pt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-primary/10 text-primary">{formData.category}</Badge>
                  <span className="text-sm text-foreground/60">
                    {Math.ceil(formData.content.split(" ").length / 200)} min read
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-foreground leading-tight">{formData.title}</h1>

                <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-4">
                  <div className="flex items-center gap-6 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {formData.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(formData.publishedAt || formData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          {formData.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <Card>
            <CardContent className="pt-8">
              <article className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {formData.content}
              </ReactMarkdown>
              </article>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="mt-8 bg-primary text-white border-0">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Ship?</h3>
                <p className="text-white/90 mb-6">Get started with SHIPGATE today for fast, reliable shipping.</p>
                <Link href="/calculator">
                  <Button className="bg-white text-primary hover:bg-white/90">Calculate Your Shipping Cost</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>
  )
}
