import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { getBlogPosts } from "@/lib/blog-api"

export const metadata: Metadata = {
  title: "Blog & Resources | Shipgate - Shipping from China to Nigeria",
  description:
    "Expert tips, guides, and updates about shipping from China to Nigeria. Learn about packaging, customs, insurance, and logistics best practices.",
  keywords: [
    "shipping blog",
    "logistics guide",
    "china nigeria shipping",
    "customs documentation",
    "packaging tips",
    "shipping insurance",
  ],
  openGraph: {
    title: "Blog & Resources | Shipgate",
    description: "Expert tips and guides for shipping from China to Nigeria",
    type: "website",
    url: "https://shipgate.ng/blog",
    images: [
      {
        url: "https://shipgate.ng/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Shipgate Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Resources | Shipgate",
    description: "Expert tips and guides for shipping from China to Nigeria",
    images: ["https://shipgate.ng/og-blog.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://shipgate.ng/blog",
  },
}

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
  content?: string
  image?: string
  status: "draft" | "published"
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface SearchParams {
  page?: string
  category?: string
  search?: string
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const selectedCategory = params.category
  const searchTerm = params.search || ""

  const { posts, pagination } = await getBlogPosts(page, 10)

  // Filter posts client-side for search and category (in production, use API filters)
  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set(posts.map((p: BlogPost) => p.category)))

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Shipgate Blog",
    description:
      "Expert tips and guides for shipping from China to Nigeria",
    url: "https://shipgate.ng/blog",
    image: "https://shipgate.ng/og-blog.jpg",
    blogPost: filteredPosts.map((post: BlogPost) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.publishedAt || post.createdAt,
      author: {
        "@type": "Person",
        name: post.author?.fullName,
      },
      url: `https://shipgate.ng/blog/${post.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
                    defaultValue={searchTerm}
                    className="pl-10 h-11"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog">
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        !selectedCategory
                          ? "bg-primary text-white"
                          : "bg-white border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      All Articles
                    </button>
                  </Link>
                  {categories.map((category) => (
                    <Link key={category} href={`/blog?category=${category}`}>
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-white"
                            : "bg-white border border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {category}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts Grid */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post: BlogPost) => (
                <Link key={post._id} href={`/blog/${post.slug}`}>
                  <article className="block">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="grid md:grid-cols-4 h-full">
                        {/* Image */}
                        <div className="relative md:h-auto h-48 bg-muted overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Content */}
                        <CardContent className="md:col-span-3 pt-6 pb-6">
                          <div className="flex flex-col justify-between h-full">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{post.category}</Badge>
                              </div>

                              <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{post.title}</h2>

                              <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-foreground/60">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {post.author?.fullName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </article>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 text-center pb-12">
                  <p className="text-foreground/60 mb-4">No articles found matching your search.</p>
                  <Link href="/blog">
                    <Button variant="outline">Clear Filters</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/blog?page=${p}`}>
                  <Button
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    className={page === p ? "bg-primary" : ""}
                  >
                    {p}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Newsletter Section */}
          <div className="mt-16">
            <NewsletterSubscription />
          </div>
        </div>
      </main>
    </>
  )
}
