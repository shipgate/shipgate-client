import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react"
import Link from "next/link"
import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { getBlogBySlug, getAllBlogSlugs, getBlogPosts } from "@/lib/blog-api"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).slug
  const post = await getBlogBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | Shipgate Blog",
    }
  }

  const baseUrl = "https://shipgate.ng"
  const url = `${baseUrl}/blog/${post.slug}`

  return {
    title: `${post.title} | Shipgate Blog`,
    description: post.excerpt,
    keywords: [post.category, "shipgate", "shipping", "logistics"],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: url,
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author?.fullName],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
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
      canonical: url,
    },
    authors: post.author
      ? [
          {
            name: post.author.fullName,
            url: baseUrl,
          },
        ]
      : [],
  }
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()

  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function BlogPostPage({ params }: Props) {
  const slug = (await params).slug
  const post = await getBlogBySlug(slug)

  if (!post) {
    notFound()
  }

  // Fetch related posts
  const { posts: allPosts } = await getBlogPosts(1, 100)
  const relatedPosts = allPosts
    .filter((p: BlogPost) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.fullName,
          email: post.author.email,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Shipgate",
      logo: {
        "@type": "ImageObject",
        url: "https://shipgate.ng/logo.png",
        width: 250,
        height: 60,
      },
    },
    mainEntity: {
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <Card className="mb-8">
            <CardContent className="pt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-primary/10 text-primary">{post.category}</Badge>
                  <span className="text-sm text-foreground/60">
                    {Math.ceil(post.content.split(" ").length / 200)} min read
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-foreground leading-tight">{post.title}</h1>

                <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-4">
                  <div className="flex items-center gap-6 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author?.fullName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
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
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <Card>
            <CardContent className="pt-8">
              <article className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
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

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost: BlogPost) => (
                  <Link key={relatedPost._id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                      <CardContent className="pt-4">
                        <Badge className="bg-primary/10 text-primary mb-2">{relatedPost.category}</Badge>
                        <h4 className="font-semibold text-foreground line-clamp-2">{relatedPost.title}</h4>
                        <p className="text-xs text-foreground/60 mt-2">
                          {Math.ceil(relatedPost.content.split(" ").length / 200)} min read
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-12">
            <NewsletterSubscription />
          </div>
        </article>
      </main>
    </>
  )
}
