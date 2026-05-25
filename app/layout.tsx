import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AnimatePresence, motion } from "motion/react"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHIPGATE by Bowagate - China to Nigeria Shipping",
  description: "Fast, reliable shipping from China to Nigeria with real-time tracking",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/> 
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body  style={{fontFamily: `"Onest", sans-serif`}}>
          <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <Toaster />
        <AnimatePresence> 
        {children}
        </AnimatePresence>
        <Analytics />
      </body>
    </html>
  )
}
