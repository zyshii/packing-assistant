import { z } from "zod";

// Mock AI service - no external API keys required

// Schemas for agent responses
const dailyClothingRecommendationSchema = z.object({
  date: z.string(),
  activities: z.array(z.string()),
  weather: z.object({
    condition: z.string(),
    temperatureHigh: z.number(),
    temperatureLow: z.number(),
    uvIndex: z.number().optional(),
    precipitation: z.number()
  }),
  recommendations: z.object({
    morning: z.array(z.string()),
    daytime: z.array(z.string()),
    evening: z.array(z.string()),
    activitySpecific: z.array(z.string())
  }),
  priorities: z.array(z.string()).describe("Key items that are essential for this day")
});

const packingListOptimizationSchema = z.object({
  optimizedList: z.object({
    tops: z.array(z.object({
      item: z.string(),
      quantity: z.number(),
      priority: z.enum(["essential", "recommended", "optional"]),
      reason: z.string()
    })),
    bottoms: z.array(z.object({
      item: z.string(),
      quantity: z.number(),
      priority: z.enum(["essential", "recommended", "optional"]),
      reason: z.string()
    })),
    outerwear: z.array(z.object({
      item: z.string(),
      quantity: z.number(),
      priority: z.enum(["essential", "recommended", "optional"]),
      reason: z.string()
    })),
    footwear: z.array(z.object({
      item: z.string(),
      quantity: z.number(),
      priority: z.enum(["essential", "recommended", "optional"]),
      reason: z.string()
    })),
    accessories: z.array(z.object({
      item: z.string(),
      quantity: z.number(),
      priority: z.enum(["essential", "recommended", "optional"]),
      reason: z.string()
    })),
    essentials: z.array(z.object({
      item: z.string(),
      quantity: z.number(),
      priority: z.enum(["essential", "recommended", "optional"]),
      reason: z.string()
    }))
  }),
  luggageOptimization: z.object({
    spaceUtilization: z.number().describe("Percentage of luggage space used (0-100)"),
    packingTips: z.array(z.string()),
    alternatives: z.array(z.string()).describe("Alternative items to save space")
  }),
  summary: z.string()
});

export type DailyClothingRecommendation = z.infer<typeof dailyClothingRecommendationSchema>;
export type PackingListOptimization = z.infer<typeof packingListOptimizationSchema>;

interface TripContext {
  destination: string;
  duration: number;
  tripTypes: string[];
  luggageSize: string;
  dailyData: Array<{
    date: string;
    condition: string;
    temp: { high: number; low: number };
    uvIndex?: number;
    precipitation: number;
    activities: string[];
  }>;
}

export async function generateDailyClothingRecommendations(
  tripContext: TripContext
): Promise<DailyClothingRecommendation[]> {
  try {
    // Generate smart recommendations based on weather and activities
    return tripContext.dailyData.map(day => {
      const recommendations = generateRecommendationsForDay(day, tripContext);
      
      const dailyRec: DailyClothingRecommendation = {
        date: day.date,
        activities: day.activities,
        weather: {
          condition: day.condition,
          temperatureHigh: day.temp.high,
          temperatureLow: day.temp.low,
          uvIndex: day.uvIndex,
          precipitation: day.precipitation
        },
        recommendations,
        priorities: generatePriorities(day, tripContext)
      };
      
      return dailyClothingRecommendationSchema.parse(dailyRec);
    });
  } catch (error) {
    console.error("Error generating daily clothing recommendations:", error);
    throw new Error("Failed to generate clothing recommendations");
  }
}

export async function optimizePackingList(
  tripContext: TripContext,
  dailyRecommendations: DailyClothingRecommendation[]
): Promise<PackingListOptimization> {
  try {
    // Generate optimized packing list based on trip context and daily recommendations
    const optimizedList = generateOptimizedPackingList(tripContext, dailyRecommendations);
    const luggageOptimization = generateLuggageOptimization(tripContext);
    const summary = generatePackingSummary(tripContext, dailyRecommendations);
    
    const result = {
      optimizedList,
      luggageOptimization,
      summary
    };
    
    return packingListOptimizationSchema.parse(result);
  } catch (error) {
    console.error("Error optimizing packing list:", error);
    throw new Error("Failed to generate optimized packing list");
  }
}

export async function getActivitySpecificRecommendations(
  activities: string[],
  weather: { condition: string; temperatureHigh: number; temperatureLow: number; uvIndex?: number; precipitation: number },
  destination: string
): Promise<string[]> {
  try {
    if (activities.length === 0) {
      return [];
    }

    // Generate activity-specific recommendations based on activities and weather
    const recommendations: string[] = [];
    
    activities.forEach(activity => {
      const activityRecs = getRecommendationsForActivity(activity, weather, destination);
      recommendations.push(...activityRecs);
    });
    
    // Remove duplicates
    return Array.from(new Set(recommendations));
  } catch (error) {
    console.error("Error getting activity-specific recommendations:", error);
    return [];
  }
}

