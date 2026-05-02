"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export function ExchangeRatesTicker() {
  const [copied, setCopied] = useState(false)
  const [exchangeRates, setExchangeRates] = useState<any>()

  const [rates, setRates] = useState([
    { pair: "NGN/USD", rate: exchangeRates?.rates?.USD ||"1,234" , change: "+2.5%" },
    { pair: "NGN/CNY", rate: "19.42", change: "-1.2%" },
    { pair: "USD/CNY", rate: "7.25", change: "+0.8%" },
    { pair: "NGN/GBP", rate: "1,550", change: "+1.5%" },
    { pair: "NGN/EUR", rate: "1,340", change: "+2.1%" },
    { pair: "CNY/NGN", rate: "0.0515", change: "-1.2%" },
  ])

  const fetchExchangeRates = async () => {
    await axios.get(`https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY}&base_currency=NGN`)
    .then((response)=>{
      setExchangeRates(response.data)
      setRates([
        { pair: "USD/NGN", rate: (1/response.data?.data?.USD?.value).toFixed(0) ||"1,234" , change: "+2.5%" }, //1/usd = ngnresponse.data?.data?.USD?.value.toFixed(2) ||"1,234" , change: "+2.5%" },
        { pair: "GBP/NGN", rate: (1/response.data?.data?.GBP?.value).toFixed(0) ||"1,550", change: "+1.5%" }, //1/gbp = nresponse.data?.data?.GBP?.value.toFixed(2) ||"1,550", change: "+1.5%" },
        { pair: "EUR/NGN", rate: (1/response.data?.data?.EUR?.value).toFixed(0) ||"1,340", change: "+2.1%" },
        { pair: "CNY/NGN", rate: (1 / response.data?.data?.CNY?.value).toFixed(0) ||"0.0515", change: "-1.2%" },
        { pair: "CNY/USD", rate: (response.data?.data?.CNY?.value / response.data?.data?.USD?.value).toFixed(4) ||"7.25", change: "+0.8%" },
        { pair: "USD/CNY", rate: (response.data?.data?.USD?.value / response.data?.data?.CNY?.value).toFixed(4) ||"19.42", change: "-1.2%" },
        
      ])
    })
    .catch((error)=>{
      console.error("Error fetching exchange rates:", error)
    })
  }

  useEffect(()=>{
    fetchExchangeRates()
  }, [])

  return (
    <div className="w-full bg-primary/10 border-t border-b border-primary/20 py-2 overflow-hidden">
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
      <div className="overflow-hidden">
        <div className="ticker-content">
          {[...rates, ...rates].map((rate, idx) => (
            <div key={idx} className="flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold text-primary text-xs">{rate.pair}</span>
              <span className="text-foreground font-light text-xs">{rate.rate}</span>
              {/* <span
                className={`text-xs font-light ${rate.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {rate.change}
              </span> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
