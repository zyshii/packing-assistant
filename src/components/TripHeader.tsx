import { Calendar, MapPin, Users, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TripHeaderProps {
  destination: string;
  dates: string;
  tripType: string;
  travelers: number;
  activities: string[];
}

export default function TripHeader({ destination, dates, tripType, travelers, activities }: TripHeaderProps) {
  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Your Packing List</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-travel-blue/20 rounded-full">
            <Target className="h-4 w-4 text-travel-blue" />
            <span className="text-sm font-medium capitalize text-travel-blue">{tripType}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-travel-purple/20 rounded-lg">
              <MapPin className="h-4 w-4 text-travel-purple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-medium text-foreground">{destination}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-travel-green/20 rounded-lg">
              <Calendar className="h-4 w-4 text-travel-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travel Dates</p>
              <p className="font-medium text-foreground">{dates}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-travel-orange/20 rounded-lg">
              <Users className="h-4 w-4 text-travel-orange" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travelers</p>
              <p className="font-medium text-foreground">{travelers} {travelers === 1 ? 'person' : 'people'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Planned Activities</p>
          <div className="flex flex-wrap gap-2">
            {activities.map((activity, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-travel-yellow/20 text-travel-yellow rounded-full text-sm font-medium"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}