// Helper functions to replace OpenAI functionality with smart logic
function generateRecommendationsForDay(day: any, tripContext: TripContext) {
  const { temp, condition, precipitation, uvIndex } = day;
  const isCold = temp.high < 50;
  const isWarm = temp.high > 75;
  const isRainy = precipitation > 0;
  const isSunny = condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear');
  
  const morning = [];
  const daytime = [];
  const evening = [];
  const activitySpecific = [];
  
  // Base layer recommendations
  if (isCold) {
    morning.push("Thermal base layer", "Warm jacket or coat");
    daytime.push("Insulated jacket", "Warm pants or jeans");
    evening.push("Heavy sweater or hoodie", "Warm outerwear");
  } else if (isWarm) {
    morning.push("Light t-shirt or tank top", "Shorts or light pants");
    daytime.push("Breathable shirt", "Comfortable shorts");
    evening.push("Light cardigan or light jacket");
  } else {
    morning.push("Long-sleeve shirt", "Light jacket");
    daytime.push("Comfortable shirt", "Jeans or chinos");
    evening.push("Sweater or light jacket");
  }
  
  // Weather-specific additions
  if (isRainy) {
    morning.push("Waterproof jacket", "Umbrella");
    daytime.push("Rain-resistant footwear");
    evening.push("Water-resistant outerwear");
  }
  
  if (isSunny && (uvIndex || 0) > 6) {
    daytime.push("Sunglasses", "Sun hat", "Sunscreen");
    activitySpecific.push("UV-protective clothing");
  }
  
  // Activity-specific recommendations
  day.activities.forEach((activity: string) => {
    const activityRecs = getRecommendationsForActivity(activity, { 
      condition, 
      temperatureHigh: temp.high, 
      temperatureLow: temp.low, 
      uvIndex,
      precipitation 
    }, tripContext.destination);
    activitySpecific.push(...activityRecs);
  });
  
  return { morning, daytime, evening, activitySpecific };
}

function generatePriorities(day: any, tripContext: TripContext): string[] {
  const priorities = [];
  const { temp, condition, precipitation } = day;
  
  if (temp.high < 40) {
    priorities.push("Warm coat", "Insulated boots", "Gloves");
  } else if (temp.high > 85) {
    priorities.push("Sun protection", "Light breathable clothing", "Hat");
  }
  
  if (precipitation > 5) {
    priorities.push("Waterproof jacket", "Umbrella", "Water-resistant shoes");
  }
  
  if (day.activities.includes('business')) {
    priorities.push("Business attire", "Dress shoes");
  }
  
  if (day.activities.includes('hiking')) {
    priorities.push("Hiking boots", "Moisture-wicking clothes", "Backpack");
  }
  
  if (day.activities.includes('swimming')) {
    priorities.push("Swimwear", "Towel", "Flip-flops");
  }
  
  return priorities;
}

function getRecommendationsForActivity(activity: string, weather: any, destination: string): string[] {
  const recommendations: string[] = [];
  const activityLower = activity.toLowerCase();
  
  if (activityLower.includes('hiking')) {
    recommendations.push("Hiking boots", "Moisture-wicking shirt", "Hiking pants", "Day pack", "Water bottle");
    if (weather.precipitation > 0) {
      recommendations.push("Waterproof hiking jacket");
    }
  }
  
  if (activityLower.includes('swimming') || activityLower.includes('beach')) {
    recommendations.push("Swimwear", "Beach towel", "Flip-flops", "Waterproof bag");
    if (weather.uvIndex && weather.uvIndex > 6) {
      recommendations.push("Rash guard", "Wide-brim hat");
    }
  }
  
  if (activityLower.includes('business') || activityLower.includes('meeting')) {
    recommendations.push("Business suit or dress", "Dress shoes", "Professional accessories");
  }
  
  if (activityLower.includes('dinner') || activityLower.includes('restaurant')) {
    recommendations.push("Nice casual or semi-formal outfit", "Comfortable dress shoes");
  }
  
  if (activityLower.includes('outdoor') || activityLower.includes('adventure')) {
    recommendations.push("Quick-dry clothing", "Sturdy shoes", "Hat", "Sunglasses");
  }
  
  return recommendations;
}

