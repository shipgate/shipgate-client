"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"

interface BlogArticle {
  id: number
  title: string
  slug: string
  category: string
  author: string
  date: string
  excerpt: string
  published: boolean
}

const initialArticles: BlogArticle[] = [
  {
    id: 1,
    title: "Tips for Optimal Packaging: Ensure Safe Delivery",
    slug: "tips-optimal-packaging",
    category: "Packaging",
    author: "John Smith",
    date: "2025-11-07",
    excerpt: "Learn the best practices for packaging your items to prevent damage during transit.",
    published: true,
  },
  {
    id: 2,
    title: "Air vs Sea Shipping: Which One is Right for You?",
    slug: "air-vs-sea-shipping",
    category: "Shipping Guide",
    author: "Sarah Johnson",
    date: "2025-11-05",
    excerpt: "Compare air and sea shipping options to make the best choice for your business needs.",
    published: true,
  },
  {
    id: 3,
    title: "Complete Guide to Customs Documentation",
    slug: "customs-documentation-guide",
    category: "Customs",
    author: "Michael Chen",
    date: "2025-11-03",
    excerpt: "Everything you need to know about customs forms, HS codes, and required documentation.",
    published: true,
  },
]

function BlogAdminContent() {
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || article.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(articles.map((a) => a.category)))

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((a) => a.id !== id))
    }
  }

  const handleTogglePublish = (id: number) => {
    setArticles(articles.map((a) => (a.id === id ? { ...a, published: !a.published } : a)))
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

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === null
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-foreground hover:border-primary"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === category
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Author</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground line-clamp-1">{article.title}</div>
                      <div className="text-xs text-foreground/60 mt-1">/{article.slug}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{article.category}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground/70">{article.author}</td>
                    <td className="py-4 px-4 text-sm text-foreground/70">
                      {new Date(article.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(article.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          article.published
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/blog/${article.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-foreground/60">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BlogAdminPage() {
  return <BlogAdminContent />
}
