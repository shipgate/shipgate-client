"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calculator, FileText, Settings, MessageSquare, LogOut, Users, Truck, MapPin, Wallet, ChevronRight, UserRound, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAuthStore } from "@/store/auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { clearAuthCookie, clearUserRoleCookie } from "@/lib/cookies"

const customerMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "My Shipments", href: "/dashboard/shipments" },
  { icon: Wallet, label: "My Wallet", href: "/dashboard/wallet" },
  { icon: Calculator, label: "Calculator", href: "/dashboard/calculator" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: MessageSquare, label: "Communications", href: "/dashboard/support" },
]

const superAdminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin/dashboard" },
  { icon: Users, label: "Manage Admins", href: "/super-admin/manage-admins" },
  { icon: Users, label: "Manage Operation Staffs", href: "/super-admin/manage-staff" },
  { icon: Truck, label: "Manage Couriers", href: "/super-admin/manage-couriers" },
  { icon: Users, label: "Customers", href: "/super-admin/customers" },
  { icon: Megaphone, label: "Communications", href: "/super-admin/communications" },
  // { icon: MapPin, label: "Shipping Config", href: "/super-admin/shipping-config" },
  // { icon: ShoppingCart, label: "Carriers", href: "/super-admin/carriers" },
  { icon: Package, label: "All Shipments", href: "/super-admin/shipments" },
  { icon: FileText, label: "Manage Blog", href: "/super-admin/blog" },
  { icon: Settings, label: "Settings", href: "/super-admin/settings" },

  // { icon: BarChart3, label: "Reports", href: "/super-admin/reports" },
  // { icon: Settings, label: "System Settings", href: "/super-admin/settings" },
]

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "All Shipments", href: "/admin/shipments" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Megaphone, label: "Communications", href: "/admin/communications" },
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

export function Sidebar({userRole = "customer", collapsed = false}: {userRole?: string, collapsed?: boolean}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

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

  const { user, clearAuth } = useAuthStore()

  const userName = user?.fullName || "User"
  const nameParts = userName.split(" ").filter(Boolean)
  const firstInitial = nameParts[0]?.charAt(0) || "U"
  const secondInitial = nameParts[1]?.charAt(0) || ""
  const initials = `${firstInitial}${secondInitial}`

  const profileRouteByRole: Record<string, string> = {
    customer: "/dashboard/profile",
    admin: "/admin/profile",
    "super-admin": "/super-admin/profile",
    staff: "/staff/profile",
    courier: "/courier/profile",
  }

  const profileHref = profileRouteByRole[userRole] || "/dashboard/profile"

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  const handleSignOut = () => {
    clearAuth()
    clearAuthCookie()
    clearUserRoleCookie()
    setIsAccountMenuOpen(false)
    router.push("/login")
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="w-55 bg-[#f6f7fa]  h-full">
        <div className={` ${collapsed ? "px-2" : "px-6"} space-y-8 text-sm justify-between flex flex-col h-full transition-all duration-300`}>
        
        {/* Menu Items */}
        <nav className="space-y-2 ">
          {/* Logo */}
        <div className={`flex items-center max-md:hidden ${collapsed ? "hidden" : ""}`}>
            <img src="/logo.png" alt="" className="w-25 h-25" />
        </div>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link href={item.href} key={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ",
                        isActive ? " text-primary font-semibold" : !collapsed ? "text-foreground hover:bg-black/5" : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                        <Icon className={`w-5 h-5 shrink-0 ${collapsed ? "hover:text-primary" : ""}`} />   
                        </TooltipTrigger>
                          {collapsed && <TooltipContent side="right" sideOffset={1} className="ml-2">{item.label}</TooltipContent>}
                      </Tooltip>
                      
                      {!collapsed && item.label}
                    </div>
              </Link>
              
            )
          })}
        </nav>

        <div className={`${!collapsed ? "border-t border-border" : ""} pt-6 relative`} ref={accountMenuRef}>
          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-0 mb-3 w-65 rounded-2xl border border-border bg-white shadow-xl overflow-hidden z-40">
              <div className="p-4 bg-muted/40">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "No email"}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <Link
                  href={profileHref}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsAccountMenuOpen(false)}
                >
                  <UserRound className="w-4 h-4 text-muted-foreground" />
                  View Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAccountMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 px-4 py-3 w-full text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && <span className="truncate">{nameParts[0] || "User"}</span>}
            {!collapsed && <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />}
          </button>
        </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
