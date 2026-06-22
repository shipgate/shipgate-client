"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, X, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuthStore } from "@/store/auth"
import { getNotifications, getUnreadNotificationCount, type NotificationItem } from "@/lib/notifications-api"

export function DashboardHeader({
  setmobileMenuOpen,
  mobileMenuOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  setmobileMenuOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const token = useAuthStore((state) => state.token)
  const router = useRouter()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SHIPMENT":
        return "📦"
      case "ACCOUNT":
        return "💰"
      case "ANNOUNCEMENT":
        return "📢"
      default:
        return "🔔"
    }
  }

  useEffect(() => {
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    let isMounted = true

    Promise.all([getNotifications({ limit: 5 }, token), getUnreadNotificationCount(token)])
      .then(([notificationRes, unreadRes]) => {
        if (!isMounted) return
        setNotifications(notificationRes.data ?? [])
        setUnreadCount(unreadRes.unreadCount ?? 0)
      })
      .catch(() => {
        if (!isMounted) return
        setNotifications([])
        setUnreadCount(0)
      })

    return () => {
      isMounted = false
    }
  }, [token])

  return (
    <header className="bg-[#f6f7fa] sticky top-0 z-40">
      <div className={`flex items-center justify-between h-16 ${sidebarCollapsed ? "md:h-10" : "md:h-16"} px-4 md:pr-6`}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:block p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeftOpen className="w-5 h-5 text-foreground" />
        </button>

        <button
          onClick={() => setmobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>

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

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-border overflow-hidden animate-fadeInUp">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        "px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
                        !notification.read && "bg-primary/5",
                      )}
                      onClick={() => {
                        setNotificationsOpen(false)
                        router.push("/dashboard/notifications")
                      }}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl shrink-0">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className={cn("text-sm", !notification.read && "font-semibold")}>{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0"></div>
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