function generateOptimizedPackingList(tripContext: TripContext, dailyRecommendations: DailyClothingRecommendation[]) {
  const duration = tripContext.duration;
  const isCarryOn = tripContext.luggageSize === 'carry-on';
  
  // Calculate item frequencies and priorities
  const itemCounts = new Map<string, number>();
  const priorities = new Set<string>();
  
  dailyRecommendations.forEach(day => {
    day.priorities.forEach(item => priorities.add(item));
    [...day.recommendations.morning, ...day.recommendations.daytime, 
     ...day.recommendations.evening, ...day.recommendations.activitySpecific]
      .forEach(item => {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
      });
  });
  
  return {
    tops: generateCategoryItems('tops', duration, isCarryOn, itemCounts, priorities),
    bottoms: generateCategoryItems('bottoms', duration, isCarryOn, itemCounts, priorities),
    outerwear: generateCategoryItems('outerwear', duration, isCarryOn, itemCounts, priorities),
    footwear: generateCategoryItems('footwear', duration, isCarryOn, itemCounts, priorities),
    accessories: generateCategoryItems('accessories', duration, isCarryOn, itemCounts, priorities),
    essentials: generateCategoryItems('essentials', duration, isCarryOn, itemCounts, priorities)
  };
}

function generateCategoryItems(category: string, duration: number, isCarryOn: boolean, itemCounts: Map<string, number>, priorities: Set<string>) {
  const items = [];
  const maxQuantity = isCarryOn ? Math.min(duration, 7) : duration;
  
  switch (category) {
    case 'tops':
      items.push(
        { item: "T-shirts", quantity: Math.min(maxQuantity, duration), priority: "essential" as const, reason: "Daily wear essential" },
        { item: "Long-sleeve shirts", quantity: Math.min(2, Math.ceil(duration / 3)), priority: "recommended" as const, reason: "Versatile for weather changes" }
      );
      break;
    case 'bottoms':
      items.push(
        { item: "Jeans or pants", quantity: Math.min(2, Math.ceil(duration / 2)), priority: "essential" as const, reason: "Versatile daily wear" },
        { item: "Shorts", quantity: duration > 3 ? 2 : 1, priority: "recommended" as const, reason: "Warm weather option" }
      );
      break;
    case 'outerwear':
      items.push(
        { item: "Light jacket", quantity: 1, priority: "essential" as const, reason: "Weather protection" }
      );
      break;
    case 'footwear':
      items.push(
        { item: "Comfortable walking shoes", quantity: 1, priority: "essential" as const, reason: "Daily activities" },
        { item: "Dress shoes", quantity: 1, priority: "optional" as const, reason: "Formal occasions" }
      );
      break;
    case 'accessories':
      items.push(
        { item: "Sunglasses", quantity: 1, priority: "recommended" as const, reason: "Sun protection" },
        { item: "Hat", quantity: 1, priority: "recommended" as const, reason: "Weather protection" }
      );
      break;
    case 'essentials':
      items.push(
        { item: "Underwear", quantity: duration + 1, priority: "essential" as const, reason: "Hygiene essential" },
        { item: "Socks", quantity: duration + 1, priority: "essential" as const, reason: "Daily comfort" }
      );
      break;
  }
  
  return items;
}

function generateLuggageOptimization(tripContext: TripContext) {
  const isCarryOn = tripContext.luggageSize === 'carry-on';
  const duration = tripContext.duration;
  
  const spaceUtilization = isCarryOn ? Math.min(85, duration * 10 + 30) : Math.min(70, duration * 8 + 20);
  
  const packingTips = [];
  const alternatives = [];
  
  if (isCarryOn) {
    packingTips.push(
      "Roll clothes instead of folding to save 30% space",
      "Use packing cubes for organization",
      "Wear heaviest items while traveling"
    );
    alternatives.push(
      "Quick-dry fabrics instead of heavy materials",
      "Multi-purpose items (sarong as towel/blanket)",
      "Leave space for souvenirs by packing minimally"
    );
  } else {
    packingTips.push(
      "Use all available pockets and compartments",
      "Pack similar items together",
      "Keep essentials in easy-to-access areas"
    );
    alternatives.push(
      "Pack one nice outfit that works for multiple occasions",
      "Bring versatile shoes that work for multiple activities"
    );
  }
  
  return {
    spaceUtilization,
    packingTips,
    alternatives
  };
}

function generatePackingSummary(tripContext: TripContext, dailyRecommendations: DailyClothingRecommendation[]): string {
  const destination = tripContext.destination;
  const duration = tripContext.duration;
  const activities = Array.from(new Set(dailyRecommendations.flatMap(day => day.activities)));
  const weatherConditions = Array.from(new Set(dailyRecommendations.map(day => day.weather.condition)));
  
  return `Optimized packing list for ${duration}-day trip to ${destination}. ` +
         `Weather conditions: ${weatherConditions.join(', ')}. ` +
         `Activities planned: ${activities.length > 0 ? activities.join(', ') : 'leisure activities'}. ` +
         `Pack versatile, weather-appropriate items that can be mixed and matched for different occasions.`;
}