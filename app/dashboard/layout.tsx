"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Menu, X } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-[#f6f7fa] ">
      <DashboardHeader setmobileMenuOpen={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} />
      <div className="flex rounded-4xl h-[calc(100vh-55px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-55">
          <Sidebar />
        </div>

        

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 md:hidden">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-auto rounded-3xl w-full md:w-auto">
          <div className="p-5 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
