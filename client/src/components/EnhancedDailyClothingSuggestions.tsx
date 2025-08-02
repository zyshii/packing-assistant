import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Shirt, Sun, Moon, Activity, Sparkles, AlertCircle, Lightbulb, Package, Star, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDailyRecommendations, fetchPackingOptimization, AgentRecommendationApiError } from "@/lib/aiRecommendationApi";
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

interface EnhancedDailyClothingSuggestionsProps {
  dailyData: DailyClothingData[];
  tripDetails?: TripDetails;
  isWeatherDataReal?: boolean;
  enableAgent?: boolean;
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

export default function EnhancedDailyClothingSuggestions({ 
  dailyData, 
  tripDetails, 
  isWeatherDataReal,
  enableAgent = true 
}: EnhancedDailyClothingSuggestionsProps) {
  const [useAgentRecommendations, setUseAgentRecommendations] = useState(enableAgent);
  const queryClient = useQueryClient();

  // Convert data to agent service format
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

  // Query for agent daily recommendations
  const {
    data: agentDailyRecommendations,
    isLoading: isLoadingDaily,
    error: dailyError,
    refetch: refetchDaily
  } = useQuery({
    queryKey: ['agent-daily-recommendations', tripContext],
    queryFn: () => fetchDailyRecommendations(tripContext),
    enabled: useAgentRecommendations && dailyData.length > 0 && !!tripDetails?.destination,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof AgentRecommendationApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      return failureCount < 2;
    }
  });

