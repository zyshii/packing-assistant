import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Calendar, Plane } from "lucide-react";

const formSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  tripType: z.enum(["business", "leisure", "adventure"], {
    required_error: "Please select a trip type",
  }),
  activities: z.string().min(10, "Please describe your planned activities (at least 10 characters)"),
});

type FormData = z.infer<typeof formSchema>;

export default function TripDetails() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      startDate: "",
      endDate: "",
      tripType: undefined,
      activities: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Trip details:", data);
    setIsSubmitting(false);
    navigate("/packing-list");
  };

  return (
    <div className="min-h-screen bg-gradient-soft p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-elegant">
              <Plane className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Smart Travel Packing</h1>
          <p className="text-primary/70">Tell us about your trip and we'll create the perfect packing list</p>
        </div>

        <Card className="shadow-elegant border-white/20 bg-white/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Trip Details</CardTitle>
            <CardDescription>
              Share your travel plans so we can suggest the best items to pack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Destination */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Destination
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Where are you traveling to?" 
                          className="bg-white/60 border-white/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Travel Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-white/60 border-white/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-white/60 border-white/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trip Type */}
                <FormField
                  control={form.control}
                  name="tripType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/40 border border-white/30">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business" className="flex-1 cursor-pointer">
                              <div className="font-medium">Business</div>
                              <div className="text-sm text-muted-foreground">
                                Professional meetings, conferences, corporate events
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/40 border border-white/30">
                            <RadioGroupItem value="leisure" id="leisure" />
                            <Label htmlFor="leisure" className="flex-1 cursor-pointer">
                              <div className="font-medium">Leisure</div>
                              <div className="text-sm text-muted-foreground">
                                Vacation, sightseeing, relaxation, family time
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/40 border border-white/30">
                            <RadioGroupItem value="adventure" id="adventure" />
                            <Label htmlFor="adventure" className="flex-1 cursor-pointer">
                              <div className="font-medium">Adventure</div>
                              <div className="text-sm text-muted-foreground">
                                Hiking, camping, sports, outdoor activities
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Planned Activities */}
                <FormField
                  control={form.control}
                  name="activities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planned Activities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you plan to do during your trip (e.g., beach days, hiking, dining out, museum visits, business meetings...)"
                          className="bg-white/60 border-white/30 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary text-white shadow-glow hover:shadow-glow-intense transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating your packing list..." : "Generate Packing List"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}