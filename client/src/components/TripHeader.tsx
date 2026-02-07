import { Calendar, MapPin, Target, Plane } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TripHeaderProps {
  destination: string;
  dates: string;
  tripTypes?: string[];
  activities: string[];
}

export default function TripHeader({ destination, dates, tripTypes, activities }: TripHeaderProps) {
  return (
    <Card className="p-6 shadow-card border border-border bg-white">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-charcoal tracking-tight">Trip Overview</h1>
          {/* Trip Types Display */}
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
