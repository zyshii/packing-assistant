import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripHeader from "@/components/TripHeader";
import WeatherInfo from "@/components/WeatherInfo";
import OnboardingHint from "@/components/OnboardingHint";

import DailyClothingSuggestions from "@/components/DailyClothingSuggestions";
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

  const weatherData = {
    destination: tripData.destination,
    forecast: {
      condition: 'mixed' as const,
      temp: { high: 72, low: 58 },
      humidity: 65
    }
  };

  // Daily weather forecasts
  const dailyForecasts = [
    { date: "May 30", condition: 'sunny' as const, temp: { high: 74, low: 60 }, humidity: 60 },
    { date: "May 31", condition: 'mixed' as const, temp: { high: 70, low: 58 }, humidity: 70 },
    { date: "Jun 1", condition: 'rainy' as const, temp: { high: 68, low: 55 }, humidity: 80 },
  ];

  // Daily clothing data for the new component
  const dailyClothingData = dailyForecasts.map(forecast => ({
    date: forecast.date,
    condition: forecast.condition,
    temp: forecast.temp,
    timeOfDay: [] // This will be populated by the component based on weather conditions
  }));

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
          
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-success rounded-full text-white text-sm font-medium shadow-floating">
            <CheckCircle className="w-4 h-4" />
            AI Suggestions Ready
          </div>
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
            travelers={tripData.travelers}
            activities={tripData.activities}
          />
        </div>

        {/* Weather Info */}
        <div className="animate-slide-in">
          <WeatherInfo 
            destination={weatherData.destination}
            forecast={weatherData.forecast}
          />
        </div>


        {/* Daily Clothing Suggestions */}
        <div className="animate-scale-in">
          <DailyClothingSuggestions dailyData={dailyClothingData} />
        </div>

        {/* AI Tips */}
        <div className="p-6 lg:p-8 bg-gradient-to-r from-travel-purple/10 to-travel-blue/10 rounded-xl border border-travel-purple/20 shadow-soft animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-floating">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Smart Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-purple rounded-full mt-2 flex-shrink-0"></div>
                  <p>Pack layers for variable weather in Paris</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-blue rounded-full mt-2 flex-shrink-0"></div>
                  <p>Comfortable walking shoes are essential for sightseeing</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-green rounded-full mt-2 flex-shrink-0"></div>
                  <p>Don't forget your camera for those memorable museum visits</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p>A light rain jacket will keep you prepared</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;