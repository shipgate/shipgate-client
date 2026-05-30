'use client';

import { CheckCircle2, Circle, MapPin, Clock } from 'lucide-react';

interface TimelineEvent {
  location: string;
  status: string;
  timestamp: string;
  completed: boolean;
  details: string;
  parcelUpdates?: Array<{ parcelId: string; previousStatus?: string; newStatus?: string }>;
  flightInfo?: string;
}

interface TrackingTimelineProps {
  events: TimelineEvent[];
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline Connector */}
          <div className="flex flex-col items-center">
            {event.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground shrink-0" />
            )}
            {index < events.length - 1 && (
              <div className={`w-0.5 h-16 ${event.completed ? 'bg-green-500' : 'bg-muted'}`} />
            )}
          </div>

          {/* Event Details */}
          <div className="pb-6 flex-1">
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground">{event.status}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${event.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {event.completed ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p>{event.location}</p>
                </div>

                <div className="flex items-center gap-2 text-foreground/70">
                  <Clock className="w-4 h-4 text-primary" />
                  <p>{event.timestamp}</p>
                </div>

                <p className="text-foreground/60 ml-6">{event.details}</p>

                {Array.isArray(event.parcelUpdates) && event.parcelUpdates.length > 0 ? (
                  <div className="ml-6 rounded-lg border border-border bg-surface p-3 text-sm">
                    <p className="font-semibold text-foreground">Parcel updates</p>
                    <div className="mt-2 space-y-2">
                      {event.parcelUpdates.map((parcel, parcelIndex) => (
                        <div key={parcelIndex} className="rounded-lg bg-background p-2">
                          <p className="font-medium text-foreground">{parcel.parcelId}</p>
                          <p className="text-foreground/70 text-xs">
                            {parcel.previousStatus ? `From ${parcel.previousStatus}` : ""}
                            {parcel.previousStatus && parcel.newStatus ? " → " : ""}
                            {parcel.newStatus || "Status updated"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {event.flightInfo && (
                  <div className="ml-6 p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                    <p className="text-blue-700 text-xs font-semibold">Flight Status</p>
                    <p className="text-blue-600 text-xs">{event.flightInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
