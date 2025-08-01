import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, MapPin, Clock, Users, Activity, Sparkles, ArrowRight, Globe, Luggage } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import HelpTooltip from "@/components/HelpTooltip";
import OnboardingHint from "@/components/OnboardingHint";
import DailyActivityInput from "@/components/DailyActivityInput";

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
  tripType: z.enum(["business", "leisure", "adventure"]).optional(),
  luggageSize: z.enum(["carry-on", "backpack", "medium-suitcase", "large-suitcase"]).optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

const popularDestinations = [
  "New York, USA",
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
  "Hawaii, USA",
  "Las Vegas, USA",
  "Los Angeles, USA",
  "San Francisco, USA",
  "Miami, USA",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada"
];

function TripDetails() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [dailyActivities, setDailyActivities] = useState<Array<{ date: string; activities: string[] }>>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
    },
  });

  const watchedDestination = form.watch("destination");
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");
  const watchedTripType = form.watch("tripType");

  // Generate dates array when start and end dates are available
  const dates = useMemo(() => {
    if (!watchedStartDate || !watchedEndDate) return [];
    const dateArray = [];
    const currentDate = new Date(watchedStartDate);
    const endDate = new Date(watchedEndDate);
    
    while (currentDate <= endDate) {
      dateArray.push(format(currentDate, "MMM d"));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }, [watchedStartDate, watchedEndDate]);

  const handleActivitiesChange = (activities: Array<{ date: string; activities: string[] }>) => {
    setDailyActivities(activities);
  };

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Pass the data including daily activities to the packing list page
    console.log({ ...values, dailyActivities });
    setIsSubmitting(false);
    navigate("/packing-list", { state: { tripData: values, dailyActivities } });
  }

  const filteredDestinations = useMemo(() => {
    if (!watchedDestination) return [];
    return popularDestinations.filter(destination =>
      destination.toLowerCase().includes(watchedDestination.toLowerCase())
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
              AI-Powered Packing Assistant
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-travel-purple bg-clip-text text-transparent">
              Plan Your Perfect Trip
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us about your journey and our AI will create a personalized packing list based on your destination, weather, and activities
            </p>
          </div>

          {/* Onboarding Hint */}
          <OnboardingHint
            title="First time using PackPal?"
            description="We'll guide you through creating your first AI-powered packing list. Just fill out your trip details and let our smart recommendations do the rest!"
            storageKey="trip-details-hint-seen"
            className="animate-scale-in"
          />

          {/* Main Form Card */}
          <Card className="shadow-card border-0 animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Globe className="h-6 w-6 text-primary" />
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
                          <Popover open={open && filteredDestinations.length > 0} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <Input 
                                  placeholder="Type to search destinations..."
                                  {...field}
                                  className="pl-10 h-12 text-base"
                                  onFocus={() => setOpen(true)}
                                  onBlur={() => setTimeout(() => setOpen(false), 200)}
                                />
                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandList className="max-h-[200px]">
                                  <CommandEmpty>No destinations found.</CommandEmpty>
                                  <CommandGroup>
                                    {filteredDestinations.map((destination) => (
                                      <CommandItem
                                        key={destination}
                                        value={destination}
                                        onSelect={(value) => {
                                          field.onChange(value);
                                          setOpen(false);
                                        }}
                                        className="cursor-pointer"
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
                        {watchedDestination && (
                          <p className="text-sm text-travel-blue animate-fade-in">
                            ✨ Great choice! We'll check the weather and local customs for {watchedDestination}
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
                            <Clock className="h-5 w-5 text-primary" />
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
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-semibold">
                            <Clock className="h-5 w-5 text-primary" />
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
                                  return date < today || (startDate && date < startDate);
                                }}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Trip Duration Indicator */}
                  {watchedStartDate && watchedEndDate && (
                    <div className="bg-muted/50 rounded-lg p-4 animate-fade-in">
                      <p className="text-sm text-muted-foreground">
                        Trip Duration: <span className="font-medium text-foreground">
                          {Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Trip Type */}
                  <FormField
                    control={form.control}
                    name="tripType"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                         <FormLabel className="flex items-center gap-2 text-base font-semibold">
                           <Activity className="h-5 w-5 text-primary" />
                            Trip Type (Optional)
                         </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <div className={cn(
                              "flex items-center space-x-3 p-6 border-2 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer",
                              field.value === "business" && "border-primary bg-primary/5"
                            )}>
                              <RadioGroupItem value="business" id="business" />
                              <div>
                                <label htmlFor="business" className="text-base font-medium cursor-pointer block">
                                  Business
                                </label>
                                <p className="text-sm text-muted-foreground">Meetings & conferences</p>
                              </div>
                            </div>
                            <div className={cn(
                              "flex items-center space-x-3 p-6 border-2 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer",
                              field.value === "leisure" && "border-primary bg-primary/5"
                            )}>
                              <RadioGroupItem value="leisure" id="leisure" />
                              <div>
                                <label htmlFor="leisure" className="text-base font-medium cursor-pointer block">
                                  Leisure
                                </label>
                                <p className="text-sm text-muted-foreground">Vacation & relaxation</p>
                              </div>
                            </div>
                            <div className={cn(
                              "flex items-center space-x-3 p-6 border-2 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer",
                              field.value === "adventure" && "border-primary bg-primary/5"
                            )}>
                              <RadioGroupItem value="adventure" id="adventure" />
                              <div>
                                <label htmlFor="adventure" className="text-base font-medium cursor-pointer block">
                                  Adventure
                                </label>
                                <p className="text-sm text-muted-foreground">Outdoor activities</p>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                   />

                  {/* Luggage Size */}
                  <FormField
                    control={form.control}
                    name="luggageSize"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                         <FormLabel className="flex items-center gap-2 text-base font-semibold">
                           <Luggage className="h-5 w-5 text-primary" />
                            Luggage Size (Optional)
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
                                    <div className="font-medium">Carry-on Bag</div>
                                    <div className="text-sm text-muted-foreground">Small roller bag (22" x 14" x 9")</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="backpack" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🎒</div>
                                  <div>
                                    <div className="font-medium">Backpack</div>
                                    <div className="text-sm text-muted-foreground">Travel backpack (40-60L)</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="medium-suitcase" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🧳</div>
                                  <div>
                                    <div className="font-medium">Medium Suitcase</div>
                                    <div className="text-sm text-muted-foreground">Check-in bag (24-26 inches)</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="large-suitcase" className="cursor-pointer">
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-2xl">🧳</div>
                                  <div>
                                    <div className="font-medium">Large Suitcase</div>
                                    <div className="text-sm text-muted-foreground">Large check-in bag (28+ inches)</div>
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

                  {/* Daily Activities Section */}
                  {dates.length > 0 && (
                    <div className="space-y-4">
                      <DailyActivityInput 
                        dates={dates}
                        tripType={watchedTripType}
                        onActivitiesChange={handleActivitiesChange}
                      />
                    </div>
                  )}

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
                          <span>Generate AI Packing List</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Our AI will analyze your trip details and create a smart packing list in seconds
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