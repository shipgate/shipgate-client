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

  return (
    <>
      <DashboardHeader mobileMenuOpen={mobileMenuOpen} setmobileMenuOpen={setMobileMenuOpen} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="hidden md:block md:w-64">
          <Sidebar userRole="super-admin" />
        </div>

        

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 md:hidden">
            <Sidebar userRole="super-admin" />
          </div>
        )}

        <main className="flex-1 overflow-auto bg-muted/30 w-full md:w-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </>
  )
}
