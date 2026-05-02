"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

const reviews = [
  {
    id: 1,
    name: "Toheeb Azeez",
    role: "Marketing Manager",
    company: "Redbull, Nigeria",
    quote:
      "There is nothing ShipGate cannot deliver, even miracle! Our relationship with ShipGate feels more of a business partner than a client. Most commendable is the agility to meet our demands even when it seemingly looks impossible sometimes.",
    rating: 5,
  },
  {
    id: 2,
    name: "Chioma Okonkwo",
    role: "Operations Manager",
    company: "Fashion Hub Lagos",
    quote:
      "Outstanding service! The tracking system is incredibly accurate, and our packages always arrive on time. The customer support team is responsive and professional. Highly recommended for anyone shipping from China to Nigeria.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ahmed Mohammed",
    role: "CEO",
    company: "Tech Imports Nigeria",
    quote:
      "We've been using ShipGate for over a year now and they never disappoint. The pricing is competitive, the consolidation service saves us thousands monthly, and the transparency throughout the process is exceptional.",
    rating: 5,
  },
  {
    id: 4,
    name: "Grace Adeyemi",
    role: "Business Owner",
    company: "Adeyemi Retail Store",
    quote:
      "Best decision we made for our business logistics. From warehouse to doorstep, everything is seamless. The exchange rate updates and real-time notifications keep us informed every step of the way.",
    rating: 5,
  },
]

export function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const currentReview = reviews[currentIndex]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-muted/20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-foreground mb-4">Customer Reviews</h2>
        <p className="text-center text-foreground/60 mb-16 text-lg">
          Trusted by thousands of businesses across Nigeria
        </p>

        {/* Carousel Container */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-border/50 overflow-hidden">
          <div className="min-h-96 flex flex-col justify-between">
            {/* Quote */}
            <AnimatePresence>
                <motion.blockquote 
                className="text-xl sm:text-2xl text-foreground font-medium text-center mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                >
                "{currentReview.quote}"
                </motion.blockquote>

            </AnimatePresence>

            {/* Author Info */}
            <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(currentReview.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
              </div>

              <h3 className="text-xl font-bold text-foreground">{currentReview.name}</h3>
              <p className="text-foreground/70 text-sm">
                {currentReview.role}, {currentReview.company}
              </p>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 z-10 max-md:hidden">
            <button
              onClick={goToPrevious}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-foreground/30 text-foreground hover:border-primary hover:text-primary transition-all hover:bg-primary/10"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 z-10 max-md:hidden">
            <button
              onClick={goToNext}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-foreground/30 text-foreground hover:border-primary hover:text-primary transition-all hover:bg-primary/10"
              aria-label="Next review"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setAutoPlay(false)
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-8" : "bg-foreground/20 w-2 hover:bg-foreground/40"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${autoPlay ? "bg-primary animate-pulse" : "bg-foreground/30"}`} />
            {autoPlay ? "Auto-playing" : "Paused"}
          </button>
        </div>
      </div>
    </section>
  )
}
