"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calculator, FileText, Settings, MessageSquare, LogOut, Users, Truck, MapPin, ShoppingCart, BarChart3, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const customerMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "My Shipments", href: "/dashboard/shipments" },
  { icon: Calculator, label: "Calculator", href: "/dashboard/calculator" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: MessageSquare, label: "Support", href: "/dashboard/support" },
]

const superAdminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin/dashboard" },
  { icon: Users, label: "Manage Admins", href: "/super-admin/manage-admins" },
  { icon: Users, label: "Manage Operation Staffs", href: "/super-admin/manage-staff" },
  { icon: Truck, label: "Manage Couriers", href: "/super-admin/manage-couriers" },
  { icon: Users, label: "Customers", href: "/super-admin/customers" },
  // { icon: MapPin, label: "Shipping Config", href: "/super-admin/shipping-config" },
  // { icon: ShoppingCart, label: "Carriers", href: "/super-admin/carriers" },
  { icon: Package, label: "All Shipments", href: "/super-admin/shipments" },
  { icon: FileText, label: "Manage Blog", href: "/super-admin/blog" },

  // { icon: BarChart3, label: "Reports", href: "/super-admin/reports" },
  // { icon: Settings, label: "System Settings", href: "/super-admin/settings" },
]

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "All Shipments", href: "/admin/shipments" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: MapPin, label: "Status Updates", href: "/admin/status-updates" },
  { icon: Truck, label: "Assign to Couriers", href: "/admin/assign-couriers" },
  { icon: FileText, label: "Manage Blog", href: "/admin/blog" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const staffMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/staff/dashboard" },
  { icon: MapPin, label: "Update Status", href: "/staff/status-updates" },
  { icon: Settings, label: "Settings", href: "/staff/settings" },
]

const courierMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/courier/dashboard" },
  { icon: MapPin, label: "Update Delivery", href: "/courier/update-delivery" },
  { icon: Settings, label: "Settings", href: "/courier/settings" },
]

export function Sidebar({userRole = "customer"}: {userRole?: string}) {
  const pathname = usePathname()

  const getMenuItems = () => {
    switch (userRole) {
      case "super-admin":
        return superAdminMenuItems
      case "admin":
        return adminMenuItems
      case "staff":
        return staffMenuItems
      case "courier":
        return courierMenuItems
      default:
        return customerMenuItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-white border-r border-border h-full">
      <div className="p-6 space-y-8">
        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border pt-6">
          <a href="/">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-foreground hover:bg-muted rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </a>
        </div>
      </div>
    </aside>
  )
}
