"use client"

import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <>
      <DashboardHeader mobileMenuOpen={mobileMenuOpen} setmobileMenuOpen={setMobileMenuOpen} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className={`hidden md:block transition-all duration-300 ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`}>
          <Sidebar userRole="admin" collapsed={sidebarCollapsed} />
        </div>

        

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 md:hidden">
            <Sidebar userRole="admin" />
          </div>
        )}

        <main className="flex-1 overflow-auto bg-muted/30 w-full md:w-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </>
  )
}