  // Query for agent packing optimization
  const {
    data: agentPackingOptimization,
    isLoading: isLoadingPacking,
    error: packingError
  } = useQuery({
    queryKey: ['agent-packing-optimization', tripContext, agentDailyRecommendations],
    queryFn: () => fetchPackingOptimization(tripContext, agentDailyRecommendations!),
    enabled: useAgentRecommendations && !!agentDailyRecommendations && agentDailyRecommendations.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fallback to original logic if agent is disabled or fails
  const fallbackPackingList = useMemo(() => {
    // This is the original logic from DailyClothingSuggestions.tsx
    const allConditions = dailyData.map(day => day.condition);
    const allTemps = dailyData.map(day => day.temp);
    const allActivities = dailyData.flatMap(day => day.activities || []);
    const maxTemp = Math.max(...allTemps.map(t => t.high));
    const minTemp = Math.min(...allTemps.map(t => t.low));
    const hasRain = allConditions.includes('rainy') || allConditions.includes('mixed');
    const hasHotWeather = maxTemp >= 75;
    const hasColdMornings = minTemp < 60;
    const hasSwimming = allActivities.some(activity => 
      activity.toLowerCase().includes('swimming') || 
      activity.toLowerCase().includes('beach') ||
      activity.toLowerCase().includes('water sport')
    );
    const hasBusiness = allActivities.some(activity => 
      activity.toLowerCase().includes('business') || 
      activity.toLowerCase().includes('meeting') ||
      activity.toLowerCase().includes('conference')
    );

    const getLuggageMultiplier = () => {
      switch (tripDetails?.luggageSize) {
        case 'carry-on': return { shirts: 2, pants: 1, extras: 0.5 };
        case 'checked': return { shirts: 4, pants: 3, extras: 2 };
        default: return { shirts: 3, pants: 2, extras: 1 };
      }
    };

    const multiplier = getLuggageMultiplier();
    const duration = tripDetails?.duration || dailyData.length;

    return {
      tops: [
        `👕 Short-sleeve T-shirts (${Math.max(2, Math.ceil(multiplier.shirts * Math.min(duration * 0.7, 5)))})`,
        `👕 Long-sleeve shirts (${Math.max(1, Math.ceil(multiplier.shirts * 0.5))})`,
        ...(hasColdMornings ? [`🧥 Light sweater or hoodie (${Math.ceil(multiplier.extras)})`] : []),
        ...(hasHotWeather ? [`👕 Breathable/moisture-wicking shirts (${Math.ceil(multiplier.shirts * 0.6)})`] : []),
        ...(hasBusiness ? [`👔 Business shirts/blouses (${Math.ceil(multiplier.shirts * 0.8)})`] : [])
      ],
      bottoms: [
        `👖 Comfortable pants or jeans (${Math.max(1, Math.ceil(multiplier.pants))})`,
        ...(hasHotWeather ? [`🩳 Shorts or lightweight trousers (${Math.ceil(multiplier.pants * 0.8)})`] : []),
        `🧦 Socks (${Math.max(duration, Math.ceil(duration * 1.2))} pairs)`,
        `👙 Undergarments (${Math.max(duration, Math.ceil(duration * 1.2))} sets)`,
        ...(hasSwimming ? ["👙 Swimwear (1-2 sets)"] : [])
      ],
      outerwear: [
        "🧥 Light jacket or cardigan",
        ...(hasRain ? ["☂️ Rain jacket or compact umbrella"] : []),
        ...(minTemp < 50 ? ["🧤 Gloves and warm hat"] : [])
      ],
      footwear: [
        "👟 Comfortable walking shoes",
        ...(hasSwimming ? ["🩴 Sandals or flip-flops"] : []),
        ...(hasBusiness ? ["👞 Formal shoes"] : [])
      ],
      accessories: [
        "🕶️ Sunglasses",
        "🧢 Hat or cap",
        "🧴 Sunscreen (SPF 30+)",
        ...(hasRain ? ["☂️ Compact umbrella"] : [])
      ],
      essentials: [
        "🪪 Travel documents",
        "💳 Payment cards",
        "🔌 Phone charger",
        `💊 Personal medications (${duration}-day supply)`
      ]
    };
  }, [dailyData, tripDetails]);

  const renderAgentPackingList = (optimization: PackingListOptimization) => {
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
            <h4 className="font-semibold text-foreground">Luggage Optimization</h4>
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
                {category.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${getPriorityColor(item.priority)}`}
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
              <h5 className="font-medium text-info">Packing Tips</h5>
            </div>
            <ul className="text-sm text-info space-y-1">
              {optimization.luggageOptimization.packingTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderFallbackPackingList = () => {
    const categories = [
      { title: '👕 Tops', items: fallbackPackingList.tops },
      { title: '👖 Bottoms', items: fallbackPackingList.bottoms },
      { title: '🧥 Outerwear', items: fallbackPackingList.outerwear },
      { title: '👟 Footwear', items: fallbackPackingList.footwear },
      { title: '✨ Accessories', items: fallbackPackingList.accessories },
      { title: '🎒 Essentials', items: fallbackPackingList.essentials }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.title}>
            <h4 className="font-medium text-foreground mb-3 text-sm">{category.title}</h4>
            <div className="space-y-1">
              {category.items.map((item, index) => (
                <p key={index} className="text-sm text-muted-foreground">{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!dailyData || dailyData.length === 0) {
    return <div>Loading daily suggestions...</div>;
  }

  const hasAgentError = dailyError || packingError;
  const isLoadingAgent = isLoadingDaily || isLoadingPacking;

  return (
    <div className="space-y-6">
      {/* Agent Toggle and Status */}
      {enableAgent && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Agent-Powered Recommendations</span>
            {isLoadingAgent && <span className="text-xs text-muted-foreground">(Generating...)</span>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setUseAgentRecommendations(!useAgentRecommendations);
              if (!useAgentRecommendations) {
                refetchDaily();
              }
            }}
            className="text-xs"
          >
            {useAgentRecommendations ? "Use Standard" : "Use Agent"}
          </Button>
        </div>
      )}

      {/* Error Alert */}
      {hasAgentError && useAgentRecommendations && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Agent recommendations temporarily unavailable. Showing standard recommendations instead.
            {dailyError instanceof AgentRecommendationApiError && (
              <span className="block text-xs mt-1">{dailyError.message}</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Recommended Packing List */}
      <Card className="p-6 shadow-card border-0 bg-card">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="h-5 w-5 text-primary" />
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Your Packing List
              </h3>
              {tripDetails?.luggageSize && (
                <span className="text-sm font-normal text-muted-foreground">
                  (Optimized for {tripDetails.luggageSize} luggage)
                </span>
              )}
              {useAgentRecommendations && !hasAgentError && (
                <Badge variant="default" className="text-xs bg-primary/10 text-primary">
                  Agent-Optimized
                </Badge>
              )}
            </div>
          </div>

          {isLoadingAgent && useAgentRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Agent is analyzing your trip...</span>
            </div>
          ) : useAgentRecommendations && agentPackingOptimization && !hasAgentError ? (
            renderAgentPackingList(agentPackingOptimization)
          ) : (
            renderFallbackPackingList()
          )}

          <div className="mt-6 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 This list is customized based on your{" "}
              <strong>{tripDetails?.destination || "destination"}</strong> weather forecast
              {tripDetails?.tripTypes && tripDetails.tripTypes.length > 0 && (
                <span>, <strong>{tripDetails.tripTypes.join(' & ')}</strong> trip{tripDetails.tripTypes.length > 1 ? 's' : ''}</span>
              )}, and planned activities. 
              Quantities are calculated based on your {dailyData.length}-day trip duration.
            </p>
          </div>
        </div>
      </Card>

      {/* Daily Clothing Suggestions */}
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
              const agentDay = agentDailyRecommendations?.find(agent => agent.date === day.date);
              
              return (
                <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border border-border rounded-lg mb-4">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <div className="font-semibold text-foreground">{day.date}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{day.condition}</span>
                            <span>•</span>
                            <span>{day.temp.low}°-{day.temp.high}°F</span>
                            {day.activities.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{day.activities.length} activit{day.activities.length === 1 ? 'y' : 'ies'}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {useAgentRecommendations && agentDay && (
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                          Agent Enhanced
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

                      {/* Agent-powered or fallback recommendations */}
                      {useAgentRecommendations && agentDay && !hasAgentError ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Sun className="h-3 w-3" /> Morning
                            </h6>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {agentDay.recommendations.morning.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Sun className="h-3 w-3" /> Daytime
                            </h6>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {agentDay.recommendations.daytime.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                              <Moon className="h-3 w-3" /> Evening
                            </h6>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {agentDay.recommendations.evening.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-2">Clothing Recommendations:</h6>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {/* Fallback to original logic */}
                            {day.temp.low < 60 && <li>• Long-sleeve shirts and light jacket</li>}
                            {day.temp.high >= 75 && <li>• Light, breathable clothing and sun protection</li>}
                            {day.condition === 'rainy' && <li>• Waterproof jacket and closed shoes</li>}
                            {day.activities.some(a => a.toLowerCase().includes('swimming')) && <li>• Swimwear and quick-dry clothing</li>}
                            {day.activities.some(a => a.toLowerCase().includes('business')) && <li>• Business attire and formal shoes</li>}
                            {day.activities.some(a => a.toLowerCase().includes('hiking')) && <li>• Sturdy hiking boots and moisture-wicking clothing</li>}
                          </ul>
                        </div>
                      )}

                      {/* Activity-specific priorities */}
                      {useAgentRecommendations && agentDay && agentDay.priorities.length > 0 && (
                        <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
                          <h6 className="text-sm font-medium text-warning mb-2 flex items-center gap-1">
                            <Star className="h-3 w-3" /> Must-Have Items
                          </h6>
                          <ul className="text-xs text-warning space-y-1">
                            {agentDay.priorities.map((priority, index) => (
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