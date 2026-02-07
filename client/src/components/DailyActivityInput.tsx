import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { X, Calendar, Activity, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyActivity {
  date: string;
  activities: string[];
}

interface DateWithDestination {
  date: string;
  destination: string;
  legIndex: number;
}

interface DailyActivityInputProps {
  dates: string[];
  tripTypes?: string[];
  onActivitiesChange: (activities: DailyActivity[]) => void;
  datesWithDestinations?: DateWithDestination[];
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
    return [...baseActivities.business, ...baseActivities.leisure, ...baseActivities.adventure];
  }

  const combinedActivities = tripTypes.reduce((acc, tripType) => {
    const activities = baseActivities[tripType as keyof typeof baseActivities] || [];
    return [...acc, ...activities];
  }, [] as string[]);

  return Array.from(new Set(combinedActivities));
};

const destinationColors = [
  "border-l-blue-400",
  "border-l-emerald-400",
  "border-l-amber-400",
  "border-l-purple-400",
  "border-l-rose-400",
];

const destinationBadgeColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

export default function DailyActivityInput({ dates, tripTypes, onActivitiesChange, datesWithDestinations }: DailyActivityInputProps) {
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [activityInputs, setActivityInputs] = useState<{ [key: number]: string }>({});
  const [openPopovers, setOpenPopovers] = useState<{ [key: number]: boolean }>({});
  const [inputFocused, setInputFocused] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const newDailyActivities = dates.map(date => {
      const existingDay = dailyActivities.find(day => day.date === date);
      return existingDay || { date, activities: [] };
    });

    setDailyActivities(newDailyActivities);

    const newInputs: { [key: number]: string } = {};
    const newPopovers: { [key: number]: boolean } = {};
    const newFocused: { [key: number]: boolean } = {};

    dates.forEach((_, index) => {
      newInputs[index] = activityInputs[index] || '';
      newPopovers[index] = openPopovers[index] || false;
      newFocused[index] = inputFocused[index] || false;
    });

    setActivityInputs(newInputs);
    setOpenPopovers(newPopovers);
    setInputFocused(newFocused);
    onActivitiesChange(newDailyActivities);
  }, [dates]);

  const addActivity = (dateIndex: number, activity: string) => {
    const updated = [...dailyActivities];
    if (updated[dateIndex] && !updated[dateIndex].activities.includes(activity)) {
      updated[dateIndex].activities.push(activity);
      setDailyActivities(updated);
      onActivitiesChange(updated);
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
    setTimeout(() => {
      if (!openPopovers[dateIndex]) {
        setInputFocused(prev => ({ ...prev, [dateIndex]: false }));
      }
    }, 150);
  };

  const predefinedActivities = getActivitiesByTripTypes(tripTypes);

  // Group dates by destination for display
  const groupedByDestination = (() => {
    if (!datesWithDestinations || datesWithDestinations.length === 0) {
      return [{ destination: "", legIndex: 0, dateIndices: dates.map((_, i) => i) }];
    }

    const groups: Array<{ destination: string; legIndex: number; dateIndices: number[] }> = [];
    let currentGroup: typeof groups[0] | null = null;

    datesWithDestinations.forEach((dwd, index) => {
      if (!currentGroup || currentGroup.legIndex !== dwd.legIndex) {
        currentGroup = { destination: dwd.destination, legIndex: dwd.legIndex, dateIndices: [index] };
        groups.push(currentGroup);
      } else {
        currentGroup.dateIndices.push(index);
      }
    });

    return groups;
  })();

  const hasMultipleDestinations = groupedByDestination.length > 1;

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
          {groupedByDestination.map((group) => (
            <div key={`group-${group.legIndex}`}>
              {/* Destination header */}
              {hasMultipleDestinations && (
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white",
                    group.legIndex === 0 ? "bg-blue-500" :
                    group.legIndex === 1 ? "bg-emerald-500" :
                    group.legIndex === 2 ? "bg-amber-500" :
                    group.legIndex === 3 ? "bg-purple-500" : "bg-rose-500"
                  )}>
                    {group.legIndex + 1}
                  </div>
                  <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {group.destination}
                  </span>
                </div>
              )}

              <Accordion type="multiple" className="w-full">
                {group.dateIndices.map((dateIndex) => (
                  <AccordionItem
                    key={dates[dateIndex]}
                    value={`day-${dateIndex}`}
                    className={cn(
                      hasMultipleDestinations && "border-l-4",
                      hasMultipleDestinations && destinationColors[group.legIndex % destinationColors.length]
                    )}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-travel-blue" />
                        <span className="font-medium text-foreground">{dates[dateIndex]}</span>
                        {hasMultipleDestinations && (
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            destinationBadgeColors[group.legIndex % destinationBadgeColors.length]
                          )}>
                            {group.destination.split(',')[0]}
                          </span>
                        )}
                        {dailyActivities[dateIndex]?.activities.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {dailyActivities[dateIndex].activities.length} activit{dailyActivities[dateIndex].activities.length === 1 ? 'y' : 'ies'}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
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

                      <div className="flex flex-col gap-2">
                        <Popover
                          open={openPopovers[dateIndex] && getFilteredActivities(dateIndex).length > 0}
                          onOpenChange={(newOpen) => {
                            if (!newOpen && inputFocused[dateIndex]) return;
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
                            onOpenAutoFocus={(e) => e.preventDefault()}
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
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-info-light rounded-lg border border-info/20">
          <p className="text-sm text-info">
            {tripTypes && tripTypes.length > 0
              ? `These ${tripTypes.join(', ')}-focused activities will help us recommend the perfect gear and clothing for your trip.`
              : "Adding specific activities helps us suggest the right gear, footwear, and clothing for each day."
            }
          </p>
        </div>
      </div>
    </Card>
  );
}
