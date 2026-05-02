"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    slug: "tips-optimal-packaging",
    title: "Tips for Optimal Packaging: Ensure Safe Delivery",
    excerpt:
      "Learn the best practices for packaging your items to prevent damage during transit from China to Nigeria.",
    content:
      "Proper packaging is crucial for safe delivery. Use quality materials, add protective layers, and ensure correct weight distribution.",
    author: "John Smith",
    date: "2025-11-07",
    category: "Packaging",
    image: "/shipping-packaging.jpg",
    readTime: "5 min read",
  },
  {
    id: 2,
    slug: "air-vs-sea-shipping",
    title: "Air vs Sea Shipping: Which One is Right for You?",
    excerpt: "Compare air and sea shipping options to make the best choice for your business needs and budget.",
    content:
      "Air shipping is faster but more expensive. Sea shipping is economical for large volumes. Consider your timeline and volume requirements.",
    author: "Sarah Johnson",
    date: "2025-11-05",
    category: "Shipping Guide",
    image: "/airport-cargo-logistics.jpg",
    readTime: "7 min read",
  },
  {
    id: 3,
    slug: "customs-documentation-guide",
    title: "Complete Guide to Customs Documentation",
    excerpt:
      "Everything you need to know about customs forms, HS codes, and required documentation for China-Nigeria shipments.",
    content:
      "We handle all customs documentation for you. Ensure accurate HS codes and proper declarations to avoid delays.",
    author: "Michael Chen",
    date: "2025-11-03",
    category: "Customs",
    image: "/customs-border-checkpoint.jpg",
    readTime: "8 min read",
  },
  {
    id: 4,
    slug: "track-your-shipment-real-time",
    title: "How to Track Your Shipment in Real-Time",
    excerpt:
      "Step-by-step guide on using our tracking system to monitor your package from China warehouse to Nigeria delivery.",
    content:
      "Use your tracking number on our website or mobile app to get live updates. You'll see every checkpoint in the journey.",
    author: "Emily Davis",
    date: "2025-11-01",
    category: "Tutorial",
    image: "/gps-tracking-location.jpg",
    readTime: "4 min read",
  },
  {
    id: 5,
    slug: "insurance-coverage-explained",
    title: "Understanding Insurance Coverage for Your Shipments",
    excerpt:
      "Comprehensive explanation of what's covered under our standard insurance and how to file claims if needed.",
    content:
      "All shipments include basic insurance. Additional coverage available for high-value items. File claims within 30 days of delivery.",
    author: "David Wilson",
    date: "2025-10-30",
    category: "Insurance",
    image: "/insurance-protection-coverage.jpg",
    readTime: "6 min read",
  },
  {
    id: 6,
    slug: "exchange-rates-impact",
    title: "Understanding Exchange Rates and Pricing",
    excerpt:
      "Learn how USD-NGN and CNY-NGN exchange rates affect your shipping costs and how to optimize your expenses.",
    content:
      "Exchange rates fluctuate daily. Lock in rates when favorable. Our pricing is transparent and competitive.",
    author: "Lisa Anderson",
    date: "2025-10-28",
    category: "Pricing",
    image: "/currency-exchange-rates.jpg",
    readTime: "5 min read",
  },
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(blogPosts.map((p) => p.category)))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">Blog & Resources</h1>
            <p className="text-lg text-foreground/70">
              Expert tips, guides, and updates about shipping from China to Nigeria
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
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

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === null
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-foreground hover:border-primary"
                    }`}
                  >
                    All Articles
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
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

          {/* Blog Posts Grid */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="grid md:grid-cols-4 h-full">
                      {/* Image */}
                      <div className="relative md:h-auto h-48 bg-muted overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <CardContent className="md:col-span-3 pt-6 pb-6">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{post.category}</Badge>
                              <span className="text-xs text-foreground/60">{post.readTime}</span>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>

                            <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-foreground/60">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString()}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 text-center pb-12">
                  <p className="text-foreground/60 mb-4">No articles found matching your search.</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory(null)
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Newsletter Section */}
          <Card className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Stay Updated</h3>
                <p className="text-foreground/70 mb-6 max-w-md mx-auto">
                  Subscribe to get the latest shipping tips, fee updates, and exchange rate alerts.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <Input type="email" placeholder="your@email.com" className="h-12" />
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12">Subscribe</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
