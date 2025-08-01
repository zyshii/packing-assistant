import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Shirt, Sun, Moon, Activity, Sparkles, AlertCircle, Lightbulb, Package, Star, CheckCircle2, Thermometer, Umbrella, Eye } from "lucide-react";
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

const getPriorityIcon = (priority: "essential" | "recommended" | "optional") => {
  switch (priority) {
    case "essential":
      return <Star className="h-3 w-3 text-yellow-500 fill-current" />;
    case "recommended":
      return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
    case "optional":
      return <span className="h-3 w-3 rounded-full bg-gray-300 inline-block" />;
  }
};

const getPriorityColor = (priority: "essential" | "recommended" | "optional") => {
  switch (priority) {
    case "essential":
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    case "recommended":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "optional":
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className="h-4 w-4 text-orange-500" />;
    case 'rainy':
      return <Umbrella className="h-4 w-4 text-blue-500" />;
    case 'cloudy':
      return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    case 'mixed':
      return <div className="flex"><Sun className="h-3 w-3 text-orange-400" /><Umbrella className="h-3 w-3 text-blue-400" /></div>;
    default:
      return <Thermometer className="h-4 w-4 text-gray-500" />;
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
      { key: 'tops', title: '👕 Tops', items: optimization.optimizedList.tops },
      { key: 'bottoms', title: '👖 Bottoms', items: optimization.optimizedList.bottoms },
      { key: 'outerwear', title: '🧥 Outerwear', items: optimization.optimizedList.outerwear },
      { key: 'footwear', title: '👟 Footwear', items: optimization.optimizedList.footwear },
      { key: 'accessories', title: '✨ Accessories', items: optimization.optimizedList.accessories },
      { key: 'essentials', title: '🎒 Essentials', items: optimization.optimizedList.essentials }
    ];

    return (
      <div className="space-y-6">
        {/* Luggage Optimization Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Smart Luggage Optimization</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Space Utilization</span>
                <span className="font-medium">{optimization.luggageOptimization.spaceUtilization}%</span>
              </div>
              <Progress value={optimization.luggageOptimization.spaceUtilization} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">{optimization.summary}</p>
          </div>
        </div>

        {/* Optimized Packing List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.key}>
              <h4 className="font-medium text-foreground mb-3 text-sm">{category.title}</h4>
              <div className="space-y-2">
                {category.items.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${getPriorityColor(item.priority)}`}
                  >
                    {getPriorityIcon(item.priority)}
                    <div className="flex-1">
                      <div className="font-medium">{item.item} ({item.quantity})</div>
                      <div className="text-xs opacity-75 mt-1">{item.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Packing Tips */}
        {optimization.luggageOptimization.packingTips.length > 0 && (
          <div className="bg-info/10 rounded-lg p-4 border border-info/20">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-info" />
              <h5 className="font-medium text-info">Smart Packing Tips</h5>
            </div>
            <ul className="text-sm text-info space-y-1">
              {optimization.luggageOptimization.packingTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Space-saving Alternatives */}
        {optimization.luggageOptimization.alternatives.length > 0 && (
          <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-warning" />
              <h5 className="font-medium text-warning">Space-Saving Alternatives</h5>
            </div>
            <ul className="text-sm text-warning space-y-1">
              {optimization.luggageOptimization.alternatives.map((alt, index) => (
                <li key={index}>• {alt}</li>
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
      {/* Smart Engine Status */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Smart Dataset-Powered Recommendations</span>
          {isLoading && <span className="text-xs text-muted-foreground">(Analyzing...)</span>}
        </div>
        <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
          No API Required
        </Badge>
      </div>

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
      <Card className="p-6 shadow-card border-0 bg-card">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="h-5 w-5 text-primary" />
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Your Smart Packing List
              </h3>
              {tripDetails?.luggageSize && (
                <span className="text-sm font-normal text-muted-foreground">
                  (Optimized for {tripDetails.luggageSize} luggage)
                </span>
              )}
              <Badge variant="default" className="text-xs bg-primary/10 text-primary">
                Dataset-Optimized
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Analyzing your trip requirements...</span>
            </div>
          ) : smartPackingOptimization && !hasError ? (
            renderSmartPackingList(smartPackingOptimization)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Unable to generate packing recommendations. Please ensure all trip details are provided.
            </div>
          )}

          <div className="mt-6 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 This list uses advanced algorithms to analyze your{" "}
              <strong>{tripDetails?.destination || "destination"}</strong> weather conditions, 
              {tripDetails?.tripTypes && tripDetails.tripTypes.length > 0 && (
                <span> <strong>{tripDetails.tripTypes.join(' & ')}</strong> trip activities,</span>
              )} and luggage constraints to provide intelligent, weighted recommendations. 
              Items are prioritized based on weather conditions, planned activities, and space optimization.
            </p>
          </div>
        </div>
      </Card>

      {/* Enhanced Daily Clothing Suggestions */}
      <Card className="p-6 shadow-card border-0 bg-card">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Daily Clothing Suggestions</h3>
            </div>
            {isWeatherDataReal !== undefined && (
              <Badge 
                variant={isWeatherDataReal ? "default" : "secondary"} 
                className={`text-xs ${
                  isWeatherDataReal 
                    ? "bg-success text-success-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isWeatherDataReal ? "🌡️ Real-time weather" : "📊 Estimated weather"}
              </Badge>
            )}
          </div>

          <Accordion type="multiple" className="w-full">
            {dailyData.map((day, dayIndex) => {
              const smartDay = smartDailyRecommendations?.find((smart: any) => smart.date === day.date);
              
              return (
                <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border border-border rounded-lg mb-4">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            {day.date}
                            {getWeatherIcon(day.condition)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="capitalize">{day.condition}</span>
                            <span>•</span>
                            <span>{day.temp.low}°-{day.temp.high}°F</span>
                            {day.uvIndex && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  UV {day.uvIndex}
                                </span>
                              </>
                            )}
                            {day.precipitation > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Umbrella className="h-3 w-3" />
                                  {day.precipitation}mm
                                </span>
                              </>
                            )}
                            {day.activities.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{day.activities.length} activit{day.activities.length === 1 ? 'y' : 'ies'}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {smartDay && (
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                          Smart Analysis
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {/* Activities */}
                      {day.activities.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-2">Today's Activities:</h6>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weather Details */}
                      {smartDay?.weatherDetails && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <h6 className="text-sm font-medium text-foreground mb-2">Weather Analysis:</h6>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>Condition: {smartDay.weatherDetails.condition}</div>
                            <div>Temperature: {smartDay.weatherDetails.temperatureRange}</div>
                            {smartDay.weatherDetails.uvIndex && (
                              <div>UV Index: {smartDay.weatherDetails.uvIndex}</div>
                            )}
                            <div>Precipitation: {smartDay.weatherDetails.precipitation}</div>
                          </div>
                          {smartDay.weatherDetails.tips.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-medium">Tips:</div>
                              <ul className="text-xs text-muted-foreground mt-1">
                                {smartDay.weatherDetails.tips.map((tip: string, index: number) => (
                                  <li key={index}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Smart recommendations or fallback */}
                      {smartDay && !hasError ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Sun className="h-3 w-3" /> Morning
                            </h6>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {smartDay.recommendations.morning.map((item: string, index: number) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Sun className="h-3 w-3" /> Daytime
                            </h6>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {smartDay.recommendations.daytime.map((item: string, index: number) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Moon className="h-3 w-3" /> Evening
                            </h6>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {smartDay.recommendations.evening.map((item: string, index: number) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-2">Basic Recommendations:</h6>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {day.temp.low < 60 && <li>• Long-sleeve shirts and light jacket for cool weather</li>}
                            {day.temp.high >= 75 && <li>• Light, breathable clothing and sun protection</li>}
                            {day.condition === 'rainy' && <li>• Waterproof jacket and closed shoes</li>}
                            {day.activities.some(a => a.toLowerCase().includes('swimming')) && <li>• Swimwear and quick-dry clothing</li>}
                            {day.activities.some(a => a.toLowerCase().includes('business')) && <li>• Business attire and formal shoes</li>}
                            {day.activities.some(a => a.toLowerCase().includes('hiking')) && <li>• Sturdy hiking boots and moisture-wicking clothing</li>}
                          </ul>
                        </div>
                      )}

                      {/* Activity-specific recommendations */}
                      {smartDay?.recommendations?.activitySpecific && smartDay.recommendations.activitySpecific.length > 0 && (
                        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                          <h6 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                            <Activity className="h-3 w-3" /> Activity-Specific Gear
                          </h6>
                          <ul className="text-xs text-primary space-y-1">
                            {smartDay.recommendations.activitySpecific.map((item: string, index: number) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Must-have priorities */}
                      {smartDay?.priorities && smartDay.priorities.length > 0 && (
                        <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
                          <h6 className="text-sm font-medium text-warning mb-2 flex items-center gap-1">
                            <Star className="h-3 w-3" /> Must-Have Items
                          </h6>
                          <ul className="text-xs text-warning space-y-1">
                            {smartDay.priorities.map((priority: string, index: number) => (
                              <li key={index}>• {priority}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </Card>
    </div>
  );
}