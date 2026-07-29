"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import { getNewsletterSubscribers } from "@/lib/newsletter-api"
import { getAdminRfqById, getAdminRfqs, respondToAdminRfq, type RfqItem } from "@/lib/rfq-api"
import {
  getAdminSupportTicketById,
  getAdminUnresolvedSupportTickets,
  resolveAdminSupportTicket,
  respondToAdminSupportTicket,
  type SupportTicket,
} from "@/lib/support-tickets-api"

export default function SuperAdminCommunicationsPage() {
  const token = useAuthStore((state) => state.token)
  const [activeTab, setActiveTab] = useState("newsletter")

  const [subscribers, setSubscribers] = useState<Array<{ _id: string; email: string; subscribedAt: string; isActive: boolean }>>([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)

  const [rfqs, setRfqs] = useState<RfqItem[]>([])
  const [loadingRfqs, setLoadingRfqs] = useState(false)
  const [selectedRfqId, setSelectedRfqId] = useState("")
  const [selectedRfq, setSelectedRfq] = useState<RfqItem | null>(null)
  const [rfqResponse, setRfqResponse] = useState("")
  const [respondingRfq, setRespondingRfq] = useState(false)

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [ticketReply, setTicketReply] = useState("")
  const [replyingTicket, setReplyingTicket] = useState(false)
  const [resolvingTicket, setResolvingTicket] = useState(false)

  const fetchSubscribers = async () => {
    if (!token) return
    setLoadingSubscribers(true)
    try {
      const data = await getNewsletterSubscribers(token, 1, 50)
      setSubscribers(data.subscribers || [])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch subscribers")
    } finally {
      setLoadingSubscribers(false)
    }
  }

  const fetchRfqs = async () => {
    if (!token) return
    setLoadingRfqs(true)
    try {
      const response = await getAdminRfqs(token, 1, 50)
      setRfqs(response.data || [])
      if (!selectedRfqId && response.data?.length) {
        setSelectedRfqId(response.data[0]._id || response.data[0].rfqId || "")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch RFQs")
    } finally {
      setLoadingRfqs(false)
    }
  }

  const fetchTickets = async () => {
    if (!token) return
    setLoadingTickets(true)
    try {
      const response = await getAdminUnresolvedSupportTickets(token, 1, 50)
      setTickets(response.data || [])
      if (!selectedTicketId && response.data?.length) {
        setSelectedTicketId(response.data[0]._id || response.data[0].ticketId || "")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch support tickets")
    } finally {
      setLoadingTickets(false)
    }
  }

  const fetchTicketDetails = async (ticketId: string) => {
    if (!token || !ticketId) return
    try {
      const response = await getAdminSupportTicketById(ticketId, token)
      setSelectedTicket(((response as any).data || response) as SupportTicket)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch ticket details")
    }
  }

  const fetchRfqDetails = async (rfqId: string) => {
    if (!token || !rfqId) return
    try {
      const response = await getAdminRfqById(rfqId, token)
      setSelectedRfq(((response as any).data || response) as RfqItem)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch RFQ details")
    }
  }

  useEffect(() => {
    fetchSubscribers()
    fetchRfqs()
    fetchTickets()
  }, [token])

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId)
    }
  }, [selectedTicketId, token])

  useEffect(() => {
    if (selectedRfqId) {
      fetchRfqDetails(selectedRfqId)
    }
  }, [selectedRfqId, token])

  const handleRespondToRfq = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedRfqId) return
    setRespondingRfq(true)
    try {
      await respondToAdminRfq(selectedRfqId, rfqResponse, token)
      toast.success("RFQ response sent")
      setRfqResponse("")
      fetchRfqs()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to respond to RFQ")
    } finally {
      setRespondingRfq(false)
    }
  }

  const handleRespondToTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedTicketId) return
    setReplyingTicket(true)
    try {
      await respondToAdminSupportTicket(selectedTicketId, ticketReply, token)
      toast.success("Reply sent")
      setTicketReply("")
      fetchTicketDetails(selectedTicketId)
      fetchTickets()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to send reply")
    } finally {
      setReplyingTicket(false)
    }
  }

  const handleResolveTicket = async () => {
    if (!token || !selectedTicketId) return
    setResolvingTicket(true)
    try {
      await resolveAdminSupportTicket(selectedTicketId, token)
      toast.success("Ticket resolved")
      setSelectedTicket(null)
      setSelectedTicketId("")
      fetchTickets()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to resolve ticket")
    } finally {
      setResolvingTicket(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Communications</h1>
        <p className="text-foreground/60">Manage newsletter subscribers, RFQs, and support tickets.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="rfq">RFQ</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="newsletter" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
              <CardDescription>Latest subscriber list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:h-[300] overflow-y-scroll">
              {loadingSubscribers ? (
                <p className="text-sm text-foreground/60">Loading subscribers...</p>
              ) : subscribers.length ? (
                <div className="space-y-3">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber._id} className="rounded-lg border border-border p-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">{subscriber.email}</p>
                        <p className="text-xs text-foreground/60">{subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString() : "N/A"}</p>
                      </div>
                      <Badge variant={subscriber.isActive ? "default" : "secondary"}>{subscriber.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/60">No subscribers found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfq" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>RFQ Requests</CardTitle>
                <CardDescription>Pending and responded requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRfqs ? (
                  <p className="text-sm text-foreground/60">Loading RFQs...</p>
                ) : rfqs.length ? (
                  <div className="space-y-3">
                    {rfqs.map((rfq) => {
                      const id = rfq._id || rfq.rfqId || ""
                      const isActive = selectedRfqId === id
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedRfqId(id)}
                          className={`w-full text-left rounded-lg border p-3 transition ${isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">{rfq.fullName || "Unknown requester"}</p>
                              <p className="text-xs text-foreground/60">{rfq.email || "No email"}</p>
                            </div>
                            <Badge variant={String(rfq.status || "").toUpperCase() === "RESPONDED" ? "secondary" : "default"}>
                              {String(rfq.status || "PENDING").toUpperCase()}
                            </Badge>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/60">No RFQs found.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RFQ Details</CardTitle>
                <CardDescription>Respond to selected request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:h-[300] overflow-y-scroll">
                {selectedRfq ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-3 space-y-1">
                      <p className="text-sm"><span className="font-semibold">Name:</span> {selectedRfq.fullName || "N/A"}</p>
                      <p className="text-sm"><span className="font-semibold">Email:</span> {selectedRfq.email || "N/A"}</p>
                      <p className="text-sm"><span className="font-semibold">Phone:</span> {selectedRfq.phone || "N/A"}</p>
                      <p className="text-sm"><span className="font-semibold">Shipment Method:</span> {selectedRfq.shipmentMethod || "N/A"}</p>
                      <p className="text-sm"><span className="font-semibold">Items:</span> {selectedRfq.itemsDescription || "N/A"}</p>
                      <p className="text-sm"><span className="font-semibold">Weight:</span> {selectedRfq.weight || "N/A"} KG</p>
                      <p className="text-sm"><span className="font-semibold">CBM Volume:</span> {selectedRfq.cbmVolume || "N/A"} CBM</p>
                      <p className="text-sm"><span className="font-semibold">Container Type:</span> {selectedRfq.containerType || "N/A"}</p>
                      <p className="text-sm"><span className="font-semibold">Special Requirements:</span> {selectedRfq.specialRequirements || "N/A"}</p>
                    </div>

                    <form onSubmit={handleRespondToRfq} className="space-y-3">
                      <textarea
                        value={rfqResponse}
                        onChange={(e) => setRfqResponse(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                        placeholder="Write RFQ response..."
                        required
                      />
                      <Button type="submit" disabled={respondingRfq || !rfqResponse.trim()} className="w-full">
                        {respondingRfq ? "Sending..." : "Send Response"}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/60">Select an RFQ to view details.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Unresolved Tickets</CardTitle>
                <CardDescription>Open support tickets requiring action</CardDescription>
              </CardHeader>
              <CardContent className="sm:h-[300] overflow-y-scroll">
                {loadingTickets ? (
                  <p className="text-sm text-foreground/60">Loading tickets...</p>
                ) : tickets.length ? (
                  <div className="space-y-3">
                    {tickets.map((ticket) => {
                      const id = ticket._id || ticket.ticketId || ""
                      const isActive = selectedTicketId === id
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedTicketId(id)}
                          className={`w-full text-left rounded-lg border p-3 transition ${isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                        >
                          <p className="font-semibold text-sm">{ticket.subject || "No subject"}</p>
                          <p className="text-xs text-foreground/60">{ticket.email || "No email"}</p>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/60">No unresolved tickets.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Thread</CardTitle>
                <CardDescription>Respond and resolve ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:h-[300] overflow-y-scroll">
                {selectedTicket ? (
                  <>
                    <div className="rounded-lg border border-border p-3 space-y-1">
                      <p className="text-sm"><span className="font-semibold">From:</span> {selectedTicket.fullName || "Unknown"} ({selectedTicket.email || "No email"})</p>
                      <p className="text-sm"><span className="font-semibold">Subject:</span> {selectedTicket.subject || "N/A"}</p>
                      <p className="text-sm text-foreground/80">{selectedTicket.message || ""}</p>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {(selectedTicket.conversation || []).length ? (
                        selectedTicket.conversation?.map((response, index) => (
                          <div key={index} className="rounded-lg border border-border p-3">
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70">{response.senderType || "Response"}</p>
                              <p className="text-xs text-foreground/60">{response.createdAt ? new Date(response.createdAt).toLocaleString() : ""}</p>
                            </div>
                            <p className="text-sm">{response.message || ""}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-foreground/60">No replies yet.</p>
                      )}
                    </div>

                    <form onSubmit={handleRespondToTicket} className="space-y-3">
                      <textarea
                        value={ticketReply}
                        onChange={(e) => setTicketReply(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                        placeholder="Write a response..."
                        required
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button type="submit" disabled={replyingTicket || !ticketReply.trim()}>
                          {replyingTicket ? "Sending..." : "Send Reply"}
                        </Button>
                        <Button type="button" variant="outline" disabled={resolvingTicket} onClick={handleResolveTicket}>
                          {resolvingTicket ? "Resolving..." : "Mark Resolved"}
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <p className="text-sm text-foreground/60">Select a ticket to view conversation.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
