"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Menu, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-[#f6f7fa] ">
      <div className="flex rounded-4xl h-screen">
        {/* Desktop Sidebar */}
        <div className={`hidden md:block transition-all duration-300 ${sidebarCollapsed ? "md:w-20" : "md:w-55"}`}>
          <Sidebar userRole="super-admin" collapsed={sidebarCollapsed} />
        </div>

        

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 md:hidden">
            <Sidebar userRole="super-admin" collapsed={sidebarCollapsed} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 position-fixed w-full md:w-auto">
          <DashboardHeader setmobileMenuOpen={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
          <div className="p-5 md:p-6 h-[calc(100vh-64px)] overflow-scroll rounded-3xl bg-white ">{children}</div>
        </main>
      </div>
    </div>
  )
}
