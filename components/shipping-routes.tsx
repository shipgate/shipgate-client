import { Check, Ship, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { useState } from "react"

export function ShippingRoutesSection() {
    const [show, setShow] = useState(false)
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-foreground mb-4">
            Our Shipping Routes
           </motion.h2>
          <motion.p 
          className="text-lg text-foreground/70 max-w-2xl mx-auto"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          >
            Choose the perfect shipping method for your needs. Fast air freight or cost-effective sea shipping.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Air Shipping Card */}
          <motion.div 
          initial={{ opacity: 0, y: 20 }}    
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
            {/* Background Illustration */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path
                  d="M100 30 L130 80 L100 100 L70 80 Z M60 100 L140 100 M100 100 L100 170"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary"
                />
              </svg>
            </div>

            <div className="relative p-8 sm:p-10">
              {/* Icon and Title */}
              <div 
              className="mb-8"
              >
                <div className="inline-block p-4 bg-primary/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">Air Shipping</h3>
                <p className="text-foreground/70">Fast delivery for urgent shipments</p>
              </div>

              {/* Pricing */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-primary/10">
                <div className="text-sm text-foreground/70 mb-2">Competitive Pricing</div>
                <div className="text-3xl font-bold text-primary mb-1">$8.90</div>
                <div className="text-sm text-foreground/70">per kilogram</div>
              </div>

              {/* Route Information */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Shipping Route
                  <div 
                  className={`w-4 h-4  transition-transform duration-300 ${show? "rotate-180" : "rotate-0"}`}
                  onClick={()=> setShow(!show)}
                >
                  <svg width=" 100%" height=" 100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z" fill="currentColor"></path>
                  </svg>
                </div>
                </h4>
                {show &&
                    <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">China Warehouse</p>
                        <p className="text-foreground/70">Guangzhou Distribution Center</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-primary/30 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">China Airport</p>
                        <p className="text-foreground/70">Guangzhou International Airport</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-primary/30 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">In Transit</p>
                        <p className="text-foreground/70">Real-time flight tracking included</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-primary/30 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">Nigeria Airport</p>
                        <p className="text-foreground/70">Lagos/Abuja International Airport</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-primary/30 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">Nigeria Warehouse</p>
                        <p className="text-foreground/70">Final delivery to destination</p>
                        </div>
                    </div>
                    </div>

                }
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Benefits
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-foreground/70">3-5 days delivery time</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-foreground/70">Real-time GPS tracking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-foreground/70">Full insurance coverage</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-foreground/70">Volumetric weight calculation</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <Link href="/calculator">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-all group-hover:shadow-lg">
                  Calculate Air Shipping Cost
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Sea Shipping Card */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}    
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative h-fit overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl">
            {/* Background Illustration */}
            <div className="absolute top-0 right-0  opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path
                  d="M50 100 L150 100 M60 100 L60 140 L140 140 L140 100 M70 100 L70 110 M80 100 L80 110 M90 100 L90 110 M100 100 L100 110 M110 100 L110 110 M120 100 L120 110 M130 100 L130 110"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-blue-600"
                />
              </svg>
            </div>

            <div className="relative p-8 sm:p-10">
              {/* Icon and Title */}
              <div className="mb-8">
                <div className="inline-block p-4 bg-blue-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Ship className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 mb-2">Sea Shipping</h3>
                <p className="text-foreground/70">Cost-effective for large volumes</p>
              </div>

              {/* Pricing */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-200">
                <div className="text-sm text-foreground/70 mb-2">Multiple Options</div>
                <div className="space-y-2 text-lg font-bold text-blue-600">
                  <div>
                    $510 <span className="text-sm text-foreground/70">per CBM</span>
                  </div>
                  <div>
                    $5,400 <span className="text-sm text-foreground/70">20ft container</span>
                  </div>
                  <div>
                    $7,200 <span className="text-sm text-foreground/70">40ft container</span>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Shipping Route
                  <div 
                  className={`w-4 h-4  transition-transform duration-300 ${show? "rotate-180" : "rotate-0"}`}
                  onClick={()=> setShow(!show)}
                >
                  <svg width=" 100%" height=" 100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z" fill="currentColor"></path>
                  </svg>
                </div>
                </h4>
                
                {show &&
                    <div className="space-y-3 text-sm ">
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">China Warehouse</p>
                        <p className="text-foreground/70">Guangzhou Distribution Center</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-blue-300 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">China Port</p>
                        <p className="text-foreground/70">Shenzhen Port or Shanghai Port</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-blue-300 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">In Transit</p>
                        <p className="text-foreground/70">Ocean voyage with port tracking</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-blue-300 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">Nigeria Port</p>
                        <p className="text-foreground/70">Lagos or other ports</p>
                        </div>
                    </div>
                    <div className="border-l-2 border-blue-300 ml-1 h-4" />
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div>
                        <p className="font-semibold text-foreground">Nigeria Warehouse</p>
                        <p className="text-foreground/70">Final delivery to destination</p>
                        </div>
                    </div>
                    </div>
                }
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  Benefits
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-foreground/70">Save up to 70% on costs</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-foreground/70">10-15 days delivery time</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-foreground/70">Full container tracking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-foreground/70">Port to port insurance included</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <Link href="/calculator">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all group-hover:shadow-lg">
                  Calculate Sea Shipping Cost
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
