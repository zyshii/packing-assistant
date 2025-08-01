import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TripHeader from "@/components/TripHeader";
import DailyClothingSuggestions from "@/components/DailyClothingSuggestions";
import SimpleDailyClothingSuggestions from "@/components/SimpleDailyClothingSuggestions";
import { useLocation } from "wouter";
import { format, addDays, differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherForecast, formatDateForApi, WeatherApiError } from "@/lib/weatherApi";
import { type WeatherForecast } from "@shared/schema";

const Index = () => {
  const [, setLocation] = useLocation();
  
  // Get data from localStorage or use sample data
  const rawTripData = JSON.parse(localStorage.getItem('tripData') || 'null');
  const tripData = rawTripData ? {
    ...rawTripData,
    startDate: rawTripData.startDate ? new Date(rawTripData.startDate) : null,
    endDate: rawTripData.endDate ? new Date(rawTripData.endDate) : null
  } : null;
  const dailyActivities = JSON.parse(localStorage.getItem('dailyActivities') || 'null');
  
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
          ? `${format(tripData.startDate, 'MMM d')} - ${format(tripData.endDate, 'MMM d')}`
          : defaultTripData.dates,
        tripTypes: tripData.tripTypes || [defaultTripData.tripType],
        luggageSize: tripData.luggageSize,
      };
    }
    return defaultTripData;
  }, [tripData]);

  // Weather data query
  const {
    data: weatherData,
    isLoading: isLoadingWeather,
    error: weatherError,
    refetch: refetchWeather
  } = useQuery({
    queryKey: ['/api/weather', finalTripData.destination, tripData?.startDate, tripData?.endDate],
    queryFn: () => {
      if (!tripData?.startDate || !tripData?.endDate) {
        return null;
      }
      
      const startDate = formatDateForApi(tripData.startDate);
      const endDate = formatDateForApi(tripData.endDate);
      
      return fetchWeatherForecast(finalTripData.destination, startDate, endDate);
    },
    enabled: !!tripData?.startDate && !!tripData?.endDate && !!finalTripData.destination,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (400-499)
      if (error instanceof WeatherApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      return failureCount < 2;
    }
  });

  // Single comprehensive data transformation to avoid multiple renders
  const dailyClothingData = useMemo(() => {
    console.log('Generating daily clothing data...', { hasWeatherData: !!weatherData, tripDataExists: !!tripData });
    
    let baseData = [];
    
    // Use weather data if available
    if (weatherData && weatherData.daily) {
      baseData = weatherData.daily.map(day => {
        // Parse date as local timezone to avoid UTC offset issues
        const [year, month, dayOfMonth] = day.date.split('-').map(Number);
        const localDate = new Date(year, month - 1, dayOfMonth);
        return {
          date: format(localDate, 'MMM d'),
          condition: day.condition as 'sunny' | 'cloudy' | 'mixed' | 'rainy' | 'snowy',
          temp: {
            high: day.temperatureHigh,
            low: day.temperatureLow
          },
          uvIndex: day.uvIndex,
          precipitation: day.precipitationSum,
          timeOfDay: [],
          activities: []
        };
      });
    }
    // Fallback data when no real trip data exists
    else if (!tripData?.startDate || !tripData?.endDate) {
      baseData = [
        { date: "May 30", condition: 'sunny' as const, temp: { high: 74, low: 60 }, uvIndex: 7, precipitation: 0, timeOfDay: [], activities: [] },
        { date: "May 31", condition: 'mixed' as const, temp: { high: 70, low: 58 }, uvIndex: 5, precipitation: 0.2, timeOfDay: [], activities: [] },
        { date: "Jun 1", condition: 'rainy' as const, temp: { high: 68, low: 55 }, uvIndex: 3, precipitation: 5.5, timeOfDay: [], activities: [] },
      ];
    }
    // Return empty if loading
    else {
      return [];
    }
    
    // Merge with activities if available
    if (dailyActivities && Array.isArray(dailyActivities) && baseData.length > 0) {
      baseData = baseData.map(day => {
        const dayActivities = dailyActivities.find(a => a.date === day.date);
        return {
          ...day,
          uvIndex: day.uvIndex || 0,
          precipitation: day.precipitation || 0,
          activities: dayActivities ? dayActivities.activities : []
        };
      });
    }
    
    console.log('Final daily clothing data:', baseData.length, 'days');
    return baseData;
  }, [weatherData, tripData?.startDate, tripData?.endDate, dailyActivities]);

  // Extract all unique activities from daily activities for the header
  const allUserActivities = useMemo(() => {
    if (!dailyActivities || !Array.isArray(dailyActivities)) {
      return finalTripData.activities; // fallback to default
    }
    
    const allActivities = dailyActivities.flatMap(day => day.activities || []);
    return Array.from(new Set(allActivities)); // remove duplicates
  }, [dailyActivities, finalTripData.activities]);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-5xl mx-auto p-4 space-y-6 lg:space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trip Details
          </Button>
        </div>

        {/* Trip Header */}
        <div className="animate-fade-in">
          <TripHeader
            destination={finalTripData.destination}
            dates={finalTripData.dates}
            tripTypes={'tripTypes' in finalTripData ? finalTripData.tripTypes : [finalTripData.tripType]}
            activities={allUserActivities}
          />
        </div>

        {/* Weather Error Alert */}
        {weatherError && (
          <div className="animate-fade-in">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Unable to fetch current weather data: {
                    weatherError instanceof WeatherApiError 
                      ? weatherError.message 
                      : 'Network error'
                  }. Using fallback weather estimates.
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchWeather()}
                  className="ml-4"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Daily Clothing Suggestions */}
        <div className="animate-scale-in">
          {isLoadingWeather && tripData?.startDate && tripData?.endDate ? (
            <div className="bg-white/70 dark:bg-gray-900/70 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Fetching real-time weather data for {finalTripData.destination}...
              </p>
            </div>
          ) : dailyClothingData.length > 0 ? (
            <SimpleDailyClothingSuggestions 
              key={`clothing-${dailyClothingData.length}-${dailyClothingData[0]?.date}-${Date.now()}`}
              dailyData={dailyClothingData}
              tripDetails={{
                destination: finalTripData.destination,
                luggageSize: 'luggageSize' in finalTripData ? finalTripData.luggageSize : undefined,
                tripTypes: 'tripTypes' in finalTripData ? finalTripData.tripTypes : [finalTripData.tripType],
                duration: dailyClothingData.length
              }}
              isWeatherDataReal={!!weatherData && !weatherError}
            />
          ) : (
            <div className="bg-white/70 dark:bg-gray-900/70 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Loading clothing suggestions...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Index;