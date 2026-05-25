'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingTimeline } from '@/components/tracking/tracking-timeline';
import { TrackingMap } from '@/components/tracking/tracking-map';
import { Search, AlertCircle } from 'lucide-react';
import { getPublicShipmentTracking } from '@/lib/shipping-api';
import { buildTimelineFromShipment, getStatusBadgeClass, formatStatusLabel } from '@/lib/shipment-helpers';

export default function TrackPage() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('id') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment(trackingNumber)
    }
  }, [trackingNumber]);

  const fetchShipment = async (trackingId: string) => {
    setError('')
    setNotFound(false)
    setIsLoading(true)
    try {
      const response = await getPublicShipmentTracking(trackingId)
      const responseAny = response as any
      const data = responseAny.data?.shipment || responseAny.data || response
      if (!data || Object.keys(data).length === 0) {
        setNotFound(true)
        setShipment(null)
      } else {
        setShipment(data)
      }
    } catch (err) {
      setNotFound(true)
      setShipment(null)
      setError(err instanceof Error ? err.message : 'Unable to fetch tracking details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchShipment(trackingNumber);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Track Your Shipment</CardTitle>
              <CardDescription>Enter your tracking number to view real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., SHP-ABC123-XYZ)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-white h-12 px-8 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="mb-8 border-destructive/20 bg-destructive/10">
              <CardContent className="pt-6 text-destructive">{error}</CardContent>
            </Card>
          )}

          {notFound && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">Tracking number not found</p>
                    <p className="text-sm text-yellow-800">Please check your tracking number and try again.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {shipment && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{shipment.shipmentNumber || shipment.trackingNumber}</CardTitle>
                      <CardDescription>
                        {shipment.origin} → {shipment.destination}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadgeClass(shipment.currentStatus || shipment.status)}>
                      {formatStatusLabel(shipment.currentStatus || shipment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-foreground/60 text-sm">Shipping Type</p>
                      <p className="text-lg font-semibold text-foreground capitalize">
                        {shipment.shippingType === 'air' ? '✈️ Air Shipping' : '🚢 Sea Shipping'}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm">Estimated Delivery</p>
                      <p className="text-lg font-semibold text-foreground">{shipment.estimatedDelivery}</p>
                    </div>
                    {shipment.weight && (
                      <div>
                        <p className="text-foreground/60 text-sm">Weight</p>
                        <p className="text-lg font-semibold text-foreground">{shipment.weight}</p>
                      </div>
                    )}
                    {shipment.containerType && (
                      <div>
                        <p className="text-foreground/60 text-sm">Container</p>
                        <p className="text-lg font-semibold text-foreground">{shipment.containerType} Container</p>
                      </div>
                    )}
                    <div>
                      <p className="text-foreground/60 text-sm">Carrier</p>
                      <p className="text-lg font-semibold text-foreground">{shipment.carrier}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm">Total Cost</p>
                      <p className="text-lg font-semibold text-primary">{shipment.cost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TrackingMap
                origin={shipment.origin || 'Origin'}
                destination={shipment.destination || 'Destination'}
                status={shipment.currentStatus || shipment.status || 'pending'}
                shipmentMethod={shipment.shipmentMethod}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Shipment Timeline</CardTitle>
                  <CardDescription>Complete tracking history</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrackingTimeline events={buildTimelineFromShipment(shipment)} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </>
  );
}
