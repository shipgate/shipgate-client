"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, RefreshCw } from "lucide-react"
import { jsPDF } from "jspdf"
import { format } from "date-fns"
import { PaymentOptionsModal } from "@/components/dashboard/payment-options-modal"
import { getCustomerInvoices, Invoice } from "@/lib/payments-api"
import { useAuthStore } from "@/store/auth"

function normalizeInvoices(data: unknown): Invoice[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === "object") {
    const payload = data as { invoices?: Invoice[]; docs?: Invoice[]; results?: Invoice[] }
    if (Array.isArray(payload.invoices)) return payload.invoices
    if (Array.isArray(payload.docs)) return payload.docs
    if (Array.isArray(payload.results)) return payload.results
  }
  return []
}

function formatMoney(amount: number, currency = "NGN") {
  const symbol = currency.toUpperCase() === "NGN" ? "₦" : `${currency.toUpperCase()} `
  return `${symbol}${amount.toLocaleString()}`
}

function formatDate(value?: string) {
  if (!value) return "N/A"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : format(date, "dd/MM/yyyy, HH:mm")
}

async function getImageDataUrl(src: string) {
  const response = await fetch(src)
  const blob = await response.blob()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function buildInvoicePdf(invoice: Invoice) {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  const primary = "#1d4ed8"
  const textColor = "#0f172a"
  const background = "#f8fafc"
  const logoUrl = "/logo.png"

  const imageData = await getImageDataUrl(logoUrl)

  doc.setFillColor(background)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F")

  doc.addImage(imageData, "PNG", margin, 32, 90, 90)
  doc.setFontSize(18)
  doc.setTextColor(primary)
  doc.text("Shipgate Invoice", margin + 110, 60)

  doc.setFontSize(10)
  doc.setTextColor(textColor)
  doc.text("Shipgate by Bowa Gate", margin + 110, 80)

  doc.setDrawColor(primary)
  doc.setLineWidth(1)
  doc.line(margin, 135, pageWidth - margin, 135)

  doc.setFontSize(12)
  doc.setTextColor(textColor)
  doc.text(`Invoice ID: ${invoice.invoiceId}`, margin, 165)
  doc.text(`Shipment: ${invoice.shipmentNumber}`, margin, 185)
  doc.text(`Status: ${displayStatus(invoice.status)}`, margin, 205)
  doc.text(`Date: ${formatDate(invoice.createdAt)}`, margin, 225)
  if (invoice.dueDate) {
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, margin, 245)
  }

  doc.setFontSize(14)
  doc.setTextColor(primary)
  doc.text("Invoice Summary", margin, 290)
  doc.setFillColor("#eff6ff")
  doc.roundedRect(margin, 300, pageWidth - margin * 2, 80, 8, 8, "F")

  doc.setFontSize(12)
  doc.setTextColor(textColor)
  doc.text(`Description: ${invoice.description || "Shipment invoice"}`, margin + 12, 324)
  doc.text(`Amount: ${formatMoney(Number(invoice.amount || 0), invoice.currency)}`, margin + 12, 344)
  doc.text(`Currency: ${invoice.currency?.toUpperCase() || "NGN"}`, margin + 12, 364)

  doc.setFontSize(10)
  doc.setTextColor("#475569")
  doc.text(
    "Thank you for using Shipgate. This invoice is generated from the Shipgate dashboard and can be used for payment tracking.",
    margin,
    410,
    { maxWidth: pageWidth - margin * 2 },
  )

  return doc
}

function displayStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function InvoicesPage() {
  const token = useAuthStore((state) => state.token)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const loadInvoices = async () => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const response = await getCustomerInvoices(token)
      setInvoices(normalizeInvoices(response.data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load invoices.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [token])

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const term = searchTerm.toLowerCase()
        const matchesSearch =
          String(invoice.invoiceId || "").toLowerCase().includes(term) ||
          String(invoice.shipmentNumber || "").toLowerCase().includes(term) ||
          String(invoice.description || "").toLowerCase().includes(term)
        const matchesStatus = statusFilter === "All" || invoice.status.toUpperCase() === statusFilter.toUpperCase()
        return matchesSearch && matchesStatus
      }),
    [invoices, searchTerm, statusFilter],
  )

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "VOID":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0)
  const pendingAmount = invoices
    .filter((invoice) => invoice.status.toUpperCase() === "PENDING")
    .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0)
  const defaultCurrency = invoices[0]?.currency || "NGN"

  const [pdfLoading, setPdfLoading] = useState<string | null>(null)

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setPdfLoading(invoice.invoiceId)
    try {
      const doc = await buildInvoicePdf(invoice)
      doc.save(`invoice-${invoice.invoiceId}.pdf`)
    } catch (err) {
      console.error(err)
    } finally {
      setPdfLoading(null)
    }
  }

  const handleViewInvoice = async (invoice: Invoice) => {
    setPdfLoading(invoice.invoiceId)
    try {
      const doc = await buildInvoicePdf(invoice)
      const blobUrl = String(doc.output("bloburl"))
      window.open(blobUrl, "_blank")
    } catch (err) {
      console.error(err)
    } finally {
      setPdfLoading(null)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Invoices</h1>
          <p className="text-foreground/70">View and download all your invoices</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70 mb-1">Total Invoices</p>
              <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">{formatMoney(totalAmount, defaultCurrency)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70 mb-1">Pending Amount</p>
              <p className="text-2xl font-bold text-primary">{formatMoney(pendingAmount, defaultCurrency)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search by invoice ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {["All", "Paid", "Pending", "Void"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={loadInvoices} disabled={loading}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        ) : null}

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-foreground/70">Loading invoices...</div>
            ) : filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-foreground/70">
                      <th className="text-left py-3 px-4 font-semibold">Invoice ID</th>
                      <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Description</th>
                      <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Date</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                      <th className="text-center py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.invoiceId} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-foreground">{invoice.invoiceId}</td>
                        <td className="py-4 px-4 text-foreground/70 hidden md:table-cell text-sm">
                          {invoice.description || `Shipment #${invoice.shipmentNumber}`}
                        </td>
                        <td className="py-4 px-4 text-foreground/70 hidden sm:table-cell text-sm">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-foreground">
                          {formatMoney(Number(invoice.amount || 0), invoice.currency)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={getStatusColor(invoice.status)}>{displayStatus(invoice.status)}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              title="View"
                              onClick={() => handleViewInvoice(invoice)}
                              disabled={pdfLoading === invoice.invoiceId}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Download"
                              onClick={() => handleDownloadInvoice(invoice)}
                              disabled={pdfLoading === invoice.invoiceId}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {invoice.status.toUpperCase() === "PENDING" ? (
                              <Button size="sm" onClick={() => setSelectedInvoice(invoice)}>
                                Pay
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-foreground/70">No invoices found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentOptionsModal
        open={Boolean(selectedInvoice)}
        invoiceId={selectedInvoice?.invoiceId}
        shipmentNumber={selectedInvoice?.shipmentNumber || ""}
        description={selectedInvoice?.description}
        amount={Number(selectedInvoice?.amount || 0)}
        currency={selectedInvoice?.currency || "NGN"}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  )
}
