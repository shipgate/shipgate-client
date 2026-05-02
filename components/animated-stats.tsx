"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedStats() {
  const [inView, setInView] = useState(false)
  const [counts, setCounts] = useState({ shipments: 0, customers: 0, delivery: 0 })
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView])

  useEffect(() => {
    if (!inView) return

    const duration = 2000
    const start = Date.now()

    const animateCount = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)

      setCounts({
        shipments: Math.floor(5000 * progress),
        customers: Math.floor(2000 * progress),
        delivery: Math.floor(98 * progress),
      })

      if (progress < 1) requestAnimationFrame(animateCount)
    }

    animateCount()
  }, [inView])

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-4xl font-bold text-primary">{counts.shipments.toLocaleString()}+</p>
          <p className="text-foreground/70 mt-2">Shipments Completed</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-primary">{counts.customers.toLocaleString()}+</p>
          <p className="text-foreground/70 mt-2">Happy Customers</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-primary">{counts.delivery}%</p>
          <p className="text-foreground/70 mt-2">On-Time Delivery Rate</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-primary">24/7</p>
          <p className="text-foreground/70 mt-2">Customer Support</p>
        </div>
      </div>
    </section>
  )
}
