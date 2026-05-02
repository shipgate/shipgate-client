'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingTimeline } from '@/components/tracking/tracking-timeline';
import { TrackingMap } from '@/components/tracking/tracking-map';
import { Search, AlertCircle } from 'lucide-react';

export default function TrackPage() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('id') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  // Mock shipment data - replace with real API call
  const mockShipmentData = {
    'SHP-ABC123-XYZ': {
      trackingNumber: 'SHP-ABC123-XYZ',
      status: 'in_transit',
      shippingType: 'air',
      origin: 'Shanghai, China',
      destination: 'Lagos, Nigeria',
      weight: '150 kg',
      estimatedDelivery: 'Nov 10, 2025',
      carrier: 'China Eastern Airlines → Arik Air',
      cost: '$1,080',
      timeline: [
        {
          location: 'Shanghai Warehouse, China',
          status: 'Package received',
          timestamp: '2025-11-02 08:30 AM',
          completed: true,
          details: 'Package picked up and weighed',
        },
        {
          location: 'Shanghai Pudong Airport, China',
          status: 'In airport customs',
          timestamp: '2025-11-03 02:15 PM',
          completed: true,
          details: 'Customs clearance in progress',
        },
        {
          location: 'Enroute to Murtala Muhammed Airport',
          status: 'In flight',
          timestamp: '2025-11-04 11:00 AM - Current',
          completed: true,
          details: 'Flight number: CE-888, Altitude: 38,000 ft',
          flightInfo: 'Current route: Over Mediterranean Sea',
        },
        {
          location: 'Murtala Muhammed Airport, Lagos, Nigeria',
          status: 'Arriving soon',
          timestamp: '2025-11-05 06:30 AM (Est.)',
          completed: false,
          details: 'Expected arrival at Nigerian customs',
        },
        {
          location: 'Lagos Warehouse, Nigeria',
          status: 'Pending delivery',
          timestamp: '2025-11-06 (Est.)',
          completed: false,
          details: 'Final destination - delivery confirmation',
        },
      ],
    },
    'SHP-DEF456-UVW': {
      trackingNumber: 'SHP-DEF456-UVW',
      status: 'delivered',
      shippingType: 'sea',
      origin: 'Shenzhen, China',
      destination: 'Port Harcourt, Nigeria',
      containerType: '20ft',
      cbmVolume: '28 CBM',
      estimatedDelivery: 'Oct 28, 2025',
      carrier: 'MSC (Mediterranean Shipping Company)',
      cost: '$5,400',
      timeline: [
        {
          location: 'Shenzhen Warehouse, China',
          status: 'Cargo received',
          timestamp: '2025-10-01 10:00 AM',
          completed: true,
          details: 'Container loaded and sealed',
        },
        {
          location: 'Shenzhen Port, China',
          status: 'Port departure',
          timestamp: '2025-10-03 04:00 PM',
          completed: true,
          details: 'Vessel: MSC Gülsün, Container ID: MSCU123456',
        },
        {
          location: 'In transit - Atlantic Ocean',
          status: 'At sea',
          timestamp: '2025-10-10 (Ongoing)',
          completed: true,
          details: 'Expected Suez Canal transit: Oct 15',
        },
        {
          location: 'Port Harcourt, Nigeria',
          status: 'Port arrival',
          timestamp: '2025-10-26 08:30 AM',
          completed: true,
          details: 'Container unloaded and cleared',
        },
        {
          location: 'Port Harcourt Warehouse, Nigeria',
          status: 'Delivered',
          timestamp: '2025-10-28 02:00 PM',
          completed: true,
          details: 'Received by warehouse manager',
        },
      ],
    },
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotFound(false);
    
    setTimeout(() => {
      const data = mockShipmentData[trackingNumber as keyof typeof mockShipmentData];
      if (data) {
        setShipment(data);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
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

          {/* Not Found Message */}
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

          {/* Shipment Details */}
          {shipment && (
            <>
              {/* Header Info */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{shipment.trackingNumber}</CardTitle>
                      <CardDescription>
                        {shipment.origin} → {shipment.destination}
                      </CardDescription>
                    </div>
                    <Badge className={shipment.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {shipment.status === 'delivered' ? 'Delivered' : 'In Transit'}
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

              {/* Tracking Map */}
              <TrackingMap 
                origin={shipment.origin}
                destination={shipment.destination}
                status={shipment.status}
                shippingType={shipment.shippingType}
              />

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Timeline</CardTitle>
                  <CardDescription>Complete tracking history</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrackingTimeline events={shipment.timeline} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </>
  );
}
