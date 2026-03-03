import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { X, ChevronDown, ChevronRight } from "lucide-react";
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

export default function DailyActivityInput({ dates, tripTypes, onActivitiesChange, datesWithDestinations }: DailyActivityInputProps) {
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [activityInputs, setActivityInputs] = useState<{ [key: number]: string }>({});
  const [openPopovers, setOpenPopovers] = useState<{ [key: number]: boolean }>({});
  const [inputFocused, setInputFocused] = useState<{ [key: number]: boolean }>({});
  const [openDays, setOpenDays] = useState<string[]>([]);

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

  const legColors = [
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"
  ];

  return (
    <div className="flex flex-col w-full rounded-[14px] overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 text-[20px] leading-normal px-0 pb-3">
        <span className="text-[#3e7050] text-[20px]">🎡</span>
        <h3 className="font-display font-bold text-[#3a2a1a] whitespace-nowrap">Plan Your Daily Activities</h3>
      </div>

      {/* Description */}
      <p className="font-body text-[#7a6e5a] text-[13px] leading-[1.5] pb-4">
        {`Select activities for each day — we'll tailor outfit suggestions to match.`}
      </p>

      {/* Divider */}
      <div className="bg-[#c9c1a8] h-px mb-0" />

      {/* Day list */}
      <div className="flex flex-col w-full">
        {groupedByDestination.map((group) => (
          <div key={`group-${group.legIndex}`}>
            {/* Destination header for multi-destination trips */}
            {hasMultipleDestinations && (
              <div className="flex items-center gap-2 px-0 py-3">
                <div className={cn(
                  "flex items-center justify-center rounded-full size-5 text-white text-[11px] font-bold",
                  legColors[group.legIndex % legColors.length]
                )}>
                  {group.legIndex + 1}
                </div>
                <span className="text-[13px] font-semibold text-[#7a6e5a]">{group.destination}</span>
              </div>
            )}

            <Accordion type="multiple" value={openDays} onValueChange={setOpenDays} className="w-full">
              {group.dateIndices.map((dateIndex) => {
                const isOpen = openDays.includes(`day-${dateIndex}`);
                const activityCount = dailyActivities[dateIndex]?.activities.length ?? 0;

                return (
                  <AccordionItem
                    key={dates[dateIndex]}
                    value={`day-${dateIndex}`}
                    className="border-b-0 border-t border-[#c9c1a8] first:border-t-0"
                  >
                    <AccordionTrigger className="hover:no-underline [&>svg]:hidden px-0 py-3.5">
                      <div className="flex items-center gap-2.5 flex-1">
                        <div className={cn(
                          "flex items-center justify-center rounded-full size-7 shrink-0",
                          isOpen ? "bg-[#3e7050]" : "bg-[#eae4d1]"
                        )}>
                          <span className={cn("text-[14px]", isOpen ? "text-white" : "text-[#a09282]")}>📅</span>
                        </div>
                        <span className="font-body font-semibold text-[14px] text-[#3a2a1a]">
                          {dates[dateIndex]}
                        </span>
                        {activityCount > 0 && (
                          <div className="bg-[#3e7050] flex items-center justify-center px-2.5 py-0.5 rounded-full">
                            <span className="font-body font-bold text-[11px] text-white">
                              {activityCount}
                            </span>
                          </div>
                        )}
                        <div className="ml-auto text-[#a09282]">
                          {isOpen
                            ? <ChevronDown className="h-5 w-5" />
                            : <ChevronRight className="h-5 w-5" />
                          }
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-0">
                      <div className="bg-[#f3f0d6] flex flex-col gap-2.5 px-5 pb-4 pt-2.5 -mx-0 rounded-lg">
                        {/* Activity pills */}
                        {activityCount > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {dailyActivities[dateIndex]?.activities.map((activity, activityIndex) => (
                              <div
                                key={activityIndex}
                                className="bg-[#3e7050] flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                              >
                                <span className="font-body font-semibold text-[12px] text-white">
                                  {activity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeActivity(dateIndex, activityIndex)}
                                  className="text-white/70 hover:text-white transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Activity search input */}
                        <Popover
                          open={openPopovers[dateIndex] && getFilteredActivities(dateIndex).length > 0}
                          onOpenChange={(newOpen) => {
                            if (!newOpen && inputFocused[dateIndex]) return;
                            setOpenPopovers(prev => ({ ...prev, [dateIndex]: newOpen }));
                          }}
                        >
                          <PopoverTrigger asChild>
                            <div className="bg-[#f9f6e8] flex items-center gap-2 h-[38px] px-3 rounded-lg text-[#a09282] cursor-text">
                              <span className="text-[14px] shrink-0">🔍</span>
                              <Input
                                placeholder="Add activity…"
                                value={activityInputs[dateIndex] || ''}
                                onChange={(e) => handleInputChange(dateIndex, e.target.value)}
                                onFocus={() => handleInputFocus(dateIndex)}
                                onBlur={() => handleInputBlur(dateIndex)}
                                className="bg-transparent border-0 h-auto p-0 text-[13px] text-[#3a2a1a] placeholder:text-[#a09282] focus-visible:ring-0 font-body"
                              />
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
                                    ? "Type at least 2 characters to search…"
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
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
