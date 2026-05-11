"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone } from "lucide-react"

export default function ManageCustomers() {
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "08012345678", shipments: 12, status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "08087654321", shipments: 8, status: "active" },
    { id: 3, name: "Ahmed Hassan", email: "ahmed@example.com", phone: "08098765432", shipments: 5, status: "inactive" },
    { id: 4, name: "Mary Johnson", email: "mary@example.com", phone: "08011223344", shipments: 15, status: "active" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Customers</h1>
          <p className="text-foreground/60">View and manage customer accounts</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Add Customer</Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers List</CardTitle>
          <CardDescription>All registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Shipments</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-semibold">{customer.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">{customer.shipments}</td>
                    <td className="py-3 px-4">
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
