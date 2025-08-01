import { useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripHeader from "@/components/TripHeader";
import OnboardingHint from "@/components/OnboardingHint";
import DailyClothingSuggestions from "@/components/DailyClothingSuggestions";
import DailyActivityInput from "@/components/DailyActivityInput";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  // Sample trip data
  const tripData = {
    destination: "Paris, France",
    dates: "May 30 - Jun 1",
    tripType: "leisure",
    travelers: 1,
    activities: ["Sightseeing", "Museums", "Dining", "Photography"]
  };

  // Daily clothing data for the new component
  const [dailyClothingData, setDailyClothingData] = useState([
    { date: "May 30", condition: 'sunny' as const, temp: { high: 74, low: 60 }, timeOfDay: [], activities: [] },
    { date: "May 31", condition: 'mixed' as const, temp: { high: 70, low: 58 }, timeOfDay: [], activities: [] },
    { date: "Jun 1", condition: 'rainy' as const, temp: { high: 68, low: 55 }, timeOfDay: [], activities: [] },
  ]);

  const dates = ["May 30", "May 31", "Jun 1"];

  const handleActivitiesChange = (activities: Array<{ date: string; activities: string[] }>) => {
    const updatedData = dailyClothingData.map(day => {
      const dayActivities = activities.find(a => a.date === day.date);
      return {
        ...day,
        activities: dayActivities ? dayActivities.activities : []
      };
    });
    setDailyClothingData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-5xl mx-auto p-4 space-y-6 lg:space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trip Details
          </Button>
        </div>

        {/* Onboarding Hint */}
        <OnboardingHint
          title="Your AI-powered clothing suggestions are ready!"
          description="Review the time-specific clothing recommendations for each day of your trip, tailored to weather conditions and activities."
          storageKey="clothing-suggestions-hint-seen"
          className="animate-scale-in"
        />

        {/* Trip Header */}
        <div className="animate-fade-in">
          <TripHeader
            destination={tripData.destination}
            dates={tripData.dates}
            tripType={tripData.tripType}
            activities={tripData.activities}
          />
        </div>

        {/* Daily Activity Input */}
        <div className="animate-scale-in">
          <DailyActivityInput 
            dates={dates}
            onActivitiesChange={handleActivitiesChange}
          />
        </div>

        {/* Daily Clothing Suggestions */}
        <div className="animate-scale-in">
          <DailyClothingSuggestions dailyData={dailyClothingData} />
        </div>

      </div>
    </div>
  );
};

export default Index;