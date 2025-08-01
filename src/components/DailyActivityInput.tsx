import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Calendar, Activity } from "lucide-react";

interface DailyActivity {
  date: string;
  activities: string[];
}

interface DailyActivityInputProps {
  dates: string[];
  tripTypes?: string[];
  onActivitiesChange: (activities: DailyActivity[]) => void;
}

const getActivitiesByTripTypes = (tripTypes?: string[]) => {
  const baseActivities = {
    business: [
      "Business meetings", "Conferences", "Networking events", "Client dinners", 
      "Presentations", "Workshop attendance", "Team building", "Corporate events",
      "Office visits", "Trade shows", "Airport transfers", "Hotel dining"
    ],
    leisure: [
      "Sightseeing", "Museums", "Shopping", "Dining", "Photography", "City walking",
      "Cultural tours", "Beach", "Swimming", "Spa", "Wine tasting", "Local markets",
      "Art galleries", "Theater shows", "Cafes", "Parks", "Boat tours", "Food tours"
    ],
    adventure: [
      "Hiking", "Rock climbing", "Cycling", "Water sports", "Skiing", "Snowboarding",
      "Camping", "Fishing", "Adventure sports", "Nature walks", "Wildlife watching",
      "Mountain biking", "Kayaking", "Surfing", "Paragliding", "Zip lining", "Rafting"
    ]
  };

  if (!tripTypes || tripTypes.length === 0) {
    return [
      ...baseActivities.business,
      ...baseActivities.leisure,
      ...baseActivities.adventure
    ];
  }

  // Combine activities from all selected trip types
  const combinedActivities = tripTypes.reduce((acc, tripType) => {
    const activities = baseActivities[tripType as keyof typeof baseActivities] || [];
    return [...acc, ...activities];
  }, [] as string[]);

  // Remove duplicates and return
  return [...new Set(combinedActivities)];
};

export default function DailyActivityInput({ dates, tripTypes, onActivitiesChange }: DailyActivityInputProps) {
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);

  // Sync dailyActivities with dates prop changes
  useEffect(() => {
    setDailyActivities(dates.map(date => ({ date, activities: [] })));
  }, [dates]);

  const addActivity = (dateIndex: number, activity: string) => {
    const updated = [...dailyActivities];
    if (updated[dateIndex] && !updated[dateIndex].activities.includes(activity)) {
      updated[dateIndex].activities.push(activity);
      setDailyActivities(updated);
      onActivitiesChange(updated);
    }
  };

  const removeActivity = (dateIndex: number, activityIndex: number) => {
    const updated = [...dailyActivities];
    if (updated[dateIndex]) {
      updated[dateIndex].activities.splice(activityIndex, 1);
      setDailyActivities(updated);
      onActivitiesChange(updated);
    }
  };

  const predefinedActivities = getActivitiesByTripTypes(tripTypes);

  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Plan Your Daily Activities</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          {tripTypes && tripTypes.length > 0
            ? `Based on your ${tripTypes.join(', ')} trip${tripTypes.length > 1 ? 's' : ''}, here are some relevant activities. Specify what you plan to do each day for personalized packing recommendations.`
            : "Specify your planned activities for each day to get more personalized packing recommendations."
          }
        </p>

        <div className="space-y-6">
          {dates.map((date, dateIndex) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-travel-blue" />
                <h4 className="font-medium text-foreground">{date}</h4>
              </div>

              {/* Selected Activities */}
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {dailyActivities[dateIndex]?.activities.map((activity, activityIndex) => (
                  <Badge key={activityIndex} variant="secondary" className="flex items-center gap-1">
                    {activity}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeActivity(dateIndex, activityIndex)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )) || []}
              </div>

              {/* Add Activities */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Select onValueChange={(value) => addActivity(dateIndex, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      tripTypes && tripTypes.length > 0
                        ? `Choose ${tripTypes.join('/')} activity` 
                        : "Choose an activity"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {predefinedActivities
                      .filter(activity => !dailyActivities[dateIndex]?.activities.includes(activity))
                      .map(activity => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-travel-green/10 rounded-lg border border-travel-green/20">
          <p className="text-sm text-travel-green">
            💡 {tripTypes && tripTypes.length > 0
              ? `These ${tripTypes.join(', ')}-focused activities will help us recommend the perfect gear and clothing for your trip.`
              : "Adding specific activities helps us suggest the right gear, footwear, and clothing for each day."
            }
          </p>
        </div>
      </div>
    </Card>
  );
}