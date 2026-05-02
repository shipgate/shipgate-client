"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowUpDown, Menu } from "lucide-react"
import {AnimatePresence, motion} from "motion/react"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary">
            <img src="/logo.png" alt="" className="w-[120px] h-[120px]" />
            {/* SHIPGATE */}
          </Link>

          {/* Desktop Menu */}
          <motion.div 
          className="hidden md:flex gap-8"
          initial={{ opacity: 0, }}
          animate={{ opacity: 1,  }}
          >
            <Link href="/" className="text-foreground hover:text-primary transition font-medium">
              Home
            </Link>
            
            <Link href="/calculator" className="text-foreground hover:text-primary transition font-medium">
              Calculator
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition font-medium">
              Blog
            </Link>

            <div className="relative group">
              <button className="text-foreground hover:text-primary transition flex items-center gap-1 font-medium">
                Services
                <div className="w-4 h-4 rotate-0 transition-transform duration-300 group-hover:rotate-180"
                >
                  <svg width=" 100%" height=" 100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z" fill="currentColor"></path>
                  </svg>
                </div>
              </button>
              {/* Services Dropdown */}
              <div className="absolute left-0 mt-0 w-48 bg-white border border-border rounded-lg shadow-lg opacity-0 transform translate-y-12 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-400">
                <Link
                  href="/services#air-freight"
                  className="block px-4 py-2 text-foreground hover:text-primary hover:scale-105 rounded-t-lg transition"
                >
                  Air Freight
                </Link>
                <Link
                  href="/services#sea-freight"
                  className="block px-4 py-2 text-foreground hover:text-primary hover:scale-105 rounded-t-lg transition"
                >
                  Sea Freight
                </Link>
                <Link
                  href="/services#consolidation"
                  className="block px-4 py-2 text-foreground hover:text-primary hover:scale-105 rounded-t-lg transition"
                >
                  Consolidation
                </Link>
              </div>
            </div>
            
            <Link href="/help" className="text-foreground hover:text-primary transition font-medium">
              Help
            </Link>
          </motion.div>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <AnimatePresence initial={false}>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          exit={{opacity: 0, height: 0}}
          className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Home
            </Link>

            <Link href="/calculator" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Calculator
            </Link>
            <Link href="/blog" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Blog
            </Link>

            <div className="relative group px-4">
              <button 
              className="text-foreground hover:text-primary transition flex items-center gap-1 "
              onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
              >
                Services
                <div className={`w-4 h-4 ${servicesMenuOpen ? "rotate-180" : ""} transition-transform duration-300 group-hover:rotate-180`}
                >
                  <svg width=" 100%" height=" 100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z" fill="currentColor"></path>
                  </svg>
                </div>
              </button>
              {/* Services Dropdown */}
              {servicesMenuOpen &&
                <div className=" ">
                  <Link
                    href="/services#air-freight"
                    className="block px-4 py-2 text-foreground hover:text-primary hover:scale-105 rounded-t-lg transition"
                  >
                    Air Freight
                  </Link>
                  <Link
                    href="/services#sea-freight"
                    className="block px-4 py-2 text-foreground hover:text-primary hover:scale-105 rounded-t-lg transition"
                  >
                    Sea Freight
                  </Link>
                  <Link
                    href="/services#consolidation"
                    className="block px-4 py-2 text-foreground hover:text-primary hover:scale-105 rounded-t-lg transition"
                  >
                    Consolidation
                  </Link>
                </div>

              }
            </div>
            <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              About
            </Link>
            <Link href="/help" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Help
            </Link>
            <div className="flex flex-col gap-2 px-4 pt-2">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full bg-transparent hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          </motion.div>
        )}

        </AnimatePresence>
      </div>
    </nav>
  )
}
