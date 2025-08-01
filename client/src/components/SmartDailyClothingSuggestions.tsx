import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Shirt, Sun, Moon, Activity, Sparkles, AlertCircle, Lightbulb, Package, Star, CheckCircle2, Thermometer, Umbrella, Eye, Cloud, CloudSun, Snowflake } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDailyRecommendations, fetchPackingOptimization, AiRecommendationApiError } from "@/lib/aiRecommendationApi";
import type { DailyClothingRecommendation, PackingListOptimization } from "@/lib/aiRecommendationApi";
import type { TripContext } from "@shared/schema";

interface DailyClothingData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'mixed' | 'rainy' | 'snowy';
  temp: { high: number; low: number };
  uvIndex?: number;
  precipitation: number;
  timeOfDay: string[];
  activities: string[];
}

interface TripDetails {
  destination?: string;
  luggageSize?: string;
  tripTypes?: string[];
  duration?: number;
}

interface SmartDailyClothingSuggestionsProps {
  dailyData: DailyClothingData[];
  tripDetails?: TripDetails;
  isWeatherDataReal?: boolean;
}



const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'rainy':
    case 'rain':
      return <Umbrella className="h-6 w-6 text-blue-500" />;
    case 'cloudy':
    case 'overcast':
      return <Cloud className="h-6 w-6 text-gray-500" />;
    case 'mixed':
    case 'partly cloudy':
      return <CloudSun className="h-6 w-6 text-blue-400" />;
    case 'snowy':
    case 'snow':
      return <Snowflake className="h-6 w-6 text-blue-200" />;
    default:
      return <Thermometer className="h-6 w-6 text-gray-500" />;
  }
};

