"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"

// Mock invoices data
const mockInvoices = [
  {
    id: "INV-2025-001",
    date: "2025-01-15",
    description: "Air Freight - Shipment #SHP-2025-001",
    amount: 45000,
    status: "Paid",
    dueDate: "2025-01-10",
  },
  {
    id: "INV-2025-002",
    date: "2025-01-20",
    description: "Sea Freight - Shipment #SHP-2025-002",
    amount: 28000,
    status: "Pending",
    dueDate: "2025-02-05",
  },
  {
    id: "INV-2025-003",
    date: "2025-01-18",
    description: "Consolidation Service - Shipment #SHP-2025-003",
    amount: 12500,
    status: "Paid",
    dueDate: "2025-01-15",
  },
  {
    id: "INV-2025-004",
    date: "2025-01-25",
    description: "Air Freight - Shipment #SHP-2025-004",
    amount: 52000,
    status: "Overdue",
    dueDate: "2025-01-20",
  },
  {
    id: "INV-2025-005",
    date: "2025-01-22",
    description: "Sea Freight - Shipment #SHP-2025-005",
    amount: 35000,
    status: "Paid",
    dueDate: "2025-01-20",
  },
]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)

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
              <p className="text-2xl font-bold text-foreground">{mockInvoices.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">₦{totalAmount.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/70 mb-1">Pending Amount</p>
              <p className="text-2xl font-bold text-primary">
                ₦
                {mockInvoices
                  .filter((i) => i.status === "Pending" || i.status === "Overdue")
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </p>
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
              {["All", "Paid", "Pending", "Overdue"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length > 0 ? (
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
                      <tr key={invoice.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-foreground">{invoice.id}</td>
                        <td className="py-4 px-4 text-foreground/70 hidden md:table-cell text-sm">
                          {invoice.description}
                        </td>
                        <td className="py-4 px-4 text-foreground/70 hidden sm:table-cell text-sm">{invoice.date}</td>
                        <td className="py-4 px-4 text-right font-semibold text-foreground">
                          ₦{invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" variant="ghost" title="View">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Download">
                              <Download className="w-4 h-4" />
                            </Button>
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
    </div>
  )
}
