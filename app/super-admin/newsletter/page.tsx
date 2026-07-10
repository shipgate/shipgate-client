"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getNewsletterSubscribers } from "@/lib/newsletter-api"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Subscriber {
  _id: string
  email: string
  subscribedAt: string
  isActive: boolean
}

interface PaginationState {
  page: number
  limit: number
  total: number
  pages: number
}

export default function SuperAdminNewsletterPage() {
  const { token } = useAuthStore()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = async (page = 1) => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await getNewsletterSubscribers(token, page, pagination.limit)
      setSubscribers(data.subscribers || [])
      setPagination(data.pagination || { page, limit: pagination.limit, total: 0, pages: 0 })
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch newsletter subscribers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers(1)
  }, [token])

  if (loading) {
    return <LoadingSpinner label="Loading newsletter subscribers..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Newsletter Subscribers</h1>
        <p className="text-foreground/60">People currently subscribed to the newsletter</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscribers ({pagination.total || subscribers.length})</CardTitle>
          <CardDescription>Manage newsletter audience insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Subscribed Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length ? (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-foreground/80">
                          <Mail className="w-4 h-4" />
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <CalendarDays className="w-4 h-4" />
                          {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString() : "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-6 px-4 text-foreground/60" colSpan={3}>
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {pagination.pages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} • {pagination.total} total subscribers
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSubscribers(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSubscribers(Math.min(pagination.pages, pagination.page + 1))}
              disabled={pagination.page >= pagination.pages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
