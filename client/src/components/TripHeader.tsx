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
    <Card className="p-8 shadow-floating border-2 border-warm-orange/20 bg-gradient-to-br from-white to-warm-beige/30">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">Trip Overview</h1>
          {/* Trip Types Display */}
          {tripTypes && tripTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tripTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-deep-violet/10 rounded-full border-2 border-deep-violet/30 hover:bg-deep-violet/20 transition-colors duration-300">
                  <Target className="h-4 w-4 text-deep-violet" />
                  <span className="text-sm font-bold capitalize text-deep-violet">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warm-orange/15 rounded-2xl border-2 border-warm-orange/30 shadow-soft">
              <MapPin className="h-5 w-5 text-warm-orange" />
            </div>
            <div>
              <p className="text-sm text-warm-gray font-medium">Destination</p>
              <p className="font-bold text-charcoal text-lg">{destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-sage-green/15 rounded-2xl border-2 border-sage-green/30 shadow-soft">
              <Calendar className="h-5 w-5 text-sage-green" />
            </div>
            <div>
              <p className="text-sm text-warm-gray font-medium">Travel Dates</p>
              <p className="font-bold text-charcoal text-lg">{dates}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-warm-gray font-semibold mb-3">Trip Types & Activities</p>
          <div className="flex flex-wrap gap-2">
            {/* Trip Type Labels */}
            {Array.isArray(activities) && activities.length > 0 ? (
              // If activities is an array of actual activities, show them
              activities.map((activity, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-burnt-orange/10 text-burnt-orange rounded-full text-sm font-bold border-2 border-burnt-orange/30 hover:bg-burnt-orange/20 transition-all duration-300 hover:scale-105"
                >
                  {activity}
                </span>
              ))
            ) : (
              // Fallback for no activities
              <span className="text-sm text-warm-gray italic">No activities planned yet</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}