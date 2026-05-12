"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { subscribeToNewsletter } from "@/lib/newsletter-api"
import { LoadingSpinner } from "@/components/loading-spinner"

export function NewsletterSubscription() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      const result = await subscribeToNewsletter(email)

      if (result.success) {
        toast.success(result.message)
        setEmail("")
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="pt-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 w-full">
            <Mail className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-2xl font-bold text-foreground">Stay Updated</h3>
          </div>
          <p className="text-foreground/70 mb-6 max-w-md mx-auto">
            Subscribe to get the latest shipping tips, fee updates, and exchange rate alerts.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 bg-white/50 border-primary/20"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12 whitespace-nowrap"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
