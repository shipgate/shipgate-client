"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { RecentShipments } from "@/components/dashboard/recent-shipments"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { Plus } from "lucide-react"
import { motion } from "motion/react"
import { useTypewriter } from "react-simple-typewriter"
import { useAuthStore } from "@/store/auth"
import { getCustomerShipments } from "@/lib/shipping-api"
import { getCustomerWallet } from "@/lib/payments-api"


export default function DashboardPage() {
  const [walletBalance, setWalletBalance] = useState(0.0)
  const [totalSpent] = useState(0.0)
  const token = useAuthStore((state) => state.token)
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState("")
  const [text, count] = useTypewriter({
    words: [
        "Here's your shipping overview.",
        "What do you want to ship today?",
        "We deliver straight to your doorstep.",
        "Track your shipments in real-time.",
    ],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 30,
  })

  const { user } = useAuthStore()

  const loadShipments = async () => {
    if (!token) return
    setError("")
    setLoading(true)
    try {
      const response = await getCustomerShipments(token, 1, 5)
      setShipments(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load shipments.")
    } finally {
      setLoading(false)
    }
  }

  const loadWalletBalance = async () => {
    if (!token) return

    try {
      const response = await getCustomerWallet(token)
      const payload = (response as any).data || response
      setWalletBalance(Number(payload.balance ?? payload.customer?.walletBalance ?? 0) || 0)
    } catch (err) {
      console.error("Unable to load wallet balance:", err)
    }
  }
  
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) {
        setShipments([])
        setWalletBalance(0)
        setStatsLoading(false)
        return
      }

      setError("")
      setStatsLoading(true)

      try {
        await Promise.all([loadShipments(), loadWalletBalance()])
      } finally {
        setStatsLoading(false)
      }
    }

    loadDashboardData()
  }, [token])

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return { title: "Good morning", emoji: "☀️", subtitle: "Let’s make today feel easy and productive." }
    }

    if (hour < 17) {
      return { title: "Good afternoon", emoji: "🌤️", subtitle: "You’re right on time to keep things moving and smiling." }
    }

    if (hour < 22) {
      return { title: "Good evening", emoji: "🌙", subtitle: "A calm evening is perfect for checking in and staying ahead." }
    }

    return { title: "Good night", emoji: "🌌", subtitle: "The quiet hours are ideal for a quick review before rest." }
  }

  const greeting = getGreeting()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
        initial={{x: -20, opacity: 0}}
        animate={{x:0, opacity: 1}}
        >
          <h1 className="text-3xl font-medium text-gray-700 mb-2">
            {greeting.title}, <span className="font-bold text-foreground">{user?.fullName?.split(" ")[0]?.toLocaleUpperCase() || "there"}</span> {greeting.emoji}
          </h1>
          <p className="text-foreground/60 text-sm md:text-base">{greeting.subtitle}</p>
        </motion.div>
        <motion.a 
        href="/dashboard/add-shipment"
        initial={{x: 20, opacity: 0}}
        animate={{x:0, opacity: 1}}
        >
          <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" />
            New Shipment
          </Button>
        </motion.a>
      </div>

      {/* Stats Grid */}
      <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.5}}
      >
        <QuickStats walletBalance={walletBalance} shipmentCount={shipments.length} totalSpent={totalSpent} loading={statsLoading || loading} />
      </motion.div>

      {/* Wallet Card and Recent Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
        className="lg:col-span-1"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.5, delay: 0.2}}
        >
          <WalletCard balance={walletBalance} />
        </motion.div>

        {/* Recent Shipments */}
        <motion.div 
        className="lg:col-span-2"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.5, delay: 0.4}}
        >
          <RecentShipments shipments={shipments} />
        </motion.div>
      </div>

      
    </div>
  )
}
