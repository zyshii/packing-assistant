import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, MapPin, Clock, Users, Activity, Sparkles, ArrowRight, Globe } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import HelpTooltip from "@/components/HelpTooltip";
import OnboardingHint from "@/components/OnboardingHint";

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
  tripType: z.enum(["business", "leisure", "adventure"], {
    required_error: "Please select a trip type.",
  }),
  activities: z.string().optional(),
  travelers: z.number().min(1, {
    message: "At least 1 traveler is required.",
  }).max(20, {
    message: "Maximum 20 travelers allowed.",
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

export default function TripDetails() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      activities: "",
      travelers: 1,
    },
  });

  const watchedDestination = form.watch("destination");
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(values);
    setIsSubmitting(false);
    navigate("/packing-list");
  }

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
                          <HelpTooltip content="Enter the city, country, or specific location you're traveling to. This helps us provide weather-specific recommendations." />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="e.g., Paris, France or Tokyo, Japan" 
                              {...field}
                              className="pl-10 h-12 text-base"
                            />
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
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

                  {/* Dates and Travelers */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-semibold">
                            <Clock className="h-5 w-5 text-primary" />
                            Start Date
                            <HelpTooltip content="When does your trip begin? This helps us plan for seasonal weather patterns." />
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
                            <HelpTooltip content="When does your trip end? Trip duration affects the quantity of items we'll suggest." />
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

                    <FormField
                      control={form.control}
                      name="travelers"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-semibold">
                            <Users className="h-5 w-5 text-primary" />
                            Travelers
                            <HelpTooltip content="How many people are traveling? This affects our quantity recommendations." />
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                min="1"
                                max="20"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className="pl-10 h-12 text-base"
                              />
                              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
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
                          Trip Type
                          <HelpTooltip content="This helps us suggest appropriate clothing and accessories for your trip's purpose." />
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

                  {/* Activities */}
                  <FormField
                    control={form.control}
                    name="activities"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                          <Activity className="h-5 w-5 text-primary" />
                          Planned Activities (Optional)
                          <HelpTooltip content="Describe what you plan to do - this helps us suggest activity-specific items like hiking gear, formal wear, or beach essentials." />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Hiking in national parks, business meetings, beach activities, city sightseeing, restaurant dining..."
                            className="resize-none min-h-[100px] text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          💡 The more details you provide, the better our AI recommendations will be!
                        </p>
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
}