import { useMemo } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TripHeader from "@/components/TripHeader";
import TripTimeline from "@/components/TripTimeline";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherForecast, formatDateForApi, WeatherApiError } from "@/lib/weatherApi";

const Index = () => {
  const [, setLocation] = useLocation();

  // Parse trip data from localStorage (supports both single and multi-destination)
  const [tripData, dailyActivities, tripLegs] = useMemo(() => {
    const rawTripData = JSON.parse(localStorage.getItem('tripData') || 'null');
    // Parse YYYY-MM-DD as local dates (avoid UTC offset issues)
    const parseLocalDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    const parsedTripData = rawTripData ? {
      ...rawTripData,
      startDate: rawTripData.startDate ? parseLocalDate(rawTripData.startDate) : null,
      endDate: rawTripData.endDate ? parseLocalDate(rawTripData.endDate) : null,
    } : null;
    const parsedDailyActivities = JSON.parse(localStorage.getItem('dailyActivities') || 'null');

    // Extract legs: either from explicit legs array or build a single leg from legacy data
    let legs: Array<{ destination: string; startDate: string; endDate: string }> = [];
    if (rawTripData?.legs && Array.isArray(rawTripData.legs)) {
      legs = rawTripData.legs;
    } else if (parsedTripData?.destination && parsedTripData?.startDate && parsedTripData?.endDate) {
      legs = [{
        destination: parsedTripData.destination,
        startDate: formatDateForApi(parsedTripData.startDate),
        endDate: formatDateForApi(parsedTripData.endDate),
      }];
    }

    return [parsedTripData, parsedDailyActivities, legs];
  }, []);

  // Compute trip metadata
  const tripMeta = useMemo(() => {
    if (!tripData) {
      return {
        destination: "Paris, France",
        dates: "May 30 - Jun 1",
        tripTypes: ["leisure"],
        luggageSize: "standard",
      };
    }

    const destination = tripData.destination || tripLegs.map(l => l.destination).join(" → ");
    const dates = tripData.startDate && tripData.endDate
      ? `${format(tripData.startDate, 'MMM d')} - ${format(tripData.endDate, 'MMM d')}`
      : "May 30 - Jun 1";

    return {
      destination,
      dates,
      tripTypes: tripData.tripTypes || ["leisure"],
      luggageSize: tripData.luggageSize || "standard",
    };
  }, [tripData, tripLegs]);

  // Build legs info for TripHeader display
  const headerLegs = useMemo(() => {
    return tripLegs.map(leg => {
      const [sy, sm, sd] = leg.startDate.split('-').map(Number);
      const [ey, em, ed] = leg.endDate.split('-').map(Number);
      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      return {
        destination: leg.destination,
        dates: `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
      };
    });
  }, [tripLegs]);

  // Fetch weather for each leg separately
  const weatherQueries = tripLegs.map((leg, index) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ['/api/weather', leg.destination, leg.startDate, leg.endDate],
      queryFn: () => fetchWeatherForecast(leg.destination, leg.startDate, leg.endDate),
      enabled: !!leg.destination && !!leg.startDate && !!leg.endDate,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof WeatherApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          return false;
        }
        return failureCount < 2;
      },
    })
  );

  const isLoadingWeather = weatherQueries.some(q => q.isLoading);
  const weatherErrors = weatherQueries
    .map((q, i) => q.error ? { leg: tripLegs[i], error: q.error } : null)
    .filter(Boolean);
  const allWeatherLoaded = weatherQueries.every(q => !q.isLoading);

  // Merge all weather data into a single chronological daily array
  const dailyClothingData = useMemo(() => {
    if (!allWeatherLoaded && tripLegs.length > 0) return [];

    const allDays: Array<{
      date: string;
      destination: string;
      legIndex: number;
      condition: 'sunny' | 'cloudy' | 'mixed' | 'rainy' | 'snowy';
      temp: { high: number; low: number };
      uvIndex: number;
      precipitation: number;
      activities: string[];
    }> = [];

    weatherQueries.forEach((query, legIndex) => {
      const leg = tripLegs[legIndex];
      if (query.data?.daily) {
        query.data.daily.forEach(day => {
          const [year, month, dayOfMonth] = day.date.split('-').map(Number);
          const localDate = new Date(year, month - 1, dayOfMonth);
          allDays.push({
            date: format(localDate, 'MMM d'),
            destination: leg.destination,
            legIndex,
            condition: day.condition as 'sunny' | 'cloudy' | 'mixed' | 'rainy' | 'snowy',
            temp: {
              high: day.temperatureHigh,
              low: day.temperatureLow,
            },
            uvIndex: day.uvIndex ?? 0,
            precipitation: day.precipitationSum,
            activities: [],
          });
        });
      }
    });

    // Sort chronologically (dates are already in order per leg, but merge across legs)
    allDays.sort((a, b) => {
      const dateA = new Date(a.date + ', 2025');
      const dateB = new Date(b.date + ', 2025');
      return dateA.getTime() - dateB.getTime();
    });

    // Merge with daily activities
    if (dailyActivities && Array.isArray(dailyActivities)) {
      return allDays.map(day => {
        const dayActivities = dailyActivities.find((a: any) => a.date === day.date);
        return {
          ...day,
          activities: dayActivities ? dayActivities.activities : [],
        };
      });
    }

    return allDays;
  }, [weatherQueries.map(q => q.data), allWeatherLoaded, tripLegs, dailyActivities]);

  // Extract all unique activities for the header
  const allUserActivities = useMemo(() => {
    if (!dailyActivities || !Array.isArray(dailyActivities)) {
      return [];
    }
    const all = dailyActivities.flatMap((day: any) => day.activities || []);
    return Array.from(new Set(all));
  }, [dailyActivities]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-8 lg:space-y-10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-warm-gray hover:text-primary hover:bg-accent transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Trip Details</span>
          </Button>
        </div>

        {/* Trip Header */}
        <div className="animate-fade-in">
          <TripHeader
            destination={tripMeta.destination}
            dates={tripMeta.dates}
            tripTypes={tripMeta.tripTypes}
            activities={allUserActivities}
            legs={headerLegs.length > 1 ? headerLegs : undefined}
          />
        </div>

        {/* Weather Error Alerts */}
        {weatherErrors.length > 0 && (
          <div className="animate-fade-in space-y-2">
            {weatherErrors.map((err, i) => (
              <Alert key={i} variant="destructive" className="border border-destructive/30 bg-destructive/5">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="flex items-center justify-between text-foreground">
                  <span>
                    Unable to fetch weather for {err!.leg.destination}:{" "}
                    {err!.error instanceof WeatherApiError ? err!.error.message : 'Network error'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => weatherQueries[i]?.refetch()}
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Timeline Content */}
        <div className="animate-scale-in">
          {isLoadingWeather && tripLegs.length > 0 ? (
            <div className="bg-card rounded-xl p-12 text-center shadow-card border border-border">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary/20 border-t-primary mx-auto mb-6"></div>
              <p className="text-warm-gray text-lg font-medium">
                Fetching weather data for {tripLegs.length === 1
                  ? tripLegs[0].destination
                  : `${tripLegs.length} destinations`
                }...
              </p>
              {tripLegs.length > 1 && (
                <div className="mt-4 space-y-1">
                  {tripLegs.map((leg, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {weatherQueries[i]?.isLoading ? "⏳" : weatherQueries[i]?.error ? "❌" : "✅"}{" "}
                      {leg.destination}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : dailyClothingData.length > 0 ? (
            <TripTimeline
              key={`timeline-${dailyClothingData.length}-${dailyClothingData[0]?.date}`}
              dailyData={dailyClothingData}
              tripDetails={{
                destination: tripMeta.destination,
                luggageSize: tripMeta.luggageSize,
                tripTypes: tripMeta.tripTypes,
                duration: dailyClothingData.length,
                destinations: tripLegs.length > 1 ? tripLegs : undefined,
              }}
              isWeatherDataReal={weatherQueries.some(q => !!q.data) && weatherErrors.length === 0}
            />
          ) : (
            <div className="bg-card rounded-xl p-12 text-center shadow-card border border-border">
              <p className="text-warm-gray text-lg font-medium">Loading trip timeline...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
