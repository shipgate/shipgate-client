"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"
import {
  DEFAULT_SHIPPING_RATES,
  DEFAULT_WAREHOUSE_ADDRESS,
  getShippingRatesConfig,
  getWarehouseAddressConfig,
  setShippingRatesConfig,
  setWarehouseAddressConfig,
  type ShippingRatesConfig,
  type WarehouseAddressConfig,
} from "@/lib/shipping-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function SuperAdminSettingsPage() {
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [savingRates, setSavingRates] = useState(false)
  const [savingWarehouse, setSavingWarehouse] = useState(false)

  const [rates, setRates] = useState<ShippingRatesConfig>(DEFAULT_SHIPPING_RATES)
  const [warehouse, setWarehouse] = useState<WarehouseAddressConfig>(DEFAULT_WAREHOUSE_ADDRESS)

  const loadConfig = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      
      setLoading(true)
      const [ratesData, warehouseData] = await Promise.all([
        getShippingRatesConfig(token),
        getWarehouseAddressConfig(token),
      ])

      setRates(ratesData)
      setWarehouse(warehouseData)
      
    } catch (err: any) {
      toast.error(err.message || "Failed to load shipping settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [token])

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSavingRates(true)
    try {
      await setShippingRatesConfig(rates, token)
      toast.success("Shipping rates updated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to update shipping rates")
    } finally {
      setSavingRates(false)
    }
  }

  const handleSaveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSavingWarehouse(true)
    try {
      if (warehouse) {
        await setWarehouseAddressConfig(warehouse, token)
        toast.success("Warehouse address updated successfully")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update warehouse address")
    } finally {
      setSavingWarehouse(false)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading settings..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shipping Settings</h1>
        <p className="text-foreground/60">Update pricing rates and warehouse address used across the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rates Configuration</CardTitle>
          <CardDescription>These values are used in calculator, services and landing pages</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveRates} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">AIR</label>
                <Input
                  type="number"
                  step="0.01"
                  value={rates.AIR}
                  onChange={(e) => setRates({ ...rates, AIR: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">SEA_CBM</label>
                <Input
                  type="number"
                  step="0.01"
                  value={rates.SEA_CBM}
                  onChange={(e) => setRates({ ...rates, SEA_CBM: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">SEA_20FT</label>
                <Input
                  type="number"
                  step="0.01"
                  value={rates.SEA_20FT}
                  onChange={(e) => setRates({ ...rates, SEA_20FT: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">SEA_40FT</label>
                <Input
                  type="number"
                  step="0.01"
                  value={rates.SEA_40FT}
                  onChange={(e) => setRates({ ...rates, SEA_40FT: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Currency</label>
              <Input
                value={rates.currency}
                onChange={(e) => setRates({ ...rates, currency: e.target.value })}
                placeholder="$"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingRates}>
                {savingRates ? "Saving..." : "Save Rates"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Address Configuration</CardTitle>
          <CardDescription>Update the consolidation warehouse contact and address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveWarehouse} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Warehouse Name</label>
              <Input
                value={warehouse?.name || ""}
                onChange={(e) => setWarehouse({ ...warehouse, name: e.target.value })}
                placeholder="Warehouse name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Address Number</label>
                <Input
                  type="number"
                  value={warehouse?.number}
                  onChange={(e) => setWarehouse({ ...warehouse, number: Number.parseInt(e.target.value, 10) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={warehouse?.address || ""}
                  onChange={(e) => setWarehouse({ ...warehouse, address: e.target.value })}
                  placeholder="Street, city, state, country"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingWarehouse}>
                {savingWarehouse ? "Saving..." : "Save Warehouse Address"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
