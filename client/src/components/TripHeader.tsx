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
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Trip Overview</h1>
          {/* Trip Types Display */}
          {tripTypes && tripTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tripTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-info-light rounded-full border border-info/20">
                  <Target className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium capitalize text-info">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-medium text-foreground">{destination}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-light rounded-lg border border-success/20">
              <Calendar className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travel Dates</p>
              <p className="font-medium text-foreground">{dates}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Trip Types & Activities</p>
          <div className="flex flex-wrap gap-2">
            {/* Trip Type Labels */}
            {Array.isArray(activities) && activities.length > 0 ? (
              // If activities is an array of actual activities, show them
              activities.map((activity, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-warning-light text-warning rounded-full text-sm font-medium border border-warning/20"
                >
                  {activity}
                </span>
              ))
            ) : (
              // Fallback for no activities
              <span className="text-sm text-muted-foreground italic">No activities planned yet</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}