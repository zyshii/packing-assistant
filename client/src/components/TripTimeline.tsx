import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Shirt, Sun, Moon, Sparkles, AlertCircle, Lightbulb, MapPin,
  Thermometer, Umbrella, Cloud, CloudSun, Snowflake, Plane, ArrowRight,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDailyRecommendations, fetchPackingOptimization } from "@/lib/aiRecommendationApi";
import type { DailyClothingRecommendation, PackingListOptimization } from "@/lib/aiRecommendationApi";
import type { TripContext } from "@shared/schema";
import { cn } from "@/lib/utils";

interface DailyClothingData {
  date: string;
  destination?: string;
  legIndex?: number;
  condition: 'sunny' | 'cloudy' | 'mixed' | 'rainy' | 'snowy';
  temp: { high: number; low: number };
  uvIndex?: number;
  precipitation: number;
  activities: string[];
}

interface TripTimelineProps {
  dailyData: DailyClothingData[];
  tripDetails: {
    destination: string;
    luggageSize?: string;
    tripTypes?: string[];
    duration: number;
    destinations?: Array<{ destination: string; startDate: string; endDate: string }>;
  };
  isWeatherDataReal?: boolean;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny': case 'clear':
      return <Sun className="h-5 w-5 text-amber-500" />;
    case 'rainy': case 'rain':
      return <Umbrella className="h-5 w-5 text-primary" />;
    case 'cloudy': case 'overcast':
      return <Cloud className="h-5 w-5 text-muted-foreground" />;
    case 'mixed': case 'partly cloudy':
      return <CloudSun className="h-5 w-5 text-primary/70" />;
    case 'snowy': case 'snow':
      return <Snowflake className="h-5 w-5 text-primary/50" />;
    default:
      return <Thermometer className="h-5 w-5 text-muted-foreground" />;
  }
};

const legDotColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
];

const legLineColors = [
  "bg-blue-300",
  "bg-emerald-300",
  "bg-amber-300",
  "bg-purple-300",
  "bg-rose-300",
];

const legBadgeColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

const legBorderColors = [
  "border-l-blue-400",
  "border-l-emerald-400",
  "border-l-amber-400",
  "border-l-purple-400",
  "border-l-rose-400",
];

