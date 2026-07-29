"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import {
  getCustomerSupportTicketById,
  getCustomerSupportTickets,
  respondToCustomerSupportTicket,
  submitCustomerSupportTicket,
  type SupportTicket,
} from "@/lib/support-tickets-api"

export default function DashboardSupportPage() {
  const token = useAuthStore((state) => state.token)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [activeTicketId, setActiveTicketId] = useState<string>("")
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const activeTicketStatus = String(activeTicket?.status || "").toUpperCase()
  const canReply = !!activeTicket && activeTicketStatus === "OPEN"

  const sortedResponses = useMemo(
    () => [...(activeTicket?.conversation || [])].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()),
    [activeTicket],
  )

  const fetchTickets = async () => {
    if (!token) return

    setLoadingTickets(true)
    try {
      const response = await getCustomerSupportTickets(token, 1, 10)
      setTickets(response.data || [])
      if (!activeTicketId && response.data?.length) {
        setActiveTicketId(response.data[0]._id || response.data[0].ticketId || "")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load support tickets")
    } finally {
      setLoadingTickets(false)
    }
  }

  const fetchTicketDetails = async (ticketId: string) => {
    if (!token || !ticketId) return

    try {
      const response = await getCustomerSupportTicketById(ticketId, token)
      const payload = (response as any).data || response
      setActiveTicket(payload || null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load ticket details")
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [token])

  useEffect(() => {
    if (activeTicketId) {
      fetchTicketDetails(activeTicketId)
    }
  }, [activeTicketId, token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsSubmitting(true)
    try {
      await submitCustomerSupportTicket(formData, token)
      toast.success("Support ticket submitted successfully")
      setFormData({ subject: "", message: "" })
      await fetchTickets()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to submit support ticket")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !activeTicket) return

    const ticketId = activeTicket._id || activeTicket.ticketId
    if (!ticketId) {
      toast.error("Ticket ID not found")
      return
    }

    setIsReplying(true)
    try {
      await respondToCustomerSupportTicket(ticketId, replyMessage, token)
      toast.success("Reply sent successfully")
      setReplyMessage("")
      await fetchTicketDetails(ticketId)
      await fetchTickets()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to send reply")
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Support & Help</h1>
          <p className="text-foreground/70">Create and follow up on your support tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                  <p className="text-sm text-foreground/70 mb-3">Instant messaging support available 24/7</p>
                  <a
                    href="https://wa.me/2348136729646"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-semibold text-sm inline-flex items-center gap-2"
                  >
                    Chat Now <span>→</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Phone className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-sm text-foreground/70 mb-3">Call our support team during business hours</p>
                  <a href="tel:+2348136729646" className="text-primary hover:text-primary/80 font-semibold text-sm">
                    +234 813 672 9646
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-sm text-foreground/70 mb-3">Response within 2 hours</p>
                  <a
                    href="mailto:welcome@shipgate.ng"
                    className="text-primary hover:text-primary/80 font-semibold text-sm"
                  >
                    welcome@shipgate.ng
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Support Hours</h3>
                  <p className="text-sm text-foreground/70 mb-2">Mon-Fri: 8AM-6PM WAT</p>
                  <p className="text-xs text-foreground/60">Sat-Sun: 24/7 WhatsApp support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
            <CardDescription>Describe your issue and we'll assist you as soon as possible</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white w-full h-12 font-semibold">
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Tickets</CardTitle>
              <CardDescription>Open and resolved tickets</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTickets ? (
                <p className="text-sm text-foreground/60">Loading tickets...</p>
              ) : tickets.length ? (
                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const ticketId = ticket._id || ticket.ticketId || ""
                    const isActive = activeTicketId === ticketId
                    return (
                      <button
                        key={ticketId}
                        type="button"
                        onClick={() => setActiveTicketId(ticketId)}
                        className={`w-full text-left rounded-lg border p-3 transition ${isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-sm text-foreground">{ticket.subject || "No subject"}</p>
                            <p className="text-xs text-foreground/60 mt-1">
                              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
                            </p>
                          </div>
                          <Badge variant={String(ticket.status || "").toUpperCase() === "RESOLVED" ? "secondary" : "default"}>
                            {String(ticket.status || "OPEN").toUpperCase()}
                          </Badge>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-foreground/60">No support tickets yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Conversation</CardTitle>
              <CardDescription>View updates and send replies on open tickets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:h-[350] overflow-y-scroll">
              {activeTicket ? (
                <>
                  <div className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{activeTicket.subject || "No subject"}</p>
                        <p className="text-sm text-foreground/70 mt-1">{activeTicket.message || ""}</p>
                      </div>
                      <Badge variant={activeTicketStatus === "RESOLVED" ? "secondary" : "default"}>{activeTicketStatus || "OPEN"}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 ">
                    {sortedResponses.length ? (
                      sortedResponses.map((response, index) => (
                        <div key={index} className="rounded-lg border border-border p-3">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                              {response.senderType || "Response"}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {response.createdAt ? new Date(response.createdAt).toLocaleString() : ""}
                            </p>
                          </div>
                          <p className="text-sm text-foreground">{response.message || ""}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-foreground/60">No replies yet.</p>
                    )}
                  </div>

                  {canReply ? (
                    <form onSubmit={handleReply} className="space-y-3">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <Button type="submit" disabled={isReplying || !replyMessage.trim()} className="w-full">
                        {isReplying ? "Sending reply..." : "Send Reply"}
                      </Button>
                    </form>
                  ) : (
                    <p className="text-sm text-foreground/60">This ticket is resolved and can no longer receive replies.</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-foreground/60">Select a ticket to view details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
