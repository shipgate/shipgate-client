"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"
import {
  getNotifications,
  markNotificationAsRead,
  markNotificationsAsRead,
  type NotificationItem,
} from "@/lib/notifications-api"

type NotificationCategory = "shipment" | "account" | "announcement"

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

export default function NotificationsPage() {
  const token = useAuthStore((state) => state.token)
  const [shipmentNotifs, setShipmentNotifs] = useState<NotificationItem[]>([])
  const [accountNotifs, setAccountNotifs] = useState<NotificationItem[]>([])
  const [announcementNotifs, setAnnouncementNotifs] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setShipmentNotifs([])
      setAccountNotifs([])
      setAnnouncementNotifs([])
      return
    }

    let active = true
    setLoading(true)
    setError("")

    Promise.all([
      getNotifications({ type: "SHIPMENT", limit: 20 }, token),
      getNotifications({ type: "ACCOUNT", limit: 20 }, token),
      getNotifications({ type: "ANNOUNCEMENT", limit: 20 }, token),
    ])
      .then(([shipmentRes, accountRes, announcementRes]) => {
        if (!active) return
        setShipmentNotifs(shipmentRes.data ?? [])
        setAccountNotifs(accountRes.data ?? [])
        setAnnouncementNotifs(announcementRes.data ?? [])
      })
      .catch((err) => {
        if (!active) return
        setError(err instanceof Error ? err.message : "Unable to load notifications.")
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  const markAsRead = async (notification: NotificationItem, category: NotificationCategory) => {
    if (!token || notification.read) return

    try {
      await markNotificationAsRead(notification._id, token)
      const updater = (list: NotificationItem[]) =>
        list.map((item) => (item._id === notification._id ? { ...item, read: true } : item))

      if (category === "shipment") {
        setShipmentNotifs(updater)
      } else if (category === "account") {
        setAccountNotifs(updater)
      } else {
        setAnnouncementNotifs(updater)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const markAllRead = async () => {
    if (!token) return
    const unreadIds = [...shipmentNotifs, ...accountNotifs, ...announcementNotifs]
      .filter((notif) => !notif.read)
      .map((notif) => notif._id)

    if (unreadIds.length === 0) return

    try {
      await markNotificationsAsRead(unreadIds, token)
      const markAll = (list: NotificationItem[]) => list.map((item) => ({ ...item, read: true }))
      setShipmentNotifs(markAll)
      setAccountNotifs(markAll)
      setAnnouncementNotifs(markAll)
    } catch (err) {
      console.error(err)
    }
  }

  const NotificationItemCard = ({
    notification,
    category,
  }: {
    notification: NotificationItem
    category: NotificationCategory
  }) => (
    <Card
      className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => markAsRead(notification, category)}
    >
      <CardContent className="pt-4">
        <div className="flex gap-4">
          <span className="text-2xl shrink-0">{getNotificationIcon(notification.type)}</span>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className={cn("font-semibold text-foreground", !notification.read && "text-primary")}>
                {notification.title}
              </h4>
              {!notification.read && <Badge className="bg-primary">New</Badge>}
            </div>
            <p className="text-sm text-foreground/70 mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {notification.updatedAt || notification.createdAt || "Just now"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-foreground/70">Stay updated with your shipments and account activity</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition"
              onClick={markAllRead}
              disabled={loading}
            >
              Mark all read
            </button>
          </div>
        </div>

        {error ? (
          <Card>
            <CardContent className="p-6 text-destructive">{error}</CardContent>
          </Card>
        ) : null}

        {loading ? (
          <Card>
            <CardContent className="p-6 text-foreground/70">Loading notifications...</CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="shipment" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="shipment">Shipments</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="announcement">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="shipment" className="space-y-4">
              {shipmentNotifs.length > 0 ? (
                shipmentNotifs.map((notif) => (
                  <NotificationItemCard key={notif._id} notification={notif} category="shipment" />
                ))
              ) : (
                <Card>
                  <CardContent className="pt-8 text-center">
                    <p className="text-muted-foreground">No shipment notifications</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
              {accountNotifs.length > 0 ? (
                accountNotifs.map((notif) => (
                  <NotificationItemCard key={notif._id} notification={notif} category="account" />
                ))
              ) : (
                <Card>
                  <CardContent className="pt-8 text-center">
                    <p className="text-muted-foreground">No account notifications</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="announcement" className="space-y-4">
              {announcementNotifs.length > 0 ? (
                announcementNotifs.map((notif) => (
                  <NotificationItemCard key={notif._id} notification={notif} category="announcement" />
                ))
              ) : (
                <Card>
                  <CardContent className="pt-8 text-center">
                    <p className="text-muted-foreground">No announcements</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
