import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Trash2, AlertTriangle } from "lucide-react";

import OnboardingHint from "@/components/OnboardingHint";
import DailyActivityInput from "@/components/DailyActivityInput";

// Weather API date constraints
const today = new Date();
today.setHours(0, 0, 0, 0);
const MAX_WEATHER_DATE = new Date(today);
MAX_WEATHER_DATE.setDate(MAX_WEATHER_DATE.getDate() + 15);
const MAX_TRIP_DAYS = 14;

interface TripLeg {
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const popularDestinations = [
  // --- US Cities: Top 200+ by population (Census 2024) ---
  // Top 10
  "New York, NY, USA", "Los Angeles, CA, USA", "Chicago, IL, USA", "Houston, TX, USA",
  "Phoenix, AZ, USA", "Philadelphia, PA, USA", "San Antonio, TX, USA", "San Diego, CA, USA",
  "Dallas, TX, USA", "Jacksonville, FL, USA",
  // 11-25
  "Austin, TX, USA", "Fort Worth, TX, USA", "San Jose, CA, USA", "Columbus, OH, USA",
  "Charlotte, NC, USA", "Indianapolis, IN, USA", "San Francisco, CA, USA", "Seattle, WA, USA",
  "Denver, CO, USA", "Oklahoma City, OK, USA", "Nashville, TN, USA", "Washington DC, USA",
  "El Paso, TX, USA", "Las Vegas, NV, USA", "Boston, MA, USA",
  // 26-50
  "Detroit, MI, USA", "Portland, OR, USA", "Louisville, KY, USA", "Memphis, TN, USA",
  "Baltimore, MD, USA", "Milwaukee, WI, USA", "Albuquerque, NM, USA", "Tucson, AZ, USA",
  "Fresno, CA, USA", "Sacramento, CA, USA", "Mesa, AZ, USA", "Atlanta, GA, USA",
  "Kansas City, MO, USA", "Colorado Springs, CO, USA", "Omaha, NE, USA", "Raleigh, NC, USA",
  "Miami, FL, USA", "Virginia Beach, VA, USA", "Long Beach, CA, USA", "Oakland, CA, USA",
  "Minneapolis, MN, USA", "Bakersfield, CA, USA", "Tulsa, OK, USA", "Tampa, FL, USA",
  "Arlington, TX, USA",
  // 51-75
  "Wichita, KS, USA", "Aurora, CO, USA", "New Orleans, LA, USA", "Cleveland, OH, USA",
  "Honolulu, HI, USA", "Anaheim, CA, USA", "Henderson, NV, USA", "Orlando, FL, USA",
  "Lexington, KY, USA", "Stockton, CA, USA", "Riverside, CA, USA", "Corpus Christi, TX, USA",
  "Irvine, CA, USA", "Cincinnati, OH, USA", "Santa Ana, CA, USA", "Newark, NJ, USA",
  "St. Paul, MN, USA", "Pittsburgh, PA, USA", "Greensboro, NC, USA", "Durham, NC, USA",
  "Lincoln, NE, USA", "Jersey City, NJ, USA", "Plano, TX, USA", "Anchorage, AK, USA",
  "St. Louis, MO, USA",
  // 76-100
  "Madison, WI, USA", "Chandler, AZ, USA", "Gilbert, AZ, USA", "Reno, NV, USA",
  "Buffalo, NY, USA", "Chula Vista, CA, USA", "Fort Wayne, IN, USA", "Lubbock, TX, USA",
  "Toledo, OH, USA", "St. Petersburg, FL, USA", "Laredo, TX, USA", "Irving, TX, USA",
  "Chesapeake, VA, USA", "Winston-Salem, NC, USA", "Port St. Lucie, FL, USA",
  "Scottsdale, AZ, USA", "Garland, TX, USA", "Boise, ID, USA", "Norfolk, VA, USA",
  "Spokane, WA, USA", "Richmond, VA, USA", "Fremont, CA, USA", "Huntsville, AL, USA",
  // 101-125
  "Frisco, TX, USA", "McKinney, TX, USA", "Hialeah, FL, USA", "Tacoma, WA, USA",
  "Salt Lake City, UT, USA", "San Bernardino, CA, USA", "Fontana, CA, USA",
  "Modesto, CA, USA", "Baton Rouge, LA, USA", "Sioux Falls, SD, USA",
  "Moreno Valley, CA, USA", "Worcester, MA, USA", "Grand Prairie, TX, USA",
  "Des Moines, IA, USA", "Yonkers, NY, USA", "Fayetteville, NC, USA",
  "Tallahassee, FL, USA", "Little Rock, AR, USA", "Rochester, NY, USA",
  "Overland Park, KS, USA", "Amarillo, TX, USA", "Knoxville, TN, USA",
  "Augusta, GA, USA", "Grand Rapids, MI, USA", "Oxnard, CA, USA",
  // 126-150
  "Columbus, GA, USA", "Mobile, AL, USA", "Providence, RI, USA", "Chattanooga, TN, USA",
  "Clarksville, TN, USA", "Brownsville, TX, USA", "Fort Lauderdale, FL, USA",
  "Birmingham, AL, USA", "Montgomery, AL, USA", "Tempe, AZ, USA",
  "Huntington Beach, CA, USA", "Ontario, CA, USA", "Akron, OH, USA", "Cary, NC, USA",
  "Elk Grove, CA, USA", "Glendale, CA, USA", "Pembroke Pines, FL, USA", "Salem, OR, USA",
  "Newport News, VA, USA", "Aurora, IL, USA", "Surprise, AZ, USA", "Eugene, OR, USA",
  "Denton, TX, USA", "Rancho Cucamonga, CA, USA", "Santa Rosa, CA, USA",
  // 151-175
  "Murfreesboro, TN, USA", "Shreveport, LA, USA", "Fort Collins, CO, USA",
  "Springfield, MO, USA", "Roseville, CA, USA", "Oceanside, CA, USA",
  "Lancaster, CA, USA", "Killeen, TX, USA", "Corona, CA, USA", "Hollywood, FL, USA",
  "Charleston, SC, USA", "Salinas, CA, USA", "Palmdale, CA, USA", "Alexandria, VA, USA",
  "Sunnyvale, CA, USA", "Lakewood, CO, USA", "Kansas City, KS, USA", "Hayward, CA, USA",
  "Springfield, MA, USA", "Bellevue, WA, USA", "Naperville, IL, USA",
  "Bridgeport, CT, USA", "Palm Bay, FL, USA", "Joliet, IL, USA", "McAllen, TX, USA",
  // 176-200
  "Gainesville, FL, USA", "Waco, TX, USA", "Savannah, GA, USA", "Columbia, SC, USA",
  "Midland, TX, USA", "Rockford, IL, USA", "Syracuse, NY, USA", "New Haven, CT, USA",
  "Fargo, ND, USA", "Stamford, CT, USA", "Cedar Rapids, IA, USA", "Dayton, OH, USA",
  "Jackson, MS, USA", "West Palm Beach, FL, USA", "Lakeland, FL, USA",
  "Wilmington, NC, USA", "Ann Arbor, MI, USA", "North Charleston, SC, USA",
  // 201-230 (additional notable cities / metros)
  "Topeka, KS, USA", "Billings, MT, USA", "Manchester, NH, USA", "Las Cruces, NM, USA",
  "Springfield, IL, USA", "Peoria, IL, USA", "Tyler, TX, USA", "Clearwater, FL, USA",
  "Provo, UT, USA", "Lansing, MI, USA", "Evansville, IN, USA", "Everett, WA, USA",
  "Beaumont, TX, USA", "Pueblo, CO, USA", "Bend, OR, USA", "Hillsboro, OR, USA",
  "Gresham, OR, USA", "Fayetteville, AR, USA", "Fort Myers, FL, USA",
  "Carlsbad, CA, USA", "Abilene, TX, USA", "Vallejo, CA, USA",
  "Concord, CA, USA", "Hartford, CT, USA", "Lowell, MA, USA",
  "Lafayette, LA, USA", "Tuscaloosa, AL, USA", "High Point, NC, USA",
  "Athens, GA, USA", "Macon, GA, USA",
  // Notable tourist / travel destinations
  "Hawaii, HI, USA", "Key West, FL, USA", "Napa Valley, CA, USA",
  "Yellowstone, WY, USA", "Grand Canyon, AZ, USA", "Asheville, NC, USA",
  "Santa Fe, NM, USA", "Sedona, AZ, USA", "Palm Springs, CA, USA",
  "Sarasota, FL, USA", "Pensacola, FL, USA", "Myrtle Beach, SC, USA",
  "Park City, UT, USA", "Martha's Vineyard, MA, USA", "Maui, HI, USA",
  // --- International Destinations ---
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

// Destination autocomplete component
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
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[15px] pointer-events-none select-none">
            🔍
          </span>
          <Input
            placeholder="e.g. Paris, Tokyo, New York…"
            value={value}
            className={cn(
              "h-[42px] pl-[38px] pr-3 text-[14px] bg-[#f9f6e8] border-0 rounded-lg",
              "text-[#3a2a1a] placeholder:text-[#a09282] font-body",
              "focus-visible:ring-2 focus-visible:ring-[#3e7050] focus-visible:ring-offset-0"
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
                  <span className="mr-2">📍</span>
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
        <button
          type="button"
          className="w-full bg-[#f9f6e8] flex items-center gap-2 h-[42px] px-[14px] rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[#3e7050] focus:ring-offset-0 transition-all"
        >
          <span className="text-[15px] shrink-0 text-[#a09282]">📅</span>
          <span className={cn(
            "text-[14px] font-body flex-1 leading-none",
            value ? "text-[#3a2a1a]" : "text-[#a09282]"
          )}>
            {value ? format(value, "MMM d, yyyy") : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}

const LUGGAGE_LABELS: Record<string, string> = {
  "carry-on": "Carry-on",
  "backpack": "Backpack",
  "medium-suitcase": "Medium Suitcase",
  "large-suitcase": "Large Suitcase",
};

const TRIP_TYPES = [
  { value: "leisure", label: "Leisure", emoji: "☀️" },
  { value: "business", label: "Business", emoji: "💼" },
  { value: "adventure", label: "Adventure", emoji: "⛰️" },
] as const;

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

  const showDailyActivities = tripTypes.length > 0 && dates.length > 0;

  return (
    <div className="bg-[#f3f0d6] min-h-screen py-10">
      <div className="max-w-[960px] mx-auto flex flex-col gap-6 px-4">

        {/* Header */}
        <div className="flex flex-col gap-2.5 items-center pb-2">
          <div className="bg-[#3e7050] flex items-center gap-1.5 px-3.5 py-[5px] rounded-full text-white">
            <span className="text-[13px]">✨</span>
            <span className="font-body font-semibold text-[12px]">Smart Packing</span>
          </div>
          <h1 className="font-display font-bold text-[36px] text-[#3a2a1a] leading-tight text-center">
            Plan Your Perfect Trip
          </h1>
          <p className="text-center text-[#7a6e5a] text-[15px] leading-[1.6] max-w-[600px] font-body">
            Get personalized packing lists and daily outfit suggestions based on your itinerary and weather forecast.
          </p>
        </div>

        {/* Onboarding Hint */}
        <OnboardingHint
          title="Multi-destination trips supported"
          description="Add up to 5 destinations with independent dates. Each leg gets its own weather forecast."
          storageKey="multi-dest-hint-seen"
        />

        {/* API Alert */}
        <div className="bg-[#eaf3fb] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[#356d80]">
          <span className="text-[14px] shrink-0">ℹ️</span>
          <p className="text-[12px] font-body leading-[1.5] flex-1">
            Weather forecasts are available up to 14 days ahead. Trips beyond this range will use climate averages.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#f9f6e8] flex flex-col gap-5 p-7 rounded-2xl">

          {/* Card header */}
          <div className="flex items-center gap-2.5 leading-normal">
            <span className="text-[#3e7050] text-[20px]">🗺️</span>
            <h2 className="font-display font-bold text-[20px] text-[#3a2a1a]">Trip Itinerary</h2>
          </div>

          {/* Divider */}
          <div className="bg-[#c9c1a8] h-px" />

          {/* Trip Legs */}
          <div className="flex flex-col gap-4">
            {legs.map((leg, index) => (
              <div key={index} className="bg-[#f3f0d6] flex flex-col gap-3 px-5 py-4 rounded-xl">
                {/* Leg header */}
                <div className="flex items-center gap-2.5">
                  <div className="bg-[#3e7050] flex items-center justify-center rounded-full size-7 shrink-0">
                    <span className="font-body font-bold text-[13px] text-white">{index + 1}</span>
                  </div>
                  <span className="font-body font-semibold text-[14px] text-[#3a2a1a] flex-1">
                    {leg.destination || `Destination ${index + 1}`}
                  </span>
                  {legs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLeg(index)}
                      className="text-[#a09282] hover:text-destructive transition-colors p-1 shrink-0"
                      aria-label="Remove destination"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Destination input */}
                <DestinationInput
                  value={leg.destination}
                  onChange={(val) => updateLeg(index, { destination: val })}
                  index={index}
                />

                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-semibold text-[#7a6e5a] text-[12px]">
                      Start Date
                    </label>
                    <DatePicker
                      value={leg.startDate}
                      onChange={(date) => updateLeg(index, { startDate: date })}
                      disabled={(date) => {
                        const t = new Date(new Date().setHours(0, 0, 0, 0));
                        if (date < t || date > MAX_WEATHER_DATE) return true;
                        if (index > 0 && legs[index - 1].endDate) {
                          if (date < legs[index - 1].endDate!) return true;
                        }
                        return false;
                      }}
                      placeholder="Select date"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body font-semibold text-[#7a6e5a] text-[12px]">
                      End Date
                    </label>
                    <DatePicker
                      value={leg.endDate}
                      onChange={(date) => updateLeg(index, { endDate: date })}
                      disabled={(date) => {
                        const t = new Date(new Date().setHours(0, 0, 0, 0));
                        if (date < t || date > MAX_WEATHER_DATE) return true;
                        if (leg.startDate && date < leg.startDate) return true;
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
                      placeholder="Select date"
                    />
                  </div>
                </div>

                {/* Days pill */}
                {leg.startDate && leg.endDate && (
                  <div className="flex items-center gap-1.5 bg-[#f0e2bb] px-2.5 py-1 rounded-full w-fit text-[#7a6e5a]">
                    <span className="text-[13px]">⌛️</span>
                    <span className="font-body font-semibold text-[12px]">
                      {differenceInDays(leg.endDate, leg.startDate) + 1} day{differenceInDays(leg.endDate, leg.startDate) + 1 !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Destination Button */}
          {legs.length < 5 && (
            <button
              type="button"
              onClick={addLeg}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#3e7050] hover:bg-[#3e7050]/5 transition-colors w-fit"
            >
              <span className="text-[16px]">➕</span>
              <span className="font-body font-semibold text-[13px]">Add Another Destination</span>
            </button>
          )}

          {/* Date warnings */}
          {dateWarnings.length > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-destructive font-body">
                {dateWarnings.map((w, i) => <p key={i}>{w}</p>)}
              </div>
            </div>
          )}

          {/* Total duration */}
          {totalDays > 0 && (
            <div className={cn(
              "flex items-center justify-between rounded-lg px-3.5 py-2.5",
              totalDays > MAX_TRIP_DAYS
                ? "bg-destructive/10 border border-destructive/20"
                : "bg-[#f0e2bb]/60"
            )}>
              <span className="text-[13px] text-[#7a6e5a] font-body">
                Total: <span className="font-semibold text-[#3a2a1a]">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                {legs.length > 1 && ` across ${legs.length} destinations`}
              </span>
              <span className={cn(
                "text-[11px] font-body font-semibold px-2 py-0.5 rounded-full",
                totalDays > MAX_TRIP_DAYS
                  ? "bg-destructive/20 text-destructive"
                  : "bg-[#3e7050]/10 text-[#3e7050]"
              )}>
                {totalDays}/{MAX_TRIP_DAYS}
              </span>
              {totalDays > MAX_TRIP_DAYS && (
                <p className="text-sm text-destructive ml-2 font-body">
                  Reduce to {MAX_TRIP_DAYS} days max
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="bg-[#c9c1a8] h-px" />

          {/* Bottom row: Luggage + Trip Type */}
          <div className="flex gap-5 items-start">

            {/* Luggage Size */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="font-body font-semibold text-[#7a6e5a] text-[13px]">
                Luggage Size
              </label>
              <Select onValueChange={setLuggageSize} value={luggageSize}>
                <SelectTrigger className="h-[42px] bg-[#f3f0d6] border-0 rounded-lg text-[14px] text-[#3a2a1a] font-body focus:ring-[#3e7050]">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {luggageSize && (
                      <span className="text-[15px] text-[#3e7050] shrink-0">🧳</span>
                    )}
                    <SelectValue placeholder="Select luggage size" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carry-on">Carry-on</SelectItem>
                  <SelectItem value="backpack">Backpack</SelectItem>
                  <SelectItem value="medium-suitcase">Medium Suitcase</SelectItem>
                  <SelectItem value="large-suitcase">Large Suitcase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trip Type */}
            <div className="flex flex-1 flex-col gap-2.5">
              <label className="font-body font-semibold text-[#7a6e5a] text-[13px]">
                Trip Type
              </label>
              <div className="flex gap-2.5 items-center flex-wrap">
                {TRIP_TYPES.map(({ value, label, emoji }) => {
                  const selected = tripTypes.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTripTypes(prev =>
                        prev.includes(value)
                          ? prev.filter(t => t !== value)
                          : [...prev, value]
                      )}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-body font-semibold text-[13px] transition-colors",
                        selected
                          ? "bg-[#3e7050] text-white"
                          : "bg-[#f3f0d6] text-[#7a6e5a] hover:bg-[#e8e0c5]"
                      )}
                    >
                      {selected && <span className="text-[12px]">{emoji}</span>}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Activities Section */}
          {showDailyActivities && (
            <>
              <div className="bg-[#c9c1a8] h-px" />
              <DailyActivityInput
                dates={dates}
                tripTypes={tripTypes}
                onActivitiesChange={handleActivitiesChange}
                datesWithDestinations={datesWithDestinations}
              />
            </>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !isValid}
            className={cn(
              "flex items-center justify-center gap-2.5 h-[52px] rounded-xl text-white w-full font-body font-bold text-[16px] transition-all duration-200",
              isValid && !isSubmitting
                ? "bg-[#3e7050] hover:bg-[#356141] cursor-pointer"
                : "bg-[#3e7050]/50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating your personalized packing list…</span>
              </>
            ) : (
              <>
                <span className="text-[18px]">🧳</span>
                <span>Generate Packing List</span>
              </>
            )}
          </button>

          {!isValid && totalDays > 0 && (
            <p className="text-center text-[13px] text-[#a09282] font-body -mt-2">
              Please complete all fields above to generate your packing list
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