export default function TripTimeline({ dailyData, tripDetails, isWeatherDataReal }: TripTimelineProps) {
  const queryClient = useQueryClient();

  const tripContext: TripContext = useMemo(() => ({
    destination: tripDetails.destination,
    destinations: tripDetails.destinations,
    duration: tripDetails.duration || dailyData.length,
    tripTypes: tripDetails.tripTypes || ["leisure"],
    luggageSize: tripDetails.luggageSize || "standard",
    dailyData: dailyData.map(day => ({
      date: day.date,
      destination: day.destination,
      condition: day.condition,
      temp: day.temp,
      uvIndex: day.uvIndex,
      precipitation: day.precipitation,
      activities: day.activities,
    })),
  }), [dailyData, tripDetails]);

  const {
    data: smartDailyRecommendations,
    isLoading: isLoadingDaily,
    error: dailyError,
    refetch: refetchDaily,
  } = useQuery({
    queryKey: ['smart-daily-recommendations', tripContext],
    queryFn: () => fetchDailyRecommendations(tripContext),
    enabled: dailyData.length > 0 && !!tripDetails.destination,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });

  const {
    data: smartPackingOptimization,
    isLoading: isLoadingPacking,
    error: packingError,
  } = useQuery({
    queryKey: ['smart-packing-optimization', tripContext],
    queryFn: () => fetchPackingOptimization(tripContext, []),
    enabled: dailyData.length > 0 && !!tripDetails.destination,
    staleTime: 10 * 60 * 1000,
  });

  const hasError = dailyError || packingError;
  const isLoading = isLoadingDaily || isLoadingPacking;
  const hasMultipleDestinations = (tripDetails.destinations?.length || 0) > 1;

  // Detect destination transitions
  const isTransitionDay = (index: number): boolean => {
    if (index === 0) return false;
    return dailyData[index].destination !== dailyData[index - 1].destination;
  };

  const renderPackingList = (optimization: PackingListOptimization) => {
    const categories = [
      { key: 'tops', title: 'Tops', emoji: '👕', items: optimization.optimizedList.tops },
      { key: 'bottoms', title: 'Bottoms', emoji: '👖', items: optimization.optimizedList.bottoms },
      { key: 'outerwear', title: 'Outerwear', emoji: '🧥', items: optimization.optimizedList.outerwear },
      { key: 'footwear', title: 'Footwear', emoji: '👟', items: optimization.optimizedList.footwear },
      { key: 'accessories', title: 'Accessories', emoji: '✨', items: optimization.optimizedList.accessories },
      { key: 'essentials', title: 'Essentials', emoji: '🎒', items: optimization.optimizedList.essentials },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-5 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{optimization.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.key} className="bg-white rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{category.emoji}</span>
                <h4 className="font-semibold text-foreground text-sm">{category.title}</h4>
                <span className="ml-auto bg-secondary text-muted-foreground px-2 py-1 rounded text-xs">
                  {category.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                </span>
              </div>
              <div className="space-y-1.5">
                {category.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-card rounded hover:bg-secondary transition-colors">
                    <span className="text-foreground text-sm">{item.item}</span>
                    <span className="bg-accent text-primary px-2 py-0.5 rounded text-xs font-medium">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {optimization.luggageOptimization.packingTips.length > 0 && (
          <div className="bg-warning-light rounded-lg p-5 border border-warning/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h5 className="font-semibold text-foreground text-sm">Packing Tips</h5>
            </div>
            <ul className="space-y-2">
              {optimization.luggageOptimization.packingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-warning mt-0.5 flex-shrink-0">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (!dailyData || dailyData.length === 0) {
    return <div>Loading daily suggestions...</div>;
  }

  return (
    <div className="space-y-6">
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to generate smart recommendations. Please try refreshing the page.
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchDaily();
                queryClient.invalidateQueries({ queryKey: ['smart-packing-optimization'] });
              }}
              className="ml-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Packing List */}
      <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
        <div className="bg-accent px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-soft">
              <span className="text-xl">🎒</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Packing List</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Optimized for {tripDetails.luggageSize || 'standard'} luggage
                {hasMultipleDestinations && ` across ${tripDetails.destinations!.length} destinations`}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mb-4"></div>
              <h4 className="font-semibold text-foreground mb-1">Analyzing Your Trip</h4>
              <p className="text-muted-foreground text-sm">
                Creating personalized recommendations
                {hasMultipleDestinations && " across all destinations"}...
              </p>
            </div>
          ) : smartPackingOptimization && !hasError ? (
            renderPackingList(smartPackingOptimization)
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📋</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Unable to Generate Recommendations</h4>
              <p className="text-muted-foreground text-sm">Please ensure all trip details are provided.</p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Timeline */}
      <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
        <div className="bg-card px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-soft">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Daily Clothing Timeline</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                What to wear each day — morning outfit, daytime adjustments, evening layers
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoadingDaily ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mb-4"></div>
              <p className="text-muted-foreground text-sm">Building your daily timeline...</p>
            </div>
          ) : (
            <div className="relative">
              {dailyData.map((day, dayIndex) => {
                const smartDay = smartDailyRecommendations?.find((s: any) => s.date === day.date);
                const legIdx = day.legIndex ?? 0;
                const isNewDestination = isTransitionDay(dayIndex);

                return (
                  <div key={dayIndex} className="relative">
                    {/* Destination transition marker */}
                    {isNewDestination && (
                      <div className="flex items-center gap-3 mb-4 mt-2">
                        <div className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2",
                          legIdx === 0 ? "border-blue-300 bg-blue-50 text-blue-700" :
                          legIdx === 1 ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                          legIdx === 2 ? "border-amber-300 bg-amber-50 text-amber-700" :
                          legIdx === 3 ? "border-purple-300 bg-purple-50 text-purple-700" :
                          "border-rose-300 bg-rose-50 text-rose-700"
                        )}>
                          <Plane className="h-4 w-4" />
                          Arriving in {day.destination?.split(',')[0]}
                        </div>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    {/* First destination marker */}
                    {dayIndex === 0 && hasMultipleDestinations && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2",
                          "border-blue-300 bg-blue-50 text-blue-700"
                        )}>
                          <MapPin className="h-4 w-4" />
                          {day.destination?.split(',')[0]}
                        </div>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    {/* Timeline row */}
                    <div className="flex gap-4 mb-8 last:mb-0">
                      {/* Timeline track */}
                      <div className="flex flex-col items-center w-12 flex-shrink-0">
                        <div className={cn(
                          "w-3 h-3 rounded-full z-10",
                          legDotColors[legIdx % legDotColors.length]
                        )} />
                        {dayIndex < dailyData.length - 1 && (
                          <div className={cn(
                            "w-0.5 flex-1 -mt-px",
                            isTransitionDay(dayIndex + 1)
                              ? "bg-gradient-to-b from-current to-transparent border-l-2 border-dashed border-muted-foreground/30 w-0"
                              : legLineColors[legIdx % legLineColors.length]
                          )} />
                        )}
                      </div>

                      {/* Day content card */}
                      <div className={cn(
                        "flex-1 rounded-lg border p-5 transition-all hover:shadow-soft",
                        hasMultipleDestinations
                          ? `border-l-4 ${legBorderColors[legIdx % legBorderColors.length]}`
                          : "border-border"
                      )}>
                        {/* Day header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-muted-foreground">Day {dayIndex + 1}</span>
                            <span className="font-semibold text-foreground">{day.date}</span>
                            {hasMultipleDestinations && day.destination && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                legBadgeColors[legIdx % legBadgeColors.length]
                              )}>
                                {day.destination.split(',')[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getWeatherIcon(day.condition)}
                            <span className="capitalize font-medium">{day.condition}</span>
                            <span className="font-semibold">{day.temp.low}°-{day.temp.high}°F</span>
                          </div>
                        </div>

                        {/* Weather details */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                          {day.uvIndex !== undefined && day.uvIndex > 0 && (
                            <span className="flex items-center gap-1">☀️ UV {day.uvIndex}</span>
                          )}
                          {day.precipitation > 0 && (
                            <span className="flex items-center gap-1">🌧️ {day.precipitation}mm</span>
                          )}
                          {(smartDay?.weatherDetails?.tips?.length ?? 0) > 0 && (
                            <span className="italic">{smartDay!.weatherDetails!.tips![0]}</span>
                          )}
                        </div>

                        {/* Activities */}
                        {day.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {day.activities.map((activity, i) => (
                              <span key={i} className="bg-info-light text-info px-2 py-0.5 rounded-full text-xs font-medium">
                                {activity}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Travel day notice */}
                        {isNewDestination && (
                          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4">
                            <p className="text-xs text-amber-700 font-medium">
                              🧳 Travel day — Wear comfortable, layered clothing. Pack weather-appropriate clothes for {day.destination?.split(',')[0]} accessible in your bag.
                            </p>
                          </div>
                        )}

                        {/* Clothing recommendations */}
                        {smartDay && !hasError ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Morning */}
                            <div className="bg-info-light rounded-lg p-3 border border-info/20">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Shirt className="h-3.5 w-3.5 text-info" />
                                <span className="text-xs font-semibold text-info">Morning</span>
                                <span className="text-xs text-info/60 ml-auto">
                                  {Math.round(day.temp.low + (day.temp.high - day.temp.low) * 0.2)}°F
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {smartDay.recommendations?.morning?.length > 0 ? (
                                  smartDay.recommendations.morning.map((item: string, i: number) => (
                                    <li key={i} className="text-xs text-info flex items-start gap-1.5">
                                      <span className="text-info/50 mt-0.5 flex-shrink-0">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-xs text-info/60 italic">Standard outfit</li>
                                )}
                              </ul>
                            </div>

                            {/* Daytime */}
                            <div className="bg-warning-light rounded-lg p-3 border border-warning/20">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Sun className="h-3.5 w-3.5 text-warning" />
                                <span className="text-xs font-semibold text-warning">Daytime</span>
                                <span className="text-xs text-warning/60 ml-auto">
                                  {Math.round(day.temp.high)}°F
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {smartDay.recommendations?.daytime?.length > 0 ? (
                                  smartDay.recommendations.daytime.map((item: string, i: number) => (
                                    <li key={i} className="text-xs text-warning flex items-start gap-1.5">
                                      <span className="text-warning/50 mt-0.5 flex-shrink-0 font-semibold">
                                        {item.startsWith('-') ? '−' : item.startsWith('+') ? '+' : '•'}
                                      </span>
                                      <span>{item.replace(/^[+-]\s*(Remove|Add)\s*/, '')}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-xs text-warning/60 italic">Keep your base layers</li>
                                )}
                              </ul>
                            </div>

                            {/* Evening */}
                            <div className="bg-accent-light rounded-lg p-3 border border-neutral/20">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Moon className="h-3.5 w-3.5 text-neutral" />
                                <span className="text-xs font-semibold text-neutral">Evening</span>
                                <span className="text-xs text-neutral/60 ml-auto">
                                  {Math.round(day.temp.low + (day.temp.high - day.temp.low) * 0.7)}°F
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {smartDay.recommendations?.evening?.length > 0 ? (
                                  smartDay.recommendations.evening.map((item: string, i: number) => (
                                    <li key={i} className="text-xs text-neutral flex items-start gap-1.5">
                                      <span className="text-neutral/50 mt-0.5 flex-shrink-0 font-semibold">
                                        {item.startsWith('-') ? '−' : item.startsWith('+') ? '+' : '•'}
                                      </span>
                                      <span>{item.replace(/^[+-]\s*(Remove|Add)\s*/, '')}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-xs text-neutral/60 italic">Base layers sufficient</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        ) : !isLoading && (
                          <div className="bg-card rounded-lg p-3 border border-border">
                            <p className="text-xs text-muted-foreground">
                              {day.temp.low < 60 && "Long-sleeve shirts and light jacket for cool weather. "}
                              {day.temp.high >= 75 && "Light, breathable clothing and sun protection. "}
                              {day.condition === 'rainy' && "Waterproof jacket and closed shoes. "}
                            </p>
                          </div>
                        )}

                        {/* Essential items & activity gear */}
                        {(((smartDay?.recommendations?.activitySpecific?.length ?? 0) > 0) ||
                          ((smartDay?.priorities?.length ?? 0) > 0)) && (
                          <div className="bg-success-light rounded-lg p-3 border border-success/20 mt-4">
                            <h6 className="font-semibold text-success mb-2 flex items-center gap-1.5 text-xs">
                              <span>⭐</span> Essential Items & Activity Gear
                            </h6>
                            <ul className="space-y-1">
                              {smartDay?.priorities?.map((p: string, i: number) => (
                                <li key={`p-${i}`} className="text-xs text-success flex items-start gap-1.5">
                                  <span className="text-success/50 mt-0.5 flex-shrink-0">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                              {smartDay?.recommendations?.activitySpecific?.map((item: string, i: number) => (
                                <li key={`a-${i}`} className="text-xs text-success flex items-start gap-1.5">
                                  <span className="text-success/50 mt-0.5 flex-shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This timeline considers weather across{" "}
            <span className="font-medium text-foreground">
              {hasMultipleDestinations
                ? `${tripDetails.destinations!.map(d => d.destination.split(',')[0]).join(', ')}`
                : tripDetails.destination
              }
            </span>
            {tripDetails.tripTypes && tripDetails.tripTypes.length > 0 && (
              <span>, <span className="font-medium text-foreground">{tripDetails.tripTypes.join(' & ')}</span> activities</span>
            )}, and luggage constraints. Clothing items are optimized for maximum reuse across your trip.
          </p>
        </div>
      </div>
    </div>
  );
}
