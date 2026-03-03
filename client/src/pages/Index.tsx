import { useMemo } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
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
    const rawTripData = JSON.parse(localStorage.getItem("tripData") || "null");
    // Parse YYYY-MM-DD as local dates (avoid UTC offset issues)
    const parseLocalDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    };
    const parsedTripData = rawTripData
      ? {
          ...rawTripData,
          startDate: rawTripData.startDate
            ? parseLocalDate(rawTripData.startDate)
            : null,
          endDate: rawTripData.endDate
            ? parseLocalDate(rawTripData.endDate)
            : null,
        }
      : null;
    const parsedDailyActivities = JSON.parse(
      localStorage.getItem("dailyActivities") || "null"
    );

    // Extract legs: either from explicit legs array or build a single leg from legacy data
    let legs: Array<{ destination: string; startDate: string; endDate: string }> = [];
    if (rawTripData?.legs && Array.isArray(rawTripData.legs)) {
      legs = rawTripData.legs;
    } else if (
      parsedTripData?.destination &&
      parsedTripData?.startDate &&
      parsedTripData?.endDate
    ) {
      legs = [
        {
          destination: parsedTripData.destination,
          startDate: formatDateForApi(parsedTripData.startDate),
          endDate: formatDateForApi(parsedTripData.endDate),
        },
      ];
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

    const destination =
      tripData.destination || tripLegs.map((l: any) => l.destination).join(" → ");
    const dates =
      tripData.startDate && tripData.endDate
        ? `${format(tripData.startDate, "MMM d")} – ${format(tripData.endDate, "MMM d")}`
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
    return tripLegs.map((leg: any) => {
      const [sy, sm, sd] = leg.startDate.split("-").map(Number);
      const [ey, em, ed] = leg.endDate.split("-").map(Number);
      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      return {
        destination: leg.destination,
        dates: `${format(start, "MMM d")}–${format(end, "MMM d")}`,
      };
    });
  }, [tripLegs]);

  // Fetch weather for each leg separately
  const weatherQueries = tripLegs.map((leg: any, index: number) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["/api/weather", leg.destination, leg.startDate, leg.endDate],
      queryFn: () =>
        fetchWeatherForecast(leg.destination, leg.startDate, leg.endDate),
      enabled: !!leg.destination && !!leg.startDate && !!leg.endDate,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          error instanceof WeatherApiError &&
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    })
  );

  const isLoadingWeather = weatherQueries.some((q: any) => q.isLoading);
  const weatherErrors = weatherQueries
    .map((q: any, i: number) => (q.error ? { leg: tripLegs[i], error: q.error } : null))
    .filter(Boolean);
  const allWeatherLoaded = weatherQueries.every((q: any) => !q.isLoading);

  // Merge all weather data into a single chronological daily array
  const dailyClothingData = useMemo(() => {
    if (!allWeatherLoaded && tripLegs.length > 0) return [];

    const allDays: Array<{
      date: string;
      destination: string;
      legIndex: number;
      condition: "sunny" | "cloudy" | "mixed" | "rainy" | "snowy";
      temp: { high: number; low: number };
      uvIndex: number;
      precipitation: number;
      activities: string[];
    }> = [];

    weatherQueries.forEach((query: any, legIndex: number) => {
      const leg = tripLegs[legIndex];
      if (query.data?.daily) {
        query.data.daily.forEach((day: any) => {
          const [year, month, dayOfMonth] = day.date.split("-").map(Number);
          const localDate = new Date(year, month - 1, dayOfMonth);
          allDays.push({
            date: format(localDate, "MMM d"),
            destination: leg.destination,
            legIndex,
            condition: day.condition as "sunny" | "cloudy" | "mixed" | "rainy" | "snowy",
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

    // Sort chronologically
    allDays.sort((a, b) => {
      const dateA = new Date(a.date + ", 2025");
      const dateB = new Date(b.date + ", 2025");
      return dateA.getTime() - dateB.getTime();
    });

    // Merge with daily activities
    if (dailyActivities && Array.isArray(dailyActivities)) {
      return allDays.map((day) => {
        const dayActivities = dailyActivities.find(
          (a: any) => a.date === day.date
        );
        return {
          ...day,
          activities: dayActivities ? dayActivities.activities : [],
        };
      });
    }

    return allDays;
  }, [weatherQueries.map((q: any) => q.data), allWeatherLoaded, tripLegs, dailyActivities]);

  // Extract all unique activities for the header
  const allUserActivities = useMemo(() => {
    if (!dailyActivities || !Array.isArray(dailyActivities)) {
      return [];
    }
    const all = dailyActivities.flatMap((day: any) => day.activities || []);
    return Array.from(new Set(all));
  }, [dailyActivities]);

  return (
    <div className="bg-[#f3f0d6] min-h-screen py-8">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-7 px-6">

        {/* Back button */}
        <div>
          <button
            onClick={() => setLocation("/")}
            className="bg-[#f9f6e8] flex items-center gap-1.5 px-[14px] py-2 rounded-[8px] text-[#7a6e5a] hover:bg-[#f0ead5] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-body font-semibold text-[13px]">
              Back to Trip Details
            </span>
          </button>
        </div>

        {/* Trip Header */}
        <TripHeader
          destination={tripMeta.destination}
          dates={tripMeta.dates}
          tripTypes={tripMeta.tripTypes}
          activities={allUserActivities}
          legs={headerLegs.length > 1 ? headerLegs : undefined}
          totalDays={dailyClothingData.length || undefined}
        />

        {/* Weather Error Alerts */}
        {weatherErrors.length > 0 && (
          <div className="flex flex-col gap-2">
            {weatherErrors.map((err: any, i: number) => (
              <div
                key={i}
                className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <span className="font-body text-[13px] text-foreground flex-1">
                  Unable to fetch weather for {err.leg.destination}:{" "}
                  {err.error instanceof WeatherApiError
                    ? err.error.message
                    : "Network error"}
                </span>
                <button
                  onClick={() => weatherQueries[i]?.refetch()}
                  className="font-body font-semibold text-[13px] text-[#3e7050] hover:underline shrink-0"
                >
                  Retry
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main content */}
        {isLoadingWeather && tripLegs.length > 0 ? (
          <div className="bg-[#f9f6e8] rounded-xl p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#3e7050]/20 border-t-[#3e7050] mx-auto mb-6" />
            <p className="font-body text-[#7a6e5a] text-lg">
              Fetching weather for{" "}
              {tripLegs.length === 1
                ? tripLegs[0].destination
                : `${tripLegs.length} destinations`}
              ...
            </p>
            {tripLegs.length > 1 && (
              <div className="mt-4 flex flex-col gap-1 items-center">
                {tripLegs.map((leg: any, i: number) => (
                  <p key={i} className="font-body text-[13px] text-[#a09282]">
                    {weatherQueries[i]?.isLoading
                      ? "⏳"
                      : weatherQueries[i]?.error
                      ? "❌"
                      : "✅"}{" "}
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
            isWeatherDataReal={
              weatherQueries.some((q: any) => !!q.data) &&
              weatherErrors.length === 0
            }
          />
        ) : (
          <div className="bg-[#f9f6e8] rounded-xl p-12 text-center">
            <p className="font-body text-[#7a6e5a] text-lg">
              Loading trip timeline...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
