"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock notifications data
const mockShipmentNotifications = [
  {
    id: 1,
    icon: "📦",
    title: "Shipment Delivered",
    message: "Your shipment #SHP-2025-001 has been delivered to the warehouse",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    icon: "✈️",
    title: "In Transit",
    message: "Shipment #SHP-2025-002 is now in transit from Beijing to Lagos",
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    icon: "✓",
    title: "Customs Cleared",
    message: "Your shipment #SHP-2025-003 has cleared customs successfully",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 4,
    icon: "📍",
    title: "At Local Airport",
    message: "Shipment #SHP-2025-004 has arrived at Lagos airport",
    timestamp: "2 days ago",
    read: true,
  },
]

const mockAccountNotifications = [
  {
    id: 5,
    icon: "💰",
    title: "Wallet Credited",
    message: "₦50,000 has been successfully added to your wallet",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: 6,
    icon: "🔒",
    title: "Password Changed",
    message: "Your account password was successfully updated",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: 7,
    icon: "✅",
    title: "KYC Verified",
    message: "Your KYC verification has been approved",
    timestamp: "1 week ago",
    read: true,
  },
]

const mockAnnouncementNotifications = [
  {
    id: 8,
    icon: "📢",
    title: "New Feature: Real-time Tracking",
    message: "We've launched enhanced real-time tracking with flight details and live location updates",
    timestamp: "2 days ago",
    read: false,
  },
  {
    id: 9,
    icon: "💳",
    title: "Exchange Rate Update",
    message: "USD to NGN rate updated: 1 USD = ₦1,650. CNY to NGN rate: 1 CNY = ₦230",
    timestamp: "4 days ago",
    read: true,
  },
  {
    id: 10,
    icon: "🎉",
    title: "Holiday Season Promo",
    message: "Get 15% discount on all sea freight shipments this month",
    timestamp: "1 week ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const [shipmentNotifs, setShipmentNotifs] = useState(mockShipmentNotifications)
  const [accountNotifs, setAccountNotifs] = useState(mockAccountNotifications)
  const [announcementNotifs, setAnnouncementNotifs] = useState(mockAnnouncementNotifications)

  const markAsRead = (id: number, type: "shipment" | "account" | "announcement") => {
    if (type === "shipment") {
      setShipmentNotifs(shipmentNotifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } else if (type === "account") {
      setAccountNotifs(accountNotifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } else {
      setAnnouncementNotifs(announcementNotifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }
  }

  const NotificationItem = ({
    notification,
    type,
  }: {
    notification: (typeof mockShipmentNotifications)[0]
    type: "shipment" | "account" | "announcement"
  }) => (
    <Card
      className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => markAsRead(notification.id, type)}
    >
      <CardContent className="pt-4">
        <div className="flex gap-4">
          <span className="text-2xl flex-shrink-0">{notification.icon}</span>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className={cn("font-semibold text-foreground", !notification.read && "text-primary")}>
                {notification.title}
              </h4>
              {!notification.read && <Badge className="bg-primary">New</Badge>}
            </div>
            <p className="text-sm text-foreground/70 mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-foreground/70">Stay updated with your shipments and account activity</p>
        </div>

        <Tabs defaultValue="shipment" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="shipment">Shipments</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="announcement">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="shipment" className="space-y-4">
            {shipmentNotifs.length > 0 ? (
              shipmentNotifs.map((notif) => <NotificationItem key={notif.id} notification={notif} type="shipment" />)
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
              accountNotifs.map((notif) => <NotificationItem key={notif.id} notification={notif} type="account" />)
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
                <NotificationItem key={notif.id} notification={notif} type="announcement" />
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
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
