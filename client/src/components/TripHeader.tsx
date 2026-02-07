import { Calendar, MapPin, Target, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TripLegInfo {
  destination: string;
  dates: string;
}

interface TripHeaderProps {
  destination: string;
  dates: string;
  tripTypes?: string[];
  activities: string[];
  legs?: TripLegInfo[];
}

const legColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
];

const legBadgeColors = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-rose-50 text-rose-700 border-rose-200",
];

export default function TripHeader({ destination, dates, tripTypes, activities, legs }: TripHeaderProps) {
  const hasMultipleLegs = legs && legs.length > 1;

  return (
    <Card className="p-6 shadow-card border border-border bg-white">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-charcoal tracking-tight">Trip Overview</h1>
          {tripTypes && tripTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tripTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-full border border-primary/20">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium capitalize text-primary">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Multi-destination route */}
        {hasMultipleLegs ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {legs.map((leg, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border",
                    legBadgeColors[index % legBadgeColors.length]
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold",
                      legColors[index % legColors.length]
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{leg.destination.split(',')[0]}</p>
                      <p className="text-xs opacity-75">{leg.dates}</p>
                    </div>
                  </div>
                  {index < legs.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-success-light rounded-lg">
                <Calendar className="h-4 w-4 text-sage-green" />
              </div>
              <div>
                <p className="text-sm text-warm-gray font-medium">Total Travel Period</p>
                <p className="font-semibold text-charcoal">{dates}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-warm-gray font-medium">Destination</p>
                <p className="font-semibold text-charcoal text-lg">{destination}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-success-light rounded-lg">
                <Calendar className="h-4 w-4 text-sage-green" />
              </div>
              <div>
                <p className="text-sm text-warm-gray font-medium">Travel Dates</p>
                <p className="font-semibold text-charcoal text-lg">{dates}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-warm-gray font-medium mb-2">Activities</p>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((activity, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-secondary text-foreground rounded-full text-sm font-medium border border-border"
                >
                  {activity}
                </span>
              ))
            ) : (
              <span className="text-sm text-warm-gray italic">No activities planned yet</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
