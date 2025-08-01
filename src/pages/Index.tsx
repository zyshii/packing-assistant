import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripHeader from "@/components/TripHeader";
import OnboardingHint from "@/components/OnboardingHint";
import DailyClothingSuggestions from "@/components/DailyClothingSuggestions";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addDays, differenceInDays } from "date-fns";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state or use sample data
  const { tripData, dailyActivities } = location.state || {};
  
  // Sample trip data (fallback)
  const defaultTripData = {
    destination: "Paris, France",
    dates: "May 30 - Jun 1",
    tripType: "leisure",
    travelers: 1,
    activities: ["Sightseeing", "Museums", "Dining", "Photography"]
  };

  // Generate trip data with proper types handling
  const finalTripData = useMemo(() => {
    if (tripData) {
      return {
        ...defaultTripData,
        destination: tripData.destination,
        dates: tripData.startDate && tripData.endDate 
          ? `${tripData.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${tripData.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
          : defaultTripData.dates,
        tripTypes: tripData.tripTypes || [defaultTripData.tripType],
        luggageSize: tripData.luggageSize,
      };
    }
    return defaultTripData;
  }, [tripData]);

  // Generate daily clothing data based on actual travel dates
  const generateDailyClothingData = useMemo(() => {
    if (!tripData?.startDate || !tripData?.endDate) {
      // Fallback data for demo purposes
      return [
        { date: "May 30", condition: 'sunny' as const, temp: { high: 74, low: 60 }, timeOfDay: [], activities: [] },
        { date: "May 31", condition: 'mixed' as const, temp: { high: 70, low: 58 }, timeOfDay: [], activities: [] },
        { date: "Jun 1", condition: 'rainy' as const, temp: { high: 68, low: 55 }, timeOfDay: [], activities: [] },
      ];
    }

    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const numberOfDays = differenceInDays(endDate, startDate) + 1;
    
    // Generate realistic weather conditions and temperatures
    const weatherConditions = ['sunny', 'cloudy', 'mixed', 'rainy'] as const;
    const baseTemp = getSeasonalTemperature(startDate, tripData.destination);
    
    return Array.from({ length: numberOfDays }, (_, index) => {
      const currentDate = addDays(startDate, index);
      const dateString = format(currentDate, 'MMM d');
      
      // Generate varied but realistic weather
      const condition = getWeatherCondition(index, tripData.destination);
      const tempVariation = (Math.random() - 0.5) * 10; // ±5 degrees variation
      
      return {
        date: dateString,
        condition,
        temp: {
          high: Math.round(baseTemp.high + tempVariation),
          low: Math.round(baseTemp.low + tempVariation)
        },
        timeOfDay: [],
        activities: []
      };
    });
  }, [tripData]);

  // Helper function to get seasonal temperature based on date and destination
  const getSeasonalTemperature = (date: Date, destination?: string) => {
    const month = date.getMonth(); // 0-11
    const isNorthernHemisphere = !destination?.toLowerCase().includes('australia') && 
                                  !destination?.toLowerCase().includes('south africa') &&
                                  !destination?.toLowerCase().includes('argentina') &&
                                  !destination?.toLowerCase().includes('chile');
    
    // Adjust for hemisphere
    const adjustedMonth = isNorthernHemisphere ? month : (month + 6) % 12;
    
    // Temperature ranges by season (Fahrenheit)
    if (adjustedMonth >= 11 || adjustedMonth <= 1) { // Winter
      return { high: 45, low: 32 };
    } else if (adjustedMonth >= 2 && adjustedMonth <= 4) { // Spring
      return { high: 65, low: 50 };
    } else if (adjustedMonth >= 5 && adjustedMonth <= 7) { // Summer
      return { high: 80, low: 65 };
    } else { // Fall
      return { high: 70, low: 55 };
    }
  };

  // Helper function to generate varied weather conditions
  const getWeatherCondition = (dayIndex: number, destination?: string) => {
    const conditions = ['sunny', 'cloudy', 'mixed', 'rainy'] as const;
    
    // Create some pattern but with variation
    const baseIndex = dayIndex % conditions.length;
    const random = Math.random();
    
    // Add some randomness but favor certain patterns
    if (random < 0.4) return conditions[baseIndex];
    if (random < 0.7) return 'sunny';
    if (random < 0.9) return 'mixed';
    return 'cloudy';
  };

  // Daily clothing data state
  const [dailyClothingData, setDailyClothingData] = useState(() => generateDailyClothingData);

  // Update clothing data when trip data changes
  useEffect(() => {
    setDailyClothingData(generateDailyClothingData);
  }, [generateDailyClothingData]);

  // Update clothing data with activities from navigation state
  useEffect(() => {
    if (dailyActivities && Array.isArray(dailyActivities)) {
      setDailyClothingData(prevData => {
        return prevData.map(day => {
          const dayActivities = dailyActivities.find(a => a.date === day.date);
          return {
            ...day,
            activities: dayActivities ? dayActivities.activities : []
          };
        });
      });
    }
  }, [dailyActivities]);

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
            destination={finalTripData.destination}
            dates={finalTripData.dates}
            tripType={
              'tripTypes' in finalTripData && Array.isArray(finalTripData.tripTypes) 
                ? finalTripData.tripTypes[0] 
                : finalTripData.tripType
            }
            activities={finalTripData.activities}
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