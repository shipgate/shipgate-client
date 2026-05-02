"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { useParams } from "next/navigation"

const blogPosts: Record<string, any> = {
  "tips-optimal-packaging": {
    title: "Tips for Optimal Packaging: Ensure Safe Delivery",
    author: "John Smith",
    date: "2025-11-07",
    category: "Packaging",
    readTime: "5 min read",
    image: "/shipping-packaging-boxes.jpg",
    content: `
      Proper packaging is crucial for safe delivery. When shipping from China to Nigeria, your items face various conditions including temperature changes, humidity, vibrations during transport, and rough handling at port facilities. Here's how to ensure your packages arrive in perfect condition.

      ## 1. Choose Quality Materials

      Invest in sturdy packaging materials:
      - Use corrugated cardboard boxes (minimum 3mm thickness)
      - Add bubble wrap or foam padding for protection
      - Use quality packing tape (waterproof and durable)
      - Consider wooden crates for fragile or heavy items

      ## 2. Proper Weight Distribution

      Uneven weight distribution can cause damage:
      - Place heavier items at the bottom
      - Use dividers for multiple items
      - Fill empty spaces with padding material
      - Don't exceed weight limits for boxes

      ## 3. Seal Everything Tightly

      Water damage is common during sea shipping:
      - Use waterproof tape on all seams
      - Consider plastic wrapping for moisture protection
      - Add desiccant packets for humidity control
      - Double-box fragile items

      ## 4. Label Clearly

      Proper labeling prevents mishandling:
      - Mark "Fragile" on all sides if applicable
      - Use "This Side Up" arrows
      - Include weight information
      - Attach tracking information securely

      ## 5. Document Everything

      Keep detailed records:
      - Take photos before shipping
      - Keep packaging receipts
      - Document contents and values
      - Insurance requires this information for claims

      Following these guidelines ensures your shipments arrive safely in Nigeria!
    `,
  },
  "air-vs-sea-shipping": {
    title: "Air vs Sea Shipping: Which One is Right for You?",
    author: "Sarah Johnson",
    date: "2025-11-05",
    category: "Shipping Guide",
    readTime: "7 min read",
    image: "/cargo-plane-airport.jpg",
    content: `
      Choosing between air and sea shipping can significantly impact your costs and delivery timelines. Let's break down the key differences to help you make the best decision for your business.

      ## Air Shipping: Speed & Reliability

      **Pricing**: $8.90 per kilogram

      **Delivery Time**: 10-15 days

      **Best for**:
      - Urgent shipments
      - High-value items
      - Time-sensitive products
      - Smaller quantities
      - Perishable goods

      **Advantages**:
      - Fastest delivery option
      - Lower theft risk
      - Better handling standards
      - Real-time tracking
      - Full insurance coverage

      **Disadvantages**:
      - More expensive
      - Weight limitations
      - Minimum charge may apply

      ## Sea Shipping: Economy & Capacity

      **Pricing**: $510/CBM or $5,400-$7,200 for containers

      **Delivery Time**: 45-60 days

      **Best for**:
      - Large volumes
      - Non-urgent shipments
      - Heavy items
      - Cost-sensitive shipments
      - Full container loads

      **Advantages**:
      - Most economical option
      - Unlimited weight capacity
      - Large volume accommodation
      - Suitable for bulk orders

      **Disadvantages**:
      - Longer delivery time
      - Port-to-port logistics
      - Requires customs clearance at ports

      ## Cost Comparison Example

      1000 kg shipment:
      - Air: 1000 × $8.90 = $8,900
      - Sea: 1000 kg ≈ 1.5 CBM = 1.5 × $510 = $765

      Sea shipping is significantly cheaper for heavy items!

      ## Decision Matrix

      Use air shipping when delivery speed is critical and your shipment weight is under 500 kg. Use sea shipping when you have time flexibility and need to ship heavier items or larger quantities.

      Let us help you choose the right option for your next shipment!
    `,
  },
  "customs-documentation-guide": {
    title: "Complete Guide to Customs Documentation",
    author: "Michael Chen",
    date: "2025-11-03",
    category: "Customs",
    readTime: "8 min read",
    image: "/customs-declaration-form-documents.jpg",
    content: `
      Customs documentation is critical for smooth shipping from China to Nigeria. Incorrect or incomplete documents can cause delays, additional costs, or even confiscation of goods. We handle this for you, but here's what you should know.

      ## Required Documents

      ### 1. Commercial Invoice
      - Detailed description of items
      - Unit prices and total value
      - Currency and payment terms
      - Seller and buyer details
      - Incoterms (usually CIF or FOB)

      ### 2. Packing List
      - Item-by-item breakdown
      - Quantities and weights
      - Dimensions of each package
      - Gross and net weights

      ### 3. Shipping Documents
      - Bill of Lading (for sea shipping)
      - Air Waybill (for air shipping)
      - Insurance certificate
      - Certificate of Origin

      ### 4. Import Permits (if required)
      - For controlled items
      - For certain product categories
      - Pre-clearance documents

      ## HS Code Classification

      The Harmonized System (HS) code is crucial:
      - 6-digit code identifies product type
      - Determines tariff rates
      - Affects import duties
      - Incorrect codes cause delays

      Common examples:
      - Electronics: 8471
      - Textiles: 6204
      - Machinery: 8477
      - Plastics: 3926

      Always verify HS codes with the Chinese exporter!

      ## Common Documentation Mistakes

      1. **Undervaluation** - Don't declare below fair market value
      2. **Incomplete descriptions** - Be specific about items
      3. **Wrong HS codes** - Causes reclassification and delays
      4. **Missing signatures** - All required parties must sign
      5. **Inconsistent information** - Match across all documents

      ## Timeline

      - Day 1-2: Prepare documentation
      - Day 3: Submit for customs review
      - Day 4-5: Clearance approval (if no issues)
      - Day 6: Port release

      **We handle all documentation for you!** Our team ensures compliance with both Chinese export regulations and Nigerian import requirements. Contact us for any specific requirements for your items.
    `,
  },
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string}>()
  const post = blogPosts[params.slug]

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-12 text-center pb-12">
                <p className="text-foreground/60 mb-6">Article not found</p>
                <Link href="/blog">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
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
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary">{post.category}</Badge>
                  <span className="text-sm text-foreground/60">{post.readTime}</span>
                </div>

                <h1 className="text-4xl font-bold text-foreground leading-tight">{post.title}</h1>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString("en-US", {
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
          <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-8">
              <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-primary">
                {post.content.split("\n\n").map((paragraph: string, index: number) => {
                  if (paragraph.startsWith("##")) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-foreground mt-6 mb-3">
                        {paragraph.replace("## ", "")}
                      </h2>
                    )
                  } else if (paragraph.startsWith("- ")) {
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 text-foreground/80 my-4">
                        {paragraph.split("\n").map((item: string, i: number) => (
                          <li key={i}>{item.replace("- ", "")}</li>
                        ))}
                      </ul>
                    )
                  } else if (paragraph) {
                    return (
                      <p key={index} className="text-foreground/80 leading-relaxed my-4">
                        {paragraph}
                      </p>
                    )
                  }
                })}
              </div>
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
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(blogPosts)
                .slice(0, 3)
                .filter(([slug]) => slug !== params.slug)
                .map(([slug, relatedPost]) => (
                  <Link key={slug} href={`/blog/${slug}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                      <CardContent className="pt-4">
                        <Badge className="bg-primary/10 text-primary mb-2">{relatedPost.category}</Badge>
                        <h4 className="font-semibold text-foreground line-clamp-2">{relatedPost.title}</h4>
                        <p className="text-xs text-foreground/60 mt-2">{relatedPost.readTime}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
