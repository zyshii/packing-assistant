import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, MapPin, Clock, Users, Activity, Sparkles, ArrowRight, Plane, Luggage } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import OnboardingHint from "@/components/OnboardingHint";
import DailyActivityInput from "@/components/DailyActivityInput";

// Weather API date constraints
const MAX_WEATHER_DATE = new Date('2025-08-16'); // Open-Meteo API limit
const MAX_TRIP_DAYS = 14; // Maximum trip length for weather forecasts

const formSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  tripTypes: z.array(z.enum(["business", "leisure", "adventure"])).min(1, {
    message: "Please select at least one trip type.",
  }),
  luggageSize: z.enum(["carry-on", "backpack", "medium-suitcase", "large-suitcase"], {
    required_error: "Please select your luggage size.",
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
}).refine((data) => data.endDate <= MAX_WEATHER_DATE, {
  message: `Weather forecasts are only available until ${MAX_WEATHER_DATE.toISOString().split('T')[0]}`,
  path: ["endDate"],
}).refine((data) => {
  const daysDiff = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= MAX_TRIP_DAYS;
}, {
  message: `Trip length cannot exceed ${MAX_TRIP_DAYS} days`,
  path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

const popularDestinations = [
  // Major US Cities with States
  "New York, NY, USA",
  "Los Angeles, CA, USA",
  "Chicago, IL, USA",
  "Houston, TX, USA",
  "Phoenix, AZ, USA",
  "Philadelphia, PA, USA",
  "San Antonio, TX, USA",
  "San Diego, CA, USA",
  "Dallas, TX, USA",
  "San Jose, CA, USA",
  "Austin, TX, USA",
  "Jacksonville, FL, USA",
  "Fort Worth, TX, USA",
  "Columbus, OH, USA",
  "Charlotte, NC, USA",
  "San Francisco, CA, USA",
  "Indianapolis, IN, USA",
  "Seattle, WA, USA",
  "Denver, CO, USA",
  "Boston, MA, USA",
  "Nashville, TN, USA",
  "Baltimore, MD, USA",
  "Oklahoma City, OK, USA",
  "Portland, OR, USA",
  "Las Vegas, NV, USA",
  "Louisville, KY, USA",
  "Milwaukee, WI, USA",
  "Albuquerque, NM, USA",
  "Tucson, AZ, USA",
  "Fresno, CA, USA",
  "Mesa, AZ, USA",
  "Sacramento, CA, USA",
  "Atlanta, GA, USA",
  "Kansas City, MO, USA",
  "Colorado Springs, CO, USA",
  "Miami, FL, USA",
  "Raleigh, NC, USA",
  "Omaha, NE, USA",
  "Long Beach, CA, USA",
  "Virginia Beach, VA, USA",
  "Oakland, CA, USA",
  "Minneapolis, MN, USA",
  "Tampa, FL, USA",
  "Tulsa, OK, USA",
  "Arlington, TX, USA",
  "New Orleans, LA, USA",
  "Wichita, KS, USA",
  "Cleveland, OH, USA",
  "Bakersfield, CA, USA",
  "Aurora, CO, USA",
  "Anaheim, CA, USA",
  "Honolulu, HI, USA",
  "Santa Ana, CA, USA",
  "Riverside, CA, USA",
  "Corpus Christi, TX, USA",
  "Lexington, KY, USA",
  "Stockton, CA, USA",
  "Henderson, NV, USA",
  "Saint Paul, MN, USA",
  "St. Louis, MO, USA",
  "Cincinnati, OH, USA",
  "Pittsburgh, PA, USA",
  "Greensboro, NC, USA",
  "Anchorage, AK, USA",
  "Plano, TX, USA",
  "Lincoln, NE, USA",
  "Orlando, FL, USA",
  "Irvine, CA, USA",
  "Newark, NJ, USA",
  "Durham, NC, USA",
  "Chula Vista, CA, USA",
  "Toledo, OH, USA",
  "Fort Wayne, IN, USA",
  "St. Petersburg, FL, USA",
  "Laredo, TX, USA",
  "Jersey City, NJ, USA",
  "Chandler, AZ, USA",
  "Madison, WI, USA",
  "Lubbock, TX, USA",
  "Scottsdale, AZ, USA",
  "Reno, NV, USA",
  "Buffalo, NY, USA",
  "Gilbert, AZ, USA",
  "Glendale, AZ, USA",
  "North Las Vegas, NV, USA",
  "Winston-Salem, NC, USA",
  "Chesapeake, VA, USA",
  "Norfolk, VA, USA",
  "Fremont, CA, USA",
  "Garland, TX, USA",
  "Irving, TX, USA",
  "Hialeah, FL, USA",
  "Richmond, VA, USA",
  "Boise, ID, USA",
  "Spokane, WA, USA",
  "Hawaii, HI, USA",
  "Key West, FL, USA",
  "Napa Valley, CA, USA",
  "Yellowstone, WY, USA",
  "Grand Canyon, AZ, USA",
  "Washington DC, USA",
  
  // International destinations
  "Paris, France", 
  "Tokyo, Japan",
  "London, England",
  "Rome, Italy",
  "Barcelona, Spain",
  "Amsterdam, Netherlands",
  "Dubai, UAE",
  "Sydney, Australia",
  "Bangkok, Thailand",
  "Singapore",
  "Berlin, Germany",
  "Istanbul, Turkey",
  "Cairo, Egypt",
  "Mumbai, India",
  "Seoul, South Korea",
  "Mexico City, Mexico",
  "Buenos Aires, Argentina",
  "Rio de Janeiro, Brazil",
  "Cape Town, South Africa",
  "Marrakech, Morocco",
  "Reykjavik, Iceland",
  "Stockholm, Sweden",
  "Vienna, Austria",
  "Prague, Czech Republic",
  "Budapest, Hungary",
  "Lisbon, Portugal",
  "Athens, Greece",
  "Zurich, Switzerland",
  "Copenhagen, Denmark",
  "Oslo, Norway",
  "Helsinki, Finland",
  "Warsaw, Poland",
  "Dubrovnik, Croatia",
  "Santorini, Greece",
  "Bali, Indonesia",
  "Phuket, Thailand",
  "Maldives",
  "Fiji",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada"
];

function TripDetails() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [dailyActivities, setDailyActivities] = useState<Array<{ date: string; activities: string[] }>>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      tripTypes: [],
    },
  });

  const watchedDestination = form.watch("destination");
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");
  const watchedTripTypes = form.watch("tripTypes");

  // Generate dates array when start and end dates are available
  const dates = useMemo(() => {
    if (!watchedStartDate || !watchedEndDate) return [];
    const dateArray = [];
    const daysDiff = differenceInDays(watchedEndDate, watchedStartDate);
    
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = addDays(watchedStartDate, i);
      dateArray.push(format(currentDate, "MMM d"));
    }
    return dateArray;
  }, [watchedStartDate, watchedEndDate]);

  const handleActivitiesChange = (activities: Array<{ date: string; activities: string[] }>) => {
    setDailyActivities(activities);
  };

  // Reset daily activities when dates change significantly
  useEffect(() => {
    if (dates.length === 0) {
      setDailyActivities([]);
    }
  }, [dates]);

  async function onSubmit(values: FormData) {
    console.log('Form submitted with values:', values);
    console.log('Form validation errors:', form.formState.errors);
    
    setIsSubmitting(true);
    
    try {
      // Simulate agent processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save data to localStorage for access in the packing list page
      // Convert dates to ISO strings for proper serialization
      const tripDataToSave = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString()
      };
      // Clear any old localStorage data to prevent conflicts and save fresh data
      localStorage.removeItem('tripData');
      localStorage.removeItem('dailyActivities');
      localStorage.setItem('tripData', JSON.stringify(tripDataToSave));
      localStorage.setItem('dailyActivities', JSON.stringify(dailyActivities));
      
      console.log('Data saved successfully, navigating to packing list');
      
      setIsSubmitting(false);
      setLocation("/packing-list");
    } catch (error) {
      console.error('Error in form submission:', error);
      setIsSubmitting(false);
    }
  }

  const filteredDestinations = useMemo(() => {
    if (!watchedDestination || watchedDestination.length < 2) return [];
    return popularDestinations.filter(destination =>
      destination.toLowerCase().includes(watchedDestination.toLowerCase())
    );
  }, [watchedDestination]);

  // Check if current input exactly matches a destination from our list
  const isValidDestination = useMemo(() => {
    return popularDestinations.some(dest => 
      dest.toLowerCase() === watchedDestination?.toLowerCase()
    );
  }, [watchedDestination]);
  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="container mx-auto py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-floating">
              <Sparkles className="w-4 h-4" />
              Packing Assistant
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Plan Your Perfect Trip
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us about your journey and our assistant will create a personalized packing list based on your destination, weather, and activities
            </p>
          </div>

          {/* Onboarding Hint */}
          <OnboardingHint
            title="First time using Packing Assistant?"
            description="We'll guide you through creating your first personalized packing list. Just fill out your trip details and let our travel assistant do the rest!"
            storageKey="trip-details-hint-seen"
            className="animate-scale-in"
          />

          {/* Main Form Card */}
          <Card className="shadow-card border-0 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Plane className="h-6 w-6 text-primary" />
                Trip Details
              </CardTitle>
              <CardDescription className="text-base">
                Help us understand your journey to create the perfect packing list
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Destination */}
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                          <MapPin className="h-5 w-5 text-primary" />
                           Destination
                        </FormLabel>
                        <FormControl>
                          <Popover 
                            open={open && filteredDestinations.length > 0} 
                            onOpenChange={(newOpen) => {
                              // Prevent closing dropdown when clicking in input
                              if (!newOpen && destinationFocused) {
                                return;
                              }
                              setOpen(newOpen);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <Input 
                                  placeholder="Type to search destinations..."
                                  {...field}
                                  className={`pl-10 h-12 text-base transition-all duration-200 ${
                                    destinationFocused || open 
                                      ? 'ring-2 ring-primary ring-offset-2 border-primary' 
                                      : ''
                                  }`}
                                  onFocus={() => {
                                    setDestinationFocused(true);
                                    if (filteredDestinations.length > 0) {
                                      setOpen(true);
                                    }
                                  }}
                                  onBlur={() => {
                                    // Only remove focus state if dropdown is closed and no typing activity
                                    setTimeout(() => {
                                      if (!open) {
                                        setDestinationFocused(false);
                                      }
                                    }, 150);
                                  }}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setDestinationSelected(false);
                                    setDestinationFocused(true);
                                    if (e.target.value.length >= 2) {
                                      setOpen(true);
                                    }
                                  }}
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral" />
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
                                    {watchedDestination && watchedDestination.length < 2 
                                      ? "Type at least 2 characters to search..." 
                                      : "No destinations found."
                                    }
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {filteredDestinations.map((destination) => (
                                      <CommandItem
                                        key={destination}
                                        value={destination}
                                        onSelect={() => {
                                          field.onChange(destination);
                                          setDestinationSelected(true);
                                          setDestinationFocused(false);
                                          setOpen(false);
                                        }}
                                        className="cursor-pointer hover:bg-muted"
                                      >
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {destination}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                        {watchedDestination && isValidDestination && (
                          <p className="text-sm text-success animate-fade-in">
                            ✨ Great choice! We'll check the weather and local customs for {watchedDestination}
                          </p>
                        )}
                        {watchedDestination && !isValidDestination && watchedDestination.length >= 2 && (
                          <p className="text-sm text-muted-foreground animate-fade-in">
                            💡 {filteredDestinations.length > 0 
                              ? "Please select a destination from the suggestions above" 
                              : "No matching destinations found. Try a different search term."
                            }
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Dates */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-semibold">
                            <CalendarIcon className="h-5 w-5 text-success" />
                             Start Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-12",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick start date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const today = new Date(new Date().setHours(0, 0, 0, 0));
                                  return date < today || date > MAX_WEATHER_DATE;
                                }}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            💡 Weather forecasts available until {format(MAX_WEATHER_DATE, "MMM d, yyyy")} (max {MAX_TRIP_DAYS} days)
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-semibold">
                            <CalendarIcon className="h-5 w-5 text-success" />
                             End Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-12",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick end date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const today = new Date(new Date().setHours(0, 0, 0, 0));
                                  const startDate = form.getValues("startDate");
                                  
                                  // Basic date validation
                                  if (date < today || date > MAX_WEATHER_DATE) return true;
                                  if (startDate && date < startDate) return true;
                                  
                                  // Check if trip would exceed maximum length
                                  if (startDate) {
                                    const daysDiff = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                    if (daysDiff > MAX_TRIP_DAYS) return true;
                                  }
                                  
                                  return false;
                                }}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                          {/* Date validation helper text */}
                          {watchedEndDate && watchedEndDate > MAX_WEATHER_DATE && (
                            <p className="text-sm text-destructive animate-fade-in">
                              ⚠️ Weather forecasts are only available until {format(MAX_WEATHER_DATE, "PPP")}. Please select an earlier date.
                            </p>
                          )}
                          {watchedStartDate && watchedEndDate && 
                           Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24)) > MAX_TRIP_DAYS && (
                            <p className="text-sm text-warning animate-fade-in">
                              ⚠️ Trip length cannot exceed {MAX_TRIP_DAYS} days for weather forecasts.
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Trip Duration Indicator with Weather API Status */}
                  {watchedStartDate && watchedEndDate && (
                    <div className={cn(
                      "rounded-lg p-4 animate-fade-in",
                      watchedEndDate > MAX_WEATHER_DATE || 
                      Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24)) > MAX_TRIP_DAYS
                        ? "bg-destructive/10 border border-destructive/20"
                        : "bg-muted/50"
                    )}>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Trip Duration: <span className="font-medium text-foreground">
                            {Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </p>

                        {(watchedEndDate > MAX_WEATHER_DATE || 
                          Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24)) > MAX_TRIP_DAYS) && (
                          <p className="text-sm text-destructive">
                            ❌ Weather forecasts not available - please adjust your dates
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Luggage Size */}
                  <FormField
                    control={form.control}
                    name="luggageSize"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                          <Luggage className="h-5 w-5 text-primary" />
                           Luggage Size
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Choose your luggage size" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border shadow-lg">
                              <SelectItem value="carry-on" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🎒</div>
                                  <div>
                                    <div className="font-medium">Carry-on - 22 inch</div>
                                    <div className="text-sm text-muted-foreground">Compact roller bag, fits overhead compartments</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="backpack" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🎒</div>
                                  <div>
                                    <div className="font-medium">Backpack - 50 L</div>
                                    <div className="text-sm text-muted-foreground">Travel backpack, ideal for adventure trips</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="medium-suitcase" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🧳</div>
                                  <div>
                                    <div className="font-medium">Medium Suitcase - 24 inch</div>
                                    <div className="text-sm text-muted-foreground">Standard check-in size, perfect for week-long trips</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="large-suitcase" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🧳</div>
                                  <div>
                                    <div className="font-medium">Large Suitcase - 28 inch</div>
                                    <div className="text-sm text-muted-foreground">Spacious check-in bag, great for extended travel</div>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        {field.value && (
                          <p className="text-sm text-travel-blue animate-fade-in">
                            ✨ Perfect! We'll adjust clothing quantities to fit your {field.value.replace('-', ' ')}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Trip Types */}
                  <FormField
                    control={form.control}
                    name="tripTypes"
                    render={() => (
                      <FormItem className="space-y-4">
                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                          <Activity className="h-5 w-5 text-primary" />
                           Trip Types
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(["business", "leisure", "adventure"] as const).map((tripType) => (
                              <FormField
                                key={tripType}
                                control={form.control}
                                name="tripTypes"
                                render={({ field }) => (
                                  <FormItem className={cn(
                                    "flex items-center space-x-3 p-6 border-2 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer",
                                    field.value?.includes(tripType) && "border-primary bg-primary/5"
                                  )}>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(tripType)}
                                        onCheckedChange={(checked) => {
                                          const updatedTypes = checked
                                            ? [...(field.value || []), tripType]
                                            : field.value?.filter((value) => value !== tripType) || [];
                                          field.onChange(updatedTypes);
                                        }}
                                      />
                                    </FormControl>
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
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                        {watchedTripTypes && watchedTripTypes.length > 0 && (
                          <p className="text-sm text-travel-blue animate-fade-in">
                            ✨ Great! You've selected {watchedTripTypes.length} trip type{watchedTripTypes.length > 1 ? 's' : ''}. 
                            We'll customize your activity options accordingly.
                          </p>
                        )}
                        
                        {/* Daily Activities Section - Integrated within Trip Types */}
                        {watchedTripTypes && watchedTripTypes.length > 0 && dates.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                            <DailyActivityInput 
                              dates={dates}
                              tripTypes={watchedTripTypes}
                              onActivitiesChange={handleActivitiesChange}
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 h-auto text-base shadow-floating transition-all duration-300 hover:shadow-modal hover:scale-[1.02]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Creating your personalized packing list...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Agent Packing List</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Our agent will analyze your trip details and create a customized packing list in seconds
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;