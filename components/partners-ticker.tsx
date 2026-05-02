"use client"

export function PartnersTicker() {
  const partners = [
    "/Fiata.webp",
    "/jctrans.webp",
    "/wcaworld.webp",
    "/NEPC.webp",
    "/ISO1.webp",
    "/ISO2.webp",
    "/christ.webp",
    
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <style>{`
        @keyframes scroll-ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-content {
          animation: scroll-ticker 20s linear infinite;
          display: flex;
          gap: 3rem;
        }
        
      `}</style>
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Trusted Partners</h2>
        <div className="relative overflow-hidden flex items-center justify-center">
          <div className="ticker-content"> 
            <div className="flex gap-8 animate-scroll whitespace-nowrap py-8">
                {partners.map((partner, idx) => (
                <div
                    key={idx}
                    className="flex-shrink-0 px-6 py-3 bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition"
                >
                    <img src={partner} alt="" className="h-20 w-20" />
                </div>
                ))}

                {partners.map((partner, idx) => (
                <div
                    key={idx}
                    className="flex-shrink-0 px-6 py-3 bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition"
                >
                    <img src={partner} alt="" className="h-20 w-20" />
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
