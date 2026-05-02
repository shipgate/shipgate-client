"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { RecentShipments } from "@/components/dashboard/recent-shipments"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { Plus } from "lucide-react"
import { motion } from "motion/react"


export default function DashboardPage() {
  const [walletBalance] = useState(2500.0)
  const [shipmentCount] = useState(12)
  const [totalSpent] = useState(8450.5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
        initial={{x: -20, opacity: 0}}
        animate={{x:0, opacity: 1}}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Victor</h1>
          <p className="text-foreground/60 text-sm md:text-base">Here's your shipping overview</p>
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
        <QuickStats walletBalance={walletBalance} shipmentCount={shipmentCount} totalSpent={totalSpent} />
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
          <RecentShipments />
        </motion.div>
      </div>

      
    </div>
  )
}
