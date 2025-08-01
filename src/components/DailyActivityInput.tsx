import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
  const [activityInputs, setActivityInputs] = useState<{ [key: number]: string }>({});
  const [openPopovers, setOpenPopovers] = useState<{ [key: number]: boolean }>({});
  const [inputFocused, setInputFocused] = useState<{ [key: number]: boolean }>({});

  // Sync dailyActivities with dates prop changes
  useEffect(() => {
    // Preserve existing activities for dates that still exist
    const newDailyActivities = dates.map(date => {
      const existingDay = dailyActivities.find(day => day.date === date);
      return existingDay || { date, activities: [] };
    });
    
    setDailyActivities(newDailyActivities);
    
    // Initialize or update input states for each date
    const newInputs: { [key: number]: string } = {};
    const newPopovers: { [key: number]: boolean } = {};
    const newFocused: { [key: number]: boolean } = {};
    
    dates.forEach((_, index) => {
      // Preserve existing input states if they exist, otherwise initialize
      newInputs[index] = activityInputs[index] || '';
      newPopovers[index] = openPopovers[index] || false;
      newFocused[index] = inputFocused[index] || false;
    });
    
    setActivityInputs(newInputs);
    setOpenPopovers(newPopovers);
    setInputFocused(newFocused);
    
    // Notify parent component of the updated activities
    onActivitiesChange(newDailyActivities);
  }, [dates]); // Remove onActivitiesChange from dependency to avoid infinite loops

  const addActivity = (dateIndex: number, activity: string) => {
    const updated = [...dailyActivities];
    if (updated[dateIndex] && !updated[dateIndex].activities.includes(activity)) {
      updated[dateIndex].activities.push(activity);
      setDailyActivities(updated);
      onActivitiesChange(updated);
      // Clear the input, close popover, and remove focus for this date
      setActivityInputs(prev => ({ ...prev, [dateIndex]: '' }));
      setOpenPopovers(prev => ({ ...prev, [dateIndex]: false }));
      setInputFocused(prev => ({ ...prev, [dateIndex]: false }));
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

  const getFilteredActivities = (dateIndex: number) => {
    const input = activityInputs[dateIndex] || '';
    if (!input.trim() || input.length < 2) return [];
    
    return predefinedActivities.filter(activity => 
      activity.toLowerCase().includes(input.toLowerCase()) &&
      !dailyActivities[dateIndex]?.activities.includes(activity)
    );
  };

  const handleInputChange = (dateIndex: number, value: string) => {
    setActivityInputs(prev => ({ ...prev, [dateIndex]: value }));
    setInputFocused(prev => ({ ...prev, [dateIndex]: true }));
    // Only open popover if we have enough characters to search
    if (value.length >= 2) {
      setOpenPopovers(prev => ({ ...prev, [dateIndex]: true }));
    } else {
      setOpenPopovers(prev => ({ ...prev, [dateIndex]: false }));
    }
  };

  const handleInputFocus = (dateIndex: number) => {
    setInputFocused(prev => ({ ...prev, [dateIndex]: true }));
    const input = activityInputs[dateIndex] || '';
    if (input.length >= 2 && getFilteredActivities(dateIndex).length > 0) {
      setOpenPopovers(prev => ({ ...prev, [dateIndex]: true }));
    }
  };

  const handleInputBlur = (dateIndex: number) => {
    // Only remove focus state if dropdown is closed and no typing activity
    setTimeout(() => {
      if (!openPopovers[dateIndex]) {
        setInputFocused(prev => ({ ...prev, [dateIndex]: false }));
      }
    }, 150);
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
              <div className="flex flex-col gap-2">
                <Popover 
                  open={openPopovers[dateIndex] && getFilteredActivities(dateIndex).length > 0} 
                  onOpenChange={(newOpen) => {
                    // Prevent closing dropdown when clicking in input or while typing
                    if (!newOpen && inputFocused[dateIndex]) {
                      return;
                    }
                    setOpenPopovers(prev => ({ ...prev, [dateIndex]: newOpen }));
                  }}
                >
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        placeholder={
                          tripTypes && tripTypes.length > 0
                            ? `Type to search ${tripTypes.join('/')} activities...`
                            : "Type to search activities..."
                        }
                        value={activityInputs[dateIndex] || ''}
                        onChange={(e) => handleInputChange(dateIndex, e.target.value)}
                        onFocus={() => handleInputFocus(dateIndex)}
                        onBlur={() => handleInputBlur(dateIndex)}
                        className={`w-full transition-all duration-200 ${
                          inputFocused[dateIndex] || openPopovers[dateIndex]
                            ? 'ring-2 ring-primary ring-offset-2 border-primary' 
                            : ''
                        }`}
                      />
                      <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-full p-0 z-50 bg-background border border-border shadow-lg" 
                    align="start"
                    onOpenAutoFocus={(e) => {
                      // Prevent popover from stealing focus from input
                      e.preventDefault();
                    }}
                  >
                    <Command shouldFilter={false}>
                      <CommandList className="max-h-[200px]">
                        <CommandEmpty>
                          {(activityInputs[dateIndex]?.length || 0) < 2 
                            ? "Type at least 2 characters to search..." 
                            : "No matching activities found."
                          }
                        </CommandEmpty>
                        <CommandGroup>
                          {getFilteredActivities(dateIndex).map((activity) => (
                            <CommandItem
                              key={activity}
                              value={activity}
                              onSelect={() => addActivity(dateIndex, activity)}
                              className="cursor-pointer hover:bg-muted"
                            >
                              <Activity className="mr-2 h-4 w-4" />
                              {activity}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {activityInputs[dateIndex] && activityInputs[dateIndex].length >= 2 && (
                  <div className="mt-2">
                    {getFilteredActivities(dateIndex).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        💡 No matching activities found. Try a different search term.
                      </p>
                    ) : (
                      <p className="text-sm text-success">
                        ✨ {getFilteredActivities(dateIndex).length} activit{getFilteredActivities(dateIndex).length === 1 ? 'y' : 'ies'} found - select one from the list above
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-info-light rounded-lg border border-info/20">
          <p className="text-sm text-info">
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