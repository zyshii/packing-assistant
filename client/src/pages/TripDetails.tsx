import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, MapPin, Activity, Sparkles, ArrowRight, Plane, Luggage, Plus, Trash2, AlertTriangle, Info } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

import OnboardingHint from "@/components/OnboardingHint";
import DailyActivityInput from "@/components/DailyActivityInput";

// Weather API date constraints
const today = new Date();
today.setHours(0, 0, 0, 0);
const MAX_WEATHER_DATE = new Date(today);
MAX_WEATHER_DATE.setDate(MAX_WEATHER_DATE.getDate() + 16);
const MAX_TRIP_DAYS = 14;

interface TripLeg {
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const popularDestinations = [
  "New York, NY, USA", "Los Angeles, CA, USA", "Chicago, IL, USA", "Houston, TX, USA",
  "Phoenix, AZ, USA", "Philadelphia, PA, USA", "San Diego, CA, USA", "Dallas, TX, USA",
  "San Francisco, CA, USA", "Austin, TX, USA", "Seattle, WA, USA", "Denver, CO, USA",
  "Boston, MA, USA", "Nashville, TN, USA", "Portland, OR, USA", "Las Vegas, NV, USA",
  "Atlanta, GA, USA", "Miami, FL, USA", "Minneapolis, MN, USA", "Tampa, FL, USA",
  "New Orleans, LA, USA", "Honolulu, HI, USA", "Orlando, FL, USA", "Washington DC, USA",
  "San Antonio, TX, USA", "Jacksonville, FL, USA", "Columbus, OH, USA", "Charlotte, NC, USA",
  "Indianapolis, IN, USA", "Sacramento, CA, USA", "Kansas City, MO, USA", "Raleigh, NC, USA",
  "Cleveland, OH, USA", "St. Louis, MO, USA", "Pittsburgh, PA, USA", "Cincinnati, OH, USA",
  "Anchorage, AK, USA", "Hawaii, HI, USA", "Key West, FL, USA", "Napa Valley, CA, USA",
  "Yellowstone, WY, USA", "Grand Canyon, AZ, USA", "Boise, ID, USA",
  "Paris, France", "Tokyo, Japan", "London, England", "Rome, Italy", "Barcelona, Spain",
  "Amsterdam, Netherlands", "Dubai, UAE", "Sydney, Australia", "Bangkok, Thailand",
  "Singapore", "Berlin, Germany", "Istanbul, Turkey", "Cairo, Egypt", "Mumbai, India",
  "Seoul, South Korea", "Mexico City, Mexico", "Buenos Aires, Argentina",
  "Rio de Janeiro, Brazil", "Cape Town, South Africa", "Marrakech, Morocco",
  "Reykjavik, Iceland", "Stockholm, Sweden", "Vienna, Austria", "Prague, Czech Republic",
  "Budapest, Hungary", "Lisbon, Portugal", "Athens, Greece", "Zurich, Switzerland",
  "Copenhagen, Denmark", "Oslo, Norway", "Helsinki, Finland", "Warsaw, Poland",
  "Dubrovnik, Croatia", "Santorini, Greece", "Bali, Indonesia", "Phuket, Thailand",
  "Maldives", "Fiji", "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada"
];

// Destination autocomplete component for each leg
function DestinationInput({
  value,
  onChange,
  index
}: {
  value: string;
  onChange: (val: string) => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!value || value.length < 2) return [];
    return popularDestinations.filter(d =>
      d.toLowerCase().includes(value.toLowerCase())
    );
  }, [value]);

  return (
    <Popover
      open={open && filtered.length > 0}
      onOpenChange={(newOpen) => {
        if (!newOpen && focused) return;
        setOpen(newOpen);
      }}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder="Type to search destinations..."
            value={value}
            className={cn(
              "pl-10 h-11 text-sm transition-all duration-200",
              (focused || open) && "ring-2 ring-primary ring-offset-1 border-primary"
            )}
            onFocus={() => {
              setFocused(true);
              if (filtered.length > 0) setOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => { if (!open) setFocused(false); }, 150);
            }}
            onChange={(e) => {
              onChange(e.target.value);
              setFocused(true);
              if (e.target.value.length >= 2) setOpen(true);
            }}
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-50 bg-background border border-border shadow-lg"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-[200px]">
            <CommandEmpty>No destinations found.</CommandEmpty>
            <CommandGroup>
              {filtered.map((dest) => (
                <CommandItem
                  key={`${index}-${dest}`}
                  value={dest}
                  onSelect={() => {
                    onChange(dest);
                    setFocused(false);
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-muted"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {dest}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Date picker component
function DatePicker({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled: (date: Date) => boolean;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left font-normal h-11 text-sm",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, "MMM d, yyyy") : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

const destinationColors = [
  "bg-blue-50 border-blue-200",
  "bg-emerald-50 border-emerald-200",
  "bg-amber-50 border-amber-200",
  "bg-purple-50 border-purple-200",
  "bg-rose-50 border-rose-200",
];

const destinationAccents = [
  "text-blue-700",
  "text-emerald-700",
  "text-amber-700",
  "text-purple-700",
  "text-rose-700",
];

function TripDetails() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripTypes, setTripTypes] = useState<string[]>([]);
  const [luggageSize, setLuggageSize] = useState<string>("");
  const [legs, setLegs] = useState<TripLeg[]>([
    { destination: "", startDate: undefined, endDate: undefined }
  ]);
  const [dailyActivities, setDailyActivities] = useState<Array<{ date: string; activities: string[] }>>([]);

  const updateLeg = useCallback((index: number, updates: Partial<TripLeg>) => {
    setLegs(prev => {
      const newLegs = [...prev];
      newLegs[index] = { ...newLegs[index], ...updates };
      return newLegs;
    });
  }, []);

  const addLeg = useCallback(() => {
    setLegs(prev => {
      const lastLeg = prev[prev.length - 1];
      const nextStart = lastLeg?.endDate ? addDays(lastLeg.endDate, 1) : undefined;
      return [...prev, { destination: "", startDate: nextStart, endDate: undefined }];
    });
  }, []);

  const removeLeg = useCallback((index: number) => {
    setLegs(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Calculate total days across all legs
  const totalDays = useMemo(() => {
    return legs.reduce((total, leg) => {
      if (leg.startDate && leg.endDate) {
        return total + differenceInDays(leg.endDate, leg.startDate) + 1;
      }
      return total;
    }, 0);
  }, [legs]);

  // Check if legs have date gaps or overlaps
  const dateWarnings = useMemo(() => {
    const warnings: string[] = [];
    for (let i = 1; i < legs.length; i++) {
      const prevEnd = legs[i - 1].endDate;
      const currStart = legs[i].startDate;
      if (prevEnd && currStart) {
        const gap = differenceInDays(currStart, prevEnd);
        if (gap < 0) {
          warnings.push(`Destination ${i} and ${i + 1} dates overlap.`);
        }
      }
    }
    return warnings;
  }, [legs]);

  // Generate dates grouped by leg for activity input
  const datesWithDestinations = useMemo(() => {
    const result: Array<{ date: string; destination: string; legIndex: number }> = [];
    legs.forEach((leg, legIndex) => {
      if (!leg.startDate || !leg.endDate) return;
      const daysDiff = differenceInDays(leg.endDate, leg.startDate);
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = addDays(leg.startDate, i);
        result.push({
          date: format(currentDate, "MMM d"),
          destination: leg.destination || `Destination ${legIndex + 1}`,
          legIndex,
        });
      }
    });
    return result;
  }, [legs]);

  const dates = useMemo(() => datesWithDestinations.map(d => d.date), [datesWithDestinations]);

  const handleActivitiesChange = (activities: Array<{ date: string; activities: string[] }>) => {
    setDailyActivities(activities);
  };

  useEffect(() => {
    if (dates.length === 0) setDailyActivities([]);
  }, [dates]);

  // Validation
  const isValid = useMemo(() => {
    if (legs.length === 0) return false;
    if (tripTypes.length === 0) return false;
    if (!luggageSize) return false;
    for (const leg of legs) {
      if (!leg.destination || leg.destination.length < 2) return false;
      if (!leg.startDate || !leg.endDate) return false;
      if (leg.endDate < leg.startDate) return false;
      if (leg.endDate > MAX_WEATHER_DATE) return false;
    }
    if (totalDays > MAX_TRIP_DAYS) return false;
    if (totalDays === 0) return false;
    if (dateWarnings.length > 0) return false;
    return true;
  }, [legs, tripTypes, luggageSize, totalDays, dateWarnings]);

  async function onSubmit() {
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const tripLegs = legs.map(leg => ({
        destination: leg.destination,
        startDate: format(leg.startDate!, "yyyy-MM-dd"),
        endDate: format(leg.endDate!, "yyyy-MM-dd"),
      }));

      const tripDataToSave = {
        legs: tripLegs,
        destination: legs.map(l => l.destination).join(" → "),
        tripTypes,
        luggageSize,
        startDate: format(legs[0].startDate!, "yyyy-MM-dd"),
        endDate: format(legs[legs.length - 1].endDate!, "yyyy-MM-dd"),
      };

      localStorage.removeItem('tripData');
      localStorage.removeItem('dailyActivities');
      localStorage.setItem('tripData', JSON.stringify(tripDataToSave));
      localStorage.setItem('dailyActivities', JSON.stringify(dailyActivities));

      setIsSubmitting(false);
      setLocation("/packing-list");
    } catch (error) {
      console.error('Error in form submission:', error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-10">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-full shadow-soft">
              <Sparkles className="w-4 h-4" />
              Packing Assistant
            </div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-charcoal tracking-tight">
              Plan Your Perfect Trip
            </h1>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto leading-relaxed">
              Add multiple destinations and we'll create a single optimized packing list with a day-by-day clothing timeline
            </p>
          </div>

          <OnboardingHint
            title="Multi-destination trips"
            description="Add one or more destinations to your trip. We'll fetch weather for each city and build a unified, day-by-day packing timeline that maximizes clothing reuse across all your stops."
            storageKey="multi-dest-hint-seen"
            className="animate-scale-in"
          />

          {/* API Limit Notice */}
          <Alert className="border border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Weather forecasts are available for up to <strong>14 days total</strong> across all destinations due to API limitations. Plan your trip within this window for accurate weather-based recommendations.
            </AlertDescription>
          </Alert>

          {/* Main Form Card */}
          <Card className="shadow-card border border-border animate-scale-in bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-charcoal">
                <Plane className="h-6 w-6 text-primary" />
                Trip Itinerary
              </CardTitle>
              <CardDescription className="text-base text-warm-gray mt-1">
                Add your destinations in order. Each stop gets its own weather forecast.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Trip Legs */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-base font-semibold text-charcoal">
                  <MapPin className="h-5 w-5 text-primary" />
                  Destinations
                </label>

                <div className="space-y-4">
                  {legs.map((leg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-xl border-2 p-5 transition-all duration-200 animate-fade-in",
                        destinationColors[index % destinationColors.length]
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold text-white",
                            index === 0 ? "bg-blue-500" :
                            index === 1 ? "bg-emerald-500" :
                            index === 2 ? "bg-amber-500" :
                            index === 3 ? "bg-purple-500" : "bg-rose-500"
                          )}>
                            {index + 1}
                          </div>
                          <span className={cn("text-sm font-semibold", destinationAccents[index % destinationAccents.length])}>
                            {leg.destination || `Destination ${index + 1}`}
                          </span>
                        </div>
                        {legs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLeg(index)}
                            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <DestinationInput
                          value={leg.destination}
                          onChange={(val) => updateLeg(index, { destination: val })}
                          index={index}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Date</label>
                            <DatePicker
                              value={leg.startDate}
                              onChange={(date) => updateLeg(index, { startDate: date })}
                              disabled={(date) => {
                                const t = new Date(new Date().setHours(0, 0, 0, 0));
                                if (date < t || date > MAX_WEATHER_DATE) return true;
                                // Must be after previous leg's end date
                                if (index > 0 && legs[index - 1].endDate) {
                                  if (date < legs[index - 1].endDate!) return true;
                                }
                                return false;
                              }}
                              placeholder="Start"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">End Date</label>
                            <DatePicker
                              value={leg.endDate}
                              onChange={(date) => updateLeg(index, { endDate: date })}
                              disabled={(date) => {
                                const t = new Date(new Date().setHours(0, 0, 0, 0));
                                if (date < t || date > MAX_WEATHER_DATE) return true;
                                if (leg.startDate && date < leg.startDate) return true;
                                // Check total days wouldn't exceed limit
                                if (leg.startDate) {
                                  const otherDays = legs.reduce((sum, l, i) => {
                                    if (i === index || !l.startDate || !l.endDate) return sum;
                                    return sum + differenceInDays(l.endDate, l.startDate) + 1;
                                  }, 0);
                                  const thisDays = differenceInDays(date, leg.startDate) + 1;
                                  if (otherDays + thisDays > MAX_TRIP_DAYS) return true;
                                }
                                return false;
                              }}
                              placeholder="End"
                            />
                          </div>
                        </div>

                        {leg.startDate && leg.endDate && (
                          <p className="text-xs text-muted-foreground">
                            {differenceInDays(leg.endDate, leg.startDate) + 1} day{differenceInDays(leg.endDate, leg.startDate) + 1 !== 1 ? 's' : ''} in {leg.destination || `Destination ${index + 1}`}
                          </p>
                        )}
                      </div>

                      {/* Connector to next leg */}
                      {index < legs.length - 1 && (
                        <div className="flex justify-center mt-3 -mb-7 relative z-10">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <div className="w-px h-4 bg-border" />
                            <ArrowRight className="h-3 w-3" />
                            <div className="w-px h-4 bg-border" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Destination Button */}
                {legs.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLeg}
                    className="w-full border-dashed border-2 h-12 text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Destination
                  </Button>
                )}

                {/* Date Warnings */}
                {dateWarnings.length > 0 && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {dateWarnings.map((w, i) => <p key={i}>{w}</p>)}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Total Duration Indicator */}
                {totalDays > 0 && (
                  <div className={cn(
                    "rounded-lg p-4 animate-fade-in",
                    totalDays > MAX_TRIP_DAYS
                      ? "bg-destructive/10 border border-destructive/20"
                      : "bg-muted/50"
                  )}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Total Trip Duration: <span className="font-semibold text-foreground">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                        {legs.length > 1 && <span className="ml-1">across {legs.length} destinations</span>}
                      </p>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        totalDays > MAX_TRIP_DAYS
                          ? "bg-destructive/20 text-destructive"
                          : totalDays > 10
                          ? "bg-warning/20 text-warning"
                          : "bg-success/20 text-success"
                      )}>
                        {totalDays}/{MAX_TRIP_DAYS} days
                      </span>
                    </div>
                    {totalDays > MAX_TRIP_DAYS && (
                      <p className="text-sm text-destructive mt-2">
                        Please reduce your trip to {MAX_TRIP_DAYS} days or fewer for weather forecasts.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Luggage Size */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-charcoal">
                  <Luggage className="h-5 w-5 text-primary" />
                  Luggage Size
                </label>
                <Select onValueChange={setLuggageSize} value={luggageSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your luggage size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carry-on">
                      <div className="flex items-center gap-3 py-1">
                        <div className="text-lg">🎒</div>
                        <div>
                          <div className="font-medium text-sm">Carry-on - 22 inch</div>
                          <div className="text-xs text-warm-gray">Compact, fits overhead</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="backpack">
                      <div className="flex items-center gap-3 py-1">
                        <div className="text-lg">🎒</div>
                        <div>
                          <div className="font-medium text-sm">Backpack - 50L</div>
                          <div className="text-xs text-warm-gray">Travel backpack, ideal for adventure</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium-suitcase">
                      <div className="flex items-center gap-3 py-1">
                        <div className="text-lg">🧳</div>
                        <div>
                          <div className="font-medium text-sm">Medium Suitcase - 24 inch</div>
                          <div className="text-xs text-warm-gray">Standard check-in, week-long trips</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="large-suitcase">
                      <div className="flex items-center gap-3 py-1">
                        <div className="text-lg">🧳</div>
                        <div>
                          <div className="font-medium text-sm">Large Suitcase - 28 inch</div>
                          <div className="text-xs text-warm-gray">Spacious, extended travel</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {luggageSize && (
                  <p className="text-sm text-primary font-medium animate-fade-in">
                    We'll adjust clothing quantities to fit your {luggageSize.replace('-', ' ')}
                  </p>
                )}
              </div>

              {/* Trip Types */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-base font-semibold text-charcoal">
                  <Activity className="h-5 w-5 text-primary" />
                  Trip Types
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["business", "leisure", "adventure"] as const).map((tripType) => (
                    <div
                      key={tripType}
                      className={cn(
                        "flex items-center space-x-3 p-5 border rounded-xl transition-all duration-200 cursor-pointer",
                        tripTypes.includes(tripType) ? "border-primary bg-accent shadow-soft" : "border-border"
                      )}
                      onClick={() => {
                        setTripTypes(prev =>
                          prev.includes(tripType)
                            ? prev.filter(t => t !== tripType)
                            : [...prev, tripType]
                        );
                      }}
                    >
                      <Checkbox
                        checked={tripTypes.includes(tripType)}
                        onCheckedChange={(checked) => {
                          setTripTypes(prev =>
                            checked
                              ? [...prev, tripType]
                              : prev.filter(t => t !== tripType)
                          );
                        }}
                      />
                      <div className="flex-1">
                        <label className="text-base font-medium cursor-pointer block capitalize">
                          {tripType}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {tripType === "business" && "Meetings & conferences"}
                          {tripType === "leisure" && "Vacation & relaxation"}
                          {tripType === "adventure" && "Outdoor activities"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {tripTypes.length > 0 && (
                  <p className="text-sm text-primary font-medium animate-fade-in">
                    {tripTypes.length} trip type{tripTypes.length > 1 ? 's' : ''} selected.
                    We'll customize your activity options accordingly.
                  </p>
                )}

                {/* Daily Activities Section */}
                {tripTypes.length > 0 && dates.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                    <DailyActivityInput
                      dates={dates}
                      tripTypes={tripTypes}
                      onActivitiesChange={handleActivitiesChange}
                      datesWithDestinations={datesWithDestinations}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="button"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 h-auto text-lg shadow-soft transition-all duration-200"
                  disabled={isSubmitting || !isValid}
                  onClick={onSubmit}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating your personalized packing list...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Generate Packing List</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {!isValid && totalDays > 0 && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    Please complete all fields above to generate your packing list
                  </p>
                )}

                <p className="text-center text-sm text-muted-foreground mt-3">
                  We'll analyze weather across all your destinations and create a unified packing timeline
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