export default function SmartDailyClothingSuggestions({ 
  dailyData, 
  tripDetails, 
  isWeatherDataReal
}: SmartDailyClothingSuggestionsProps) {
  const queryClient = useQueryClient();

  // Convert data to smart engine format
  const tripContext: TripContext = useMemo(() => {
    if (!tripDetails?.destination) {
      return {
        destination: "Unknown",
        duration: dailyData.length,
        tripTypes: tripDetails?.tripTypes || ["leisure"],
        luggageSize: tripDetails?.luggageSize || "standard",
        dailyData: dailyData.map(day => ({
          date: day.date,
          condition: day.condition,
          temp: day.temp,
          uvIndex: day.uvIndex,
          precipitation: day.precipitation,
          activities: day.activities
        }))
      };
    }

    return {
      destination: tripDetails.destination,
      duration: tripDetails.duration || dailyData.length,
      tripTypes: tripDetails.tripTypes || ["leisure"],
      luggageSize: tripDetails.luggageSize || "standard",
      dailyData: dailyData.map(day => ({
        date: day.date,
        condition: day.condition,
        temp: day.temp,
        uvIndex: day.uvIndex,
        precipitation: day.precipitation,
        activities: day.activities
      }))
    };
  }, [dailyData, tripDetails]);

  // Query for smart daily recommendations
  const {
    data: smartDailyRecommendations,
    isLoading: isLoadingDaily,
    error: dailyError,
    refetch: refetchDaily
  } = useQuery({
    queryKey: ['smart-daily-recommendations', tripContext],
    queryFn: () => fetchDailyRecommendations(tripContext),
    enabled: dailyData.length > 0 && !!tripDetails?.destination,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3
  });

  // Query for smart packing optimization
  const {
    data: smartPackingOptimization,
    isLoading: isLoadingPacking,
    error: packingError
  } = useQuery({
    queryKey: ['smart-packing-optimization', tripContext],
    queryFn: () => fetchPackingOptimization(tripContext, []), // Smart engine doesn't need daily recommendations as parameter
    enabled: dailyData.length > 0 && !!tripDetails?.destination,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const renderSmartPackingList = (optimization: PackingListOptimization) => {
    const categories = [
      { key: 'tops', title: 'Tops', emoji: '👕', items: optimization.optimizedList.tops },
      { key: 'bottoms', title: 'Bottoms', emoji: '👖', items: optimization.optimizedList.bottoms },
      { key: 'outerwear', title: 'Outerwear', emoji: '🧥', items: optimization.optimizedList.outerwear },
      { key: 'footwear', title: 'Footwear', emoji: '👟', items: optimization.optimizedList.footwear },
      { key: 'accessories', title: 'Accessories', emoji: '✨', items: optimization.optimizedList.accessories },
      { key: 'essentials', title: 'Essentials', emoji: '🎒', items: optimization.optimizedList.essentials }
    ];

    return (
      <div className="space-y-8">
        {/* Trip Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 leading-relaxed">{optimization.summary}</p>
        </div>

        {/* Optimized Packing List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.key} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.emoji}</span>
                  <h4 className="font-semibold text-gray-900 text-sm">{category.title}</h4>
                  <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {category.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {category.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-medium text-gray-900 text-sm leading-snug">{item.item}</h5>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0">
                          {item.quantity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Packing Tips */}
        {optimization.luggageOptimization.packingTips.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-lg">
                <span className="text-lg">💡</span>
              </div>
              <h5 className="font-semibold text-amber-900">Packing Tips</h5>
            </div>
            <ul className="space-y-2">
              {optimization.luggageOptimization.packingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-600 mt-0.5 flex-shrink-0">•</span>
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

  const hasError = dailyError || packingError;
  const isLoading = isLoadingDaily || isLoadingPacking;

  return (
    <div className="space-y-6">


      {/* Error Alert */}
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

      {/* Smart Packing List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
              <span className="text-2xl">🎒</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">Packing List</h3>
              {tripDetails?.luggageSize && (
                <p className="text-sm text-gray-600 mt-1">
                  Optimized for {tripDetails.luggageSize} luggage
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-200 border-t-blue-600 mb-4"></div>
              <h4 className="font-semibold text-gray-900 mb-2">Analyzing Your Trip</h4>
              <p className="text-gray-600 text-sm">Creating personalized recommendations...</p>
            </div>
          ) : smartPackingOptimization && !hasError ? (
            renderSmartPackingList(smartPackingOptimization)
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unable to Generate Recommendations</h4>
              <p className="text-gray-600 text-sm">Please ensure all trip details are provided.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            This list analyzes your{" "}
            <span className="font-semibold text-gray-900">{tripDetails?.destination || "destination"}</span> weather conditions
            {tripDetails?.tripTypes && tripDetails.tripTypes.length > 0 && (
              <span>, <span className="font-semibold text-gray-900">{tripDetails.tripTypes.join(' & ')}</span> activities</span>
            )}, and luggage constraints to provide recommendations optimized for your trip.
          </p>
        </div>
      </div>

      {/* Enhanced Daily Clothing Suggestions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">👕</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Daily Clothing Suggestions</h3>
                <p className="text-sm text-gray-600 mt-1">Recommendations for each day</p>
              </div>
            </div>
            {isWeatherDataReal !== undefined && (
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                isWeatherDataReal 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <span className="mr-1">{isWeatherDataReal ? "🌡️" : "📊"}</span>
                {isWeatherDataReal ? "Real-time weather" : "Estimated weather"}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {dailyData.map((day, dayIndex) => {
              const smartDay = smartDailyRecommendations?.find((smart: any) => smart.date === day.date);
              
              return (
                <div key={dayIndex} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                          {getWeatherIcon(day.condition)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{day.date}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span className="capitalize font-medium">{day.condition}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="font-semibold">{day.temp.low}°-{day.temp.high}°F</span>
                            {day.uvIndex && (
                              <>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                  <span>☀️</span> UV {day.uvIndex}
                                </span>
                              </>
                            )}
                            {day.precipitation > 0 && (
                              <>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                  <span>🌧️</span> {day.precipitation}mm
                                </span>
                              </>
                            )}
                          </div>
                          {smartDay?.weatherDetails && smartDay.weatherDetails.tips.length > 0 && (
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                              {smartDay.weatherDetails.tips.join('. ')}.
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Activities */}
                      {day.activities.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">🎯</span>
                            <h6 className="font-semibold text-gray-900">Today's Activities</h6>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, index) => (
                              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}



                      {/* Smart layering recommendations */}
                      {smartDay && !hasError ? (
                        <div className="space-y-4">
                          {/* Start Your Day With Card */}
                          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                                <Shirt className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h6 className="font-semibold text-blue-900">Start Your Day With</h6>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center justify-end mb-2">
                                  <div className="text-xs font-medium text-blue-800">Morning: {Math.round(day.temp.low + (day.temp.high - day.temp.low) * 0.2)}°F</div>
                                </div>
                                <ul className="space-y-1">
                                  {smartDay.recommendations?.base?.length > 0 ? (
                                    smartDay.recommendations.base.map((item: string, index: number) => (
                                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                        <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-sm text-blue-600 italic">
                                      Basic clothing for {Math.round(day.temp.low + (day.temp.high - day.temp.low) * 0.2)}°F
                                    </li>
                                  )}
                                </ul>
                              </div>
                              <div className="text-xs text-blue-600 bg-blue-100 rounded-lg p-2">
                                💡 <strong>Tip:</strong> This is your complete morning outfit. Add or remove layers as needed throughout the day.
                              </div>
                            </div>
                          </div>

                          {/* Layering Options */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Daytime Adjustments */}
                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Sun className="h-5 w-5 text-orange-600" />
                                <h6 className="font-semibold text-orange-900">As Temperature Rises</h6>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                  <div className="text-xs font-medium text-orange-800 mb-1">Peak Temperature: {Math.round(day.temp.high)}°F</div>
                                  <ul className="space-y-1">
                                    {smartDay.recommendations?.daytime?.length > 0 ? (
                                      smartDay.recommendations.daytime.map((item: string, index: number) => (
                                        <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                                          <span className="text-orange-500 mt-0.5 flex-shrink-0 font-semibold">
                                            {item.startsWith('-') ? '−' : item.startsWith('+') ? '+' : '•'}
                                          </span>
                                          <span>{item.replace(/^[+-]\s*/, '')}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-sm text-orange-600 italic">
                                        Stay comfortable in your base layers
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Evening Adjustments */}
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Moon className="h-5 w-5 text-purple-600" />
                                <h6 className="font-semibold text-purple-900">As Temperature Drops</h6>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-xs font-medium text-purple-800 mb-1">Evening Low: {Math.round(day.temp.low + (day.temp.high - day.temp.low) * 0.7)}°F</div>
                                  <ul className="space-y-1">
                                    {smartDay.recommendations?.evening?.length > 0 ? (
                                      smartDay.recommendations.evening.map((item: string, index: number) => (
                                        <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                                          <span className="text-purple-500 mt-0.5 flex-shrink-0 font-semibold">
                                            {item.startsWith('-') ? '−' : item.startsWith('+') ? '+' : '•'}
                                          </span>
                                          <span>{item.replace(/^[+-]\s*/, '')}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-sm text-purple-600 italic">
                                        Your base layers should be sufficient
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h6 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">📋</span> Basic Recommendations
                          </h6>
                          <ul className="space-y-2">
                            {day.temp.low < 60 && (
                              <li className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                                <span>Long-sleeve shirts and light jacket for cool weather</span>
                              </li>
                            )}
                            {day.temp.high >= 75 && (
                              <li className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                                <span>Light, breathable clothing and sun protection</span>
                              </li>
                            )}
                            {day.condition === 'rainy' && (
                              <li className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                                <span>Waterproof jacket and closed shoes</span>
                              </li>
                            )}
                            {day.activities.some(a => a.toLowerCase().includes('swimming')) && (
                              <li className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                                <span>Swimwear and quick-dry clothing</span>
                              </li>
                            )}
                            {day.activities.some(a => a.toLowerCase().includes('business')) && (
                              <li className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                                <span>Business attire and formal shoes</span>
                              </li>
                            )}
                            {day.activities.some(a => a.toLowerCase().includes('hiking')) && (
                              <li className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                                <span>Sturdy hiking boots and moisture-wicking clothing</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Essential Items and Activity Gear */}
                      {((smartDay?.recommendations?.activitySpecific && smartDay.recommendations.activitySpecific.length > 0) || 
                        (smartDay?.priorities && smartDay.priorities.length > 0)) && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h6 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">⭐</span> Essential Items & Activity Gear
                          </h6>
                          <ul className="space-y-2">
                            {smartDay?.priorities && smartDay.priorities.map((priority: string, index: number) => (
                              <li key={`priority-${index}`} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                                <span>{priority}</span>
                              </li>
                            ))}
                            {smartDay?.recommendations?.activitySpecific && smartDay.recommendations.activitySpecific.map((item: string, index: number) => (
                              <li key={`activity-${index}`} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
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
        </div>
      </div>
    </div>
  );
}