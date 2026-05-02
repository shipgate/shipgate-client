"use client"

import { useState } from "react"
import { Bell, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "shipment_delivered",
    message: "Your shipment #SHP-2025-001 has been delivered",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "shipment_in_transit",
    message: "Shipment #SHP-2025-002 is now in transit from Beijing",
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "wallet_credited",
    message: "₦50,000 has been added to your wallet",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "shipment_cleared",
    message: "Your shipment #SHP-2025-003 has cleared customs",
    timestamp: "2 days ago",
    read: true,
  },
]

export function DashboardHeader({
  setmobileMenuOpen,
  mobileMenuOpen
}: {
  setmobileMenuOpen: (open: boolean) => void
  mobileMenuOpen: boolean
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "shipment_delivered":
        return "📦"
      case "shipment_in_transit":
        return "✈️"
      case "wallet_credited":
        return "💰"
      case "shipment_cleared":
        return "✓"
      default:
        return "📌"
    }
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 max-md:hidden">
            <img src="/logo.png" alt="" className="w-[120px] h-[120px]" />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setmobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-border overflow-hidden animate-fadeInUp">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.length > 0 ? (
                  mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
                        !notification.read && "bg-primary/5",
                      )}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className={cn("text-sm", !notification.read && "font-semibold")}>{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-muted-foreground text-sm">No notifications yet</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border text-center">
                <Link href="/dashboard/notifications">
                  <button className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                    View All
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
