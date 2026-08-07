"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Users, Package, Truck, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { getAdminShipments } from "@/lib/shipping-api"
import { getUsers } from "@/lib/auth-api"
import { getAdminUnresolvedSupportTickets } from "@/lib/support-tickets-api"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuperAdminDashboard() {
  const { user, token } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: "Total Admins", value: "0", icon: Users, color: "bg-blue-500" },
    { label: "Active Shipments", value: "0", icon: Package, color: "bg-green-500" },
    { label: "Couriers", value: "0", icon: Truck, color: "bg-orange-500" },
    { label: "Open Support Tickets", value: "0", icon: AlertCircle, color: "bg-red-500" },
  ])

  useEffect(() => {
    const loadStats = async () => {
      if (!token) {
        setStats([
          { label: "Total Admins", value: "0", icon: Users, color: "bg-blue-500" },
          { label: "Active Shipments", value: "0", icon: Package, color: "bg-green-500" },
          { label: "Couriers", value: "0", icon: Truck, color: "bg-orange-500" },
          { label: "Open Support Tickets", value: "0", icon: AlertCircle, color: "bg-red-500" },
        ])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const [shipmentsResponse, adminUsersResponse, courierUsersResponse, ticketsResponse] = await Promise.all([
          getAdminShipments(token, 1, 1000),
          getUsers("admin", token, 1, 1000),
          getUsers("courier", token, 1, 1000),
          getAdminUnresolvedSupportTickets(token, 1, 1000),
        ])

        const shipmentData = Array.isArray((shipmentsResponse as any).data) ? (shipmentsResponse as any).data : []
        const shipmentTotal = (shipmentsResponse as any).pagination?.total ?? shipmentData.length
        const activeShipmentCount = shipmentData.filter((shipment: any) => {
          const status = String(shipment.currentStatus || shipment.status || "").toUpperCase()
          return !["COMPLETED", "CANCELLED"].includes(status)
        }).length
        const openSupportTickets = Number(((ticketsResponse as any).pagination?.total ?? (ticketsResponse as any).data?.length ?? 0)) || 0

        setStats([
          { label: "Total Admins", value: String(((adminUsersResponse as any).users || []).length), icon: Users, color: "bg-blue-500" },
          { label: "Active Shipments", value: String(activeShipmentCount || shipmentTotal), icon: Package, color: "bg-green-500" },
          { label: "Couriers", value: String(((courierUsersResponse as any).users || []).length), icon: Truck, color: "bg-orange-500" },
          { label: "Open Support Tickets", value: String(openSupportTickets), icon: AlertCircle, color: "bg-red-500" },
        ])
      } catch (error) {
        setStats([
          { label: "Total Admins", value: "0", icon: Users, color: "bg-blue-500" },
          { label: "Active Shipments", value: "0", icon: Package, color: "bg-green-500" },
          { label: "Couriers", value: "0", icon: Truck, color: "bg-orange-500" },
          { label: "Open Support Tickets", value: "0", icon: AlertCircle, color: "bg-red-500" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [token])

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    address: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return { title: "Good morning", emoji: "☀️", subtitle: "The day is fresh and there’s plenty to keep moving." }
    }

    if (hour < 17) {
      return { title: "Good afternoon", emoji: "🌤️", subtitle: "You’re in the sweet spot for tackling priorities and keeping things smooth." }
    }

    if (hour < 22) {
      return { title: "Good evening", emoji: "🌙", subtitle: "The pace is easing down — a great time to check on what matters most." }
    }

    return { title: "Good night", emoji: "🌌", subtitle: "You’re winding down, but the platform is still here when you need it." }
  }

  const greeting = getGreeting()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-medium text-gray-700 mb-2">
          {greeting.title}, <span className="font-bold text-foreground">{user?.fullName?.split(" ")[0]?.toLocaleUpperCase() || "Admin"}</span> {greeting.emoji}
        </h1>
        <p className="text-foreground/60">{greeting.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* Management Sections */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>Configure and manage all platform aspects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Manage Admins & Staff</h3>
              <p className="text-sm text-foreground/60 mb-4">Create, edit, and manage admin accounts and staff</p>
              <Link href="/super-admin/admins">
              
              </Link>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Create Admin
              </Button>
            </div>
            
            <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Manage Couriers</h3>
              <p className="text-sm text-foreground/60 mb-4">Manage delivery agents and assign shipments</p>
              <Link href="/super-admin/couriers">
                <Button variant="outline" size="sm">
                  Manage Couriers
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "New admin created", user: "John Doe", time: "2 hours ago" },
              { action: "Pricing updated", details: "Sea freight rates", time: "5 hours ago" },
              { action: "50 new couriers assigned", location: "Lagos Hub", time: "1 day ago" },
              { action: "Hub configuration updated", location: "Shanghai", time: "2 days ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-foreground/60">{activity.user || activity.details || activity.location}</p>
                </div>
                <span className="text-xs text-foreground/50">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
