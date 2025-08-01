// Smart recommendation engine using weighted datasets instead of AI
import { z } from "zod";

interface WeatherCondition {
  condition: string;
  temp: { high: number; low: number };
  uvIndex?: number;
  precipitation: number;
}

interface ActivityContext {
  activities: string[];
  timeOfDay: 'morning' | 'daytime' | 'evening';
}

interface TripContext {
  destination: string;
  duration: number;
  tripTypes: string[];
  luggageSize: string;
}

// Comprehensive clothing database with weights
const clothingDatabase = {
  tops: [
    { item: "Short-sleeve T-shirts", baseWeight: 10, weather: { hot: 3, mild: 2, cold: 0 }, activities: { casual: 3, business: 1, sports: 3 }, priority: "essential" },
    { item: "Long-sleeve shirts", baseWeight: 8, weather: { hot: 0, mild: 3, cold: 3 }, activities: { casual: 2, business: 3, sports: 2 }, priority: "recommended" },
    { item: "Tank tops/sleeveless shirts", baseWeight: 6, weather: { hot: 3, mild: 1, cold: 0 }, activities: { casual: 2, sports: 3, beach: 3 }, priority: "optional" },
    { item: "Breathable/moisture-wicking shirts", baseWeight: 7, weather: { hot: 3, mild: 2, cold: 1 }, activities: { sports: 4, hiking: 4, running: 4 }, priority: "recommended" },
    { item: "Business shirts/blouses", baseWeight: 5, weather: { hot: 1, mild: 2, cold: 2 }, activities: { business: 4, formal: 4, dining: 2 }, priority: "conditional" },
    { item: "Light sweater/hoodie", baseWeight: 6, weather: { hot: 0, mild: 2, cold: 3 }, activities: { casual: 2, evening: 3 }, priority: "recommended" },
    { item: "Thermal base layers", baseWeight: 4, weather: { hot: 0, mild: 0, cold: 4 }, activities: { skiing: 4, winter: 4, outdoor: 3 }, priority: "conditional" }
  ],
  bottoms: [
    { item: "Comfortable jeans/pants", baseWeight: 8, weather: { hot: 1, mild: 3, cold: 3 }, activities: { casual: 3, business: 2, travel: 3 }, priority: "essential" },
    { item: "Shorts/lightweight trousers", baseWeight: 7, weather: { hot: 4, mild: 2, cold: 0 }, activities: { casual: 3, sports: 3, beach: 4 }, priority: "recommended" },
    { item: "Dress pants/skirts", baseWeight: 5, weather: { hot: 1, mild: 2, cold: 2 }, activities: { business: 4, formal: 4, dining: 3 }, priority: "conditional" },
    { item: "Athletic/yoga pants", baseWeight: 6, weather: { hot: 2, mild: 3, cold: 2 }, activities: { sports: 4, yoga: 4, running: 4, hiking: 3 }, priority: "conditional" },
    { item: "Swimwear", baseWeight: 3, weather: { hot: 3, mild: 1, cold: 0 }, activities: { swimming: 4, beach: 4, "water sports": 4, spa: 2 }, priority: "conditional" },
    { item: "Thermal leggings/long underwear", baseWeight: 3, weather: { hot: 0, mild: 0, cold: 4 }, activities: { skiing: 4, winter: 4, cold: 4 }, priority: "conditional" }
  ],
  outerwear: [
    { item: "Light jacket/cardigan", baseWeight: 7, weather: { hot: 0, mild: 3, cold: 2 }, activities: { casual: 2, evening: 3, travel: 2 }, priority: "recommended" },
    { item: "Rain jacket", baseWeight: 5, weather: { rainy: 4, mixed: 3 }, activities: { outdoor: 3, hiking: 3, travel: 2 }, priority: "conditional" },
    { item: "Winter coat/parka", baseWeight: 4, weather: { hot: 0, mild: 0, cold: 4 }, activities: { winter: 4, skiing: 3, cold: 4 }, priority: "conditional" },
    { item: "Blazer/suit jacket", baseWeight: 4, weather: { hot: 1, mild: 2, cold: 2 }, activities: { business: 4, formal: 4, dining: 2 }, priority: "conditional" },
    { item: "Windbreaker", baseWeight: 5, weather: { windy: 3, mild: 2 }, activities: { hiking: 3, outdoor: 3, sports: 2 }, priority: "optional" }
  ],
  footwear: [
    { item: "Comfortable walking shoes", baseWeight: 9, weather: { all: 2 }, activities: { casual: 3, travel: 4, sightseeing: 4 }, priority: "essential" },
    { item: "Athletic/running shoes", baseWeight: 7, weather: { all: 2 }, activities: { sports: 4, running: 4, gym: 4, hiking: 2 }, priority: "recommended" },
    { item: "Sandals/flip-flops", baseWeight: 6, weather: { hot: 3, mild: 2, cold: 0 }, activities: { beach: 4, swimming: 3, casual: 2, spa: 3 }, priority: "recommended" },
    { item: "Formal shoes", baseWeight: 5, weather: { all: 1 }, activities: { business: 4, formal: 4, dining: 3 }, priority: "conditional" },
    { item: "Hiking boots", baseWeight: 5, weather: { all: 2 }, activities: { hiking: 4, outdoor: 4, adventure: 3 }, priority: "conditional" },
    { item: "Waterproof shoes", baseWeight: 4, weather: { rainy: 4, mixed: 3, snow: 3 }, activities: { outdoor: 3, hiking: 3 }, priority: "conditional" }
  ],
  accessories: [
    { item: "Sunglasses", baseWeight: 8, weather: { sunny: 4, hot: 3 }, activities: { outdoor: 3, beach: 4, driving: 3 }, priority: "essential" },
    { item: "Hat/cap", baseWeight: 7, weather: { sunny: 3, hot: 4 }, activities: { outdoor: 3, sports: 2, beach: 3 }, priority: "recommended" },
    { item: "Sunscreen (SPF 30+)", baseWeight: 8, weather: { sunny: 4, hot: 4 }, activities: { outdoor: 4, beach: 4, sports: 3 }, priority: "essential" },
    { item: "Umbrella", baseWeight: 5, weather: { rainy: 4, mixed: 3 }, activities: { travel: 2, business: 2 }, priority: "conditional" },
    { item: "Gloves", baseWeight: 4, weather: { cold: 4, winter: 4 }, activities: { winter: 4, skiing: 4, outdoor: 2 }, priority: "conditional" },
    { item: "Scarf/neck warmer", baseWeight: 4, weather: { cold: 3, winter: 4 }, activities: { winter: 3, formal: 2 }, priority: "conditional" },
    { item: "Belt", baseWeight: 6, weather: { all: 1 }, activities: { business: 3, formal: 3, casual: 2 }, priority: "recommended" },
    { item: "Watch", baseWeight: 5, weather: { all: 1 }, activities: { business: 3, formal: 2, travel: 2 }, priority: "optional" }
  ],
  essentials: [
    { item: "Undergarments", baseWeight: 10, weather: { all: 2 }, activities: { all: 4 }, priority: "essential" },
    { item: "Socks", baseWeight: 10, weather: { all: 2 }, activities: { all: 4 }, priority: "essential" },
    { item: "Sleepwear/pajamas", baseWeight: 8, weather: { all: 2 }, activities: { all: 3 }, priority: "essential" },
    { item: "Travel documents", baseWeight: 10, weather: { all: 1 }, activities: { travel: 4 }, priority: "essential" },
    { item: "Phone charger", baseWeight: 9, weather: { all: 1 }, activities: { all: 4 }, priority: "essential" },
    { item: "Personal medications", baseWeight: 8, weather: { all: 1 }, activities: { all: 4 }, priority: "essential" },
    { item: "Toiletries", baseWeight: 9, weather: { all: 2 }, activities: { all: 4 }, priority: "essential" }
  ]
};

// Activity-specific gear database
const activityGearDatabase = {
  swimming: [
    { item: "Swimwear", weight: 10, timeSpecific: false },
    { item: "Beach towel", weight: 8, timeSpecific: false },
    { item: "Waterproof sunscreen", weight: 9, timeSpecific: false },
    { item: "Flip-flops/water shoes", weight: 7, timeSpecific: false },
    { item: "Swim goggles", weight: 5, timeSpecific: false }
  ],
  business: [
    { item: "Business attire", weight: 10, timeSpecific: false },
    { item: "Formal shoes", weight: 9, timeSpecific: false },
    { item: "Belt", weight: 7, timeSpecific: false },
    { item: "Blazer/suit jacket", weight: 8, timeSpecific: false },
    { item: "Business accessories", weight: 6, timeSpecific: false }
  ],
  hiking: [
    { item: "Hiking boots", weight: 10, timeSpecific: false },
    { item: "Moisture-wicking clothing", weight: 9, timeSpecific: false },
    { item: "Backpack", weight: 8, timeSpecific: false },
    { item: "Water bottle", weight: 9, timeSpecific: false },
    { item: "Hat with UV protection", weight: 7, timeSpecific: false }
  ],
  dining: [
    { item: "Smart casual attire", weight: 8, timeSpecific: true, period: "evening" },
    { item: "Nice shoes", weight: 7, timeSpecific: true, period: "evening" },
    { item: "Light jacket", weight: 6, timeSpecific: true, period: "evening" }
  ]
};

// Weather condition mapping
function getWeatherCategory(condition: string, temp: { high: number; low: number }): string {
  if (temp.high >= 80) return "hot";
  if (temp.high >= 65) return "mild";
  if (temp.high < 50) return "cold";
  return "mild";
}

// Activity categorization
function categorizeActivity(activity: string): string[] {
  const categories = [];
  const activityLower = activity.toLowerCase();
  
  if (activityLower.includes("swim") || activityLower.includes("beach") || activityLower.includes("water")) {
    categories.push("swimming", "beach");
  }
  if (activityLower.includes("business") || activityLower.includes("meeting") || activityLower.includes("conference")) {
    categories.push("business", "formal");
  }
  if (activityLower.includes("hik") || activityLower.includes("outdoor") || activityLower.includes("nature")) {
    categories.push("hiking", "outdoor", "sports");
  }
  if (activityLower.includes("run") || activityLower.includes("gym") || activityLower.includes("sport")) {
    categories.push("sports", "running");
  }
  if (activityLower.includes("din") || activityLower.includes("restaurant")) {
    categories.push("dining", "formal");
  }
  if (activityLower.includes("sight") || activityLower.includes("museum")) {
    categories.push("casual", "travel");
  }
  
  if (categories.length === 0) {
    categories.push("casual");
  }
  
  return categories;
}

// Calculate item score based on context
function calculateItemScore(
  item: any,
  weather: WeatherCondition,
  activities: string[],
  tripContext: TripContext
): number {
  let score = item.baseWeight;
  
  // Weather-based filtering - reject inappropriate items
  const avgTemp = (weather.temp.high + weather.temp.low) / 2;
  
  // Filter out inappropriate items for hot weather
  if (avgTemp > 80) {
    if (item.item.includes("gloves") || item.item.includes("thermal") || 
        item.item.includes("winter coat") || item.item.includes("scarf")) {
      return 0; // Don't recommend winter items in hot weather
    }
  }
  
  // Filter out inappropriate items for warm weather (summer)
  if (avgTemp > 70) {
    if (item.item.includes("thermal") || item.item.includes("winter")) {
      return 0;
    }
  }
  
  // Filter out cold weather items if it never gets cold
  if (weather.temp.low > 65) {
    if (item.item.includes("thermal") || item.item.includes("gloves") || 
        item.item.includes("winter coat") || item.item.includes("scarf")) {
      return 0;
    }
  }
  
  // Weather scoring for appropriate items
  const weatherCategory = getWeatherCategory(weather.condition, weather.temp);
  if (item.weather[weatherCategory]) {
    score += item.weather[weatherCategory] * 2;
  }
  if (item.weather[weather.condition]) {
    score += item.weather[weather.condition] * 2;
  }
  if (item.weather.all) {
    score += item.weather.all;
  }
  
  // Activity scoring
  const activityCategories = activities.flatMap(categorizeActivity);
  for (const category of activityCategories) {
    if (item.activities[category]) {
      score += item.activities[category] * 1.5;
    }
  }
  if (item.activities.all) {
    score += item.activities.all;
  }
  
  // Trip type scoring
  for (const tripType of tripContext.tripTypes) {
    if (item.activities[tripType]) {
      score += item.activities[tripType];
    }
  }
  
  // UV index boost for sun protection
  if (weather.uvIndex && weather.uvIndex > 6) {
    if (item.item.includes("sunscreen") || item.item.includes("sunglasses") || item.item.includes("hat")) {
      score += 3;
    }
  }
  
  // Precipitation boost for waterproof items
  if (weather.precipitation > 0) {
    if (item.item.includes("rain") || item.item.includes("waterproof") || item.item.includes("umbrella")) {
      score += weather.precipitation > 5 ? 4 : 2;
    }
  }
  
  return Math.max(0, score);
}

// Generate luggage-optimized quantities
function getOptimizedQuantity(
  item: any,
  score: number,
  tripContext: TripContext,
  category: string
): number {
  // Smart luggage constraints
  const luggageConstraints = {
    "carry-on": { maxItems: 3, maxTotalItems: 25 },
    "checked": { maxItems: 5, maxTotalItems: 45 }
  };
  
  const constraints = luggageConstraints[tripContext.luggageSize as keyof typeof luggageConstraints] || luggageConstraints.checked;
  
  // Essential items for carry-on optimization
  if (category === "essentials") {
    if (item.item === "Undergarments" || item.item === "Socks") {
      return tripContext.duration + 1; // Always trip duration + 1 for essentials
    }
    return 1; // Other essentials just need 1
  }
  
  // Strict footwear limits
  if (category === "footwear") {
    if (tripContext.luggageSize === "carry-on") {
      return score > 18 ? 2 : 1; // Very selective for carry-on
    }
    return score > 15 ? 2 : 1; // Max 2 pairs even for checked
  }
  
  // Optimized clothing quantities for carry-on
  if (category === "tops") {
    if (tripContext.luggageSize === "carry-on") {
      if (item.priority === "essential") {
        return Math.min(Math.ceil(tripContext.duration * 0.8), 3); // Reduced for carry-on
      }
      return score > 18 ? 2 : 1; // Higher threshold for carry-on
    }
    // Checked luggage
    if (item.priority === "essential") {
      return Math.min(tripContext.duration, 4);
    }
    return score > 15 ? 2 : 1;
  }
  
  if (category === "bottoms") {
    if (tripContext.luggageSize === "carry-on") {
      return Math.min(2, Math.ceil(tripContext.duration / 2)); // Max 2 for carry-on
    }
    return Math.min(3, Math.ceil(tripContext.duration / 2) + 1);
  }
  
  if (category === "outerwear") {
    return score > 25 ? 2 : 1; // Higher threshold
  }
  
  if (category === "accessories") {
    return score > 25 ? 2 : 1; // Higher threshold
  }
  
  return 1;
}

// Generate detailed daily recommendations
export function generateDetailedDailyRecommendations(
  dailyData: Array<{
    date: string;
    condition: string;
    temp: { high: number; low: number };
    uvIndex?: number;
    precipitation: number;
    activities: string[];
  }>,
  tripContext: TripContext
) {
  return dailyData.map(day => {
    const weather: WeatherCondition = {
      condition: day.condition,
      temp: day.temp,
      uvIndex: day.uvIndex,
      precipitation: day.precipitation
    };
    
    const timeSpecificRecommendations = {
      morning: generateTimeSpecificRecommendations("morning", weather, day.activities),
      daytime: generateTimeSpecificRecommendations("daytime", weather, day.activities),
      evening: generateTimeSpecificRecommendations("evening", weather, day.activities)
    };
    
    const activitySpecific = generateActivitySpecificRecommendations(day.activities, weather);
    const priorities = generatePriorities(weather, day.activities);
    
    return {
      date: day.date,
      weather,
      activities: day.activities,
      recommendations: {
        ...timeSpecificRecommendations,
        activitySpecific
      },
      priorities,
      weatherDetails: {
        condition: day.condition,
        temperatureRange: `${day.temp.low}°-${day.temp.high}°F`,
        uvIndex: day.uvIndex ? `UV ${day.uvIndex}` : undefined,
        precipitation: day.precipitation > 0 ? `${day.precipitation}mm rain` : "No rain",
        tips: generateWeatherTips(weather)
      }
    };
  });
}

function generateTimeSpecificRecommendations(
  timeOfDay: string,
  weather: WeatherCondition,
  activities: string[]
): string[] {
  const recommendations = [];
  
  // Morning base layer recommendations (always provide something)
  if (timeOfDay === "morning") {
    if (weather.temp.low < 50) {
      recommendations.push("Warm sweater or fleece");
      recommendations.push("Long pants or jeans");
      recommendations.push("Closed-toe shoes");
    } else if (weather.temp.low < 65) {
      recommendations.push("Light sweater or cardigan");
      recommendations.push("Long pants or comfortable jeans");
      recommendations.push("Comfortable walking shoes");
    } else {
      recommendations.push("Light T-shirt or casual top");
      recommendations.push("Comfortable pants or light jeans");
      recommendations.push("Comfortable walking shoes");
    }
  }
  
  if (timeOfDay === "daytime" && weather.temp.high > 75) {
    recommendations.push("Lightweight, breathable fabrics");
    recommendations.push("Short sleeves or tank tops");
    if (weather.uvIndex && weather.uvIndex > 6) {
      recommendations.push("Sun hat and sunglasses");
      recommendations.push("SPF 30+ sunscreen");
    }
  }
  
  if (timeOfDay === "evening") {
    if (weather.temp.low < 65) {
      recommendations.push("Light jacket for cooling evening");
    }
    // Check for evening activities
    const hasEveningDining = activities.some(a => a.toLowerCase().includes("din"));
    if (hasEveningDining) {
      recommendations.push("Smart casual attire for dining");
    }
  }
  
  // Weather condition specific
  if (weather.precipitation > 0) {
    recommendations.push("Waterproof layer or umbrella");
    recommendations.push("Quick-dry clothing");
  }
  
  return recommendations;
}

function generateActivitySpecificRecommendations(activities: string[], weather: WeatherCondition): string[] {
  const recommendations = [];
  
  for (const activity of activities) {
    const activityLower = activity.toLowerCase();
    
    if (activityLower.includes("swim") || activityLower.includes("beach")) {
      recommendations.push("Swimwear and beach towel");
      recommendations.push("Waterproof sunscreen SPF 50+");
      recommendations.push("Beach sandals or water shoes");
    }
    
    if (activityLower.includes("business") || activityLower.includes("meeting")) {
      recommendations.push("Professional business attire");
      recommendations.push("Formal shoes and belt");
      recommendations.push("Blazer or suit jacket");
    }
    
    if (activityLower.includes("hik") || activityLower.includes("outdoor")) {
      recommendations.push("Sturdy hiking boots");
      recommendations.push("Moisture-wicking clothing");
      recommendations.push("Day pack and water bottle");
    }
    
    if (activityLower.includes("run") || activityLower.includes("gym")) {
      recommendations.push("Athletic wear and sports shoes");
      recommendations.push("Moisture-wicking shirts");
      recommendations.push("Water bottle and towel");
    }
  }
  
  return Array.from(new Set(recommendations)); // Remove duplicates
}

function generatePriorities(weather: WeatherCondition, activities: string[]): string[] {
  const priorities = [];
  
  if (weather.uvIndex && weather.uvIndex > 7) {
    priorities.push("Sun protection is essential - hat, sunglasses, SPF 30+");
  }
  
  if (weather.precipitation > 5) {
    priorities.push("Waterproof gear required - rain jacket and umbrella");
  }
  
  if (weather.temp.high > 85) {
    priorities.push("Heat protection - lightweight, breathable fabrics only");
  }
  
  if (weather.temp.low < 45) {
    priorities.push("Warm layers essential - thermal base layers and insulation");
  }
  
  for (const activity of activities) {
    if (activity.toLowerCase().includes("swim")) {
      priorities.push("Swimming gear required for water activities");
    }
    if (activity.toLowerCase().includes("business")) {
      priorities.push("Professional attire required for business activities");
    }
    if (activity.toLowerCase().includes("hik")) {
      priorities.push("Proper hiking gear essential for safety");
    }
  }
  
  return priorities;
}

function generateWeatherTips(weather: WeatherCondition): string[] {
  const tips = [];
  
  if (weather.temp.high - weather.temp.low > 20) {
    tips.push("Large temperature variation - dress in layers");
  }
  
  if (weather.uvIndex && weather.uvIndex > 8) {
    tips.push("Very high UV - limit sun exposure during peak hours (10am-4pm)");
  }
  
  if (weather.precipitation > 0 && weather.temp.high > 70) {
    tips.push("Humid conditions expected - choose quick-dry fabrics");
  }
  
  return tips;
}

// Generate optimized packing list
export function generateOptimizedPackingList(
  dailyData: Array<{
    date: string;
    condition: string;
    temp: { high: number; low: number };
    uvIndex?: number;
    precipitation: number;
    activities: string[];
  }>,
  tripContext: TripContext
) {
  const allWeatherConditions = dailyData.map(day => ({
    condition: day.condition,
    temp: day.temp,
    uvIndex: day.uvIndex,
    precipitation: day.precipitation
  }));
  
  const allActivities = Array.from(new Set(dailyData.flatMap(day => day.activities)));
  
  const packingList: any = {
    tops: [],
    bottoms: [],
    outerwear: [],
    footwear: [],
    accessories: [],
    essentials: []
  };
  
  // Process each category
  for (const [category, items] of Object.entries(clothingDatabase)) {
    let categoryItems = [];
    
    for (const item of items) {
      let totalScore = 0;
      let relevantDays = 0;
      
      // Calculate average score across all days
      for (const weather of allWeatherConditions) {
        const dayScore = calculateItemScore(item, weather, allActivities, tripContext);
        if (dayScore > 8) { // Higher threshold for inclusion
          totalScore += dayScore;
          relevantDays++;
        }
      }
      
      if (relevantDays > 0) {
        const avgScore = totalScore / relevantDays;
        const quantity = getOptimizedQuantity(item, avgScore, tripContext, category);
        

        
        // Only include items with sufficient score and quantity
        if (quantity > 0 && avgScore > 10) {
          const finalQuantity = quantity; // Use calculated quantity directly
          

          
          categoryItems.push({
            item: item.item,
            quantity: finalQuantity,
            priority: item.priority,
            score: avgScore,
            reason: generateItemReason(item, allWeatherConditions, allActivities, tripContext)
          });
        }
      }
    }
    
    // Sort by score and limit items for carry-on
    categoryItems.sort((a, b) => b.score - a.score);
    
    // Apply category limits for carry-on
    if (tripContext.luggageSize === "carry-on") {
      const categoryLimits = {
        tops: 4,
        bottoms: 3,
        outerwear: 2,
        footwear: 2,
        accessories: 3,
        essentials: 6
      };
      const limit = categoryLimits[category as keyof typeof categoryLimits] || 5;
      categoryItems = categoryItems.slice(0, limit);
    }
    
    packingList[category] = categoryItems;
  }
  
  // Calculate luggage optimization
  const luggageOptimization = calculateLuggageOptimization(packingList, tripContext);
  
  return {
    optimizedList: packingList,
    luggageOptimization,
    summary: generatePackingSummary(packingList, tripContext, allActivities)
  };
}

function generateItemReason(
  item: any,
  weatherConditions: WeatherCondition[],
  activities: string[],
  tripContext: TripContext
): string {
  const reasons = [];
  
  // Weather reasons
  const hasHotWeather = weatherConditions.some(w => w.temp.high > 75);
  const hasColdWeather = weatherConditions.some(w => w.temp.low < 60);
  const hasRain = weatherConditions.some(w => w.precipitation > 0);
  const hasHighUV = weatherConditions.some(w => w.uvIndex && w.uvIndex > 6);
  
  if (hasHotWeather && item.weather.hot > 2) {
    reasons.push("hot weather protection");
  }
  if (hasColdWeather && item.weather.cold > 2) {
    reasons.push("cold weather comfort");
  }
  if (hasRain && (item.item.includes("rain") || item.item.includes("waterproof"))) {
    reasons.push("rain protection");
  }
  if (hasHighUV && (item.item.includes("sun") || item.item.includes("hat") || item.item.includes("glasses"))) {
    reasons.push("UV protection");
  }
  
  // Activity reasons
  const activityCategories = activities.flatMap(categorizeActivity);
  for (const category of activityCategories) {
    if (item.activities[category] > 2) {
      reasons.push(`${category} activities`);
    }
  }
  
  // Trip type reasons
  if (tripContext.tripTypes.includes("business") && item.activities.business > 2) {
    reasons.push("business requirements");
  }
  
  // Luggage reasons
  if (tripContext.luggageSize === "carry-on") {
    reasons.push("space-efficient choice");
  }
  
  return reasons.length > 0 ? `Essential for ${reasons.join(", ")}` : "Versatile item for your trip";
}

function calculateLuggageOptimization(packingList: any, tripContext: TripContext): any {
  const totalItems = Object.values(packingList).flat().length;
  const luggageCapacity = {
    "carry-on": 25,
    "standard": 40,
    "checked": 60
  };
  
  const capacity = luggageCapacity[tripContext.luggageSize as keyof typeof luggageCapacity] || 40;
  const spaceUtilization = Math.min(100, (totalItems / capacity) * 100);
  
  const packingTips = [];
  if (spaceUtilization > 85) {
    packingTips.push("Pack heavy items at bottom of luggage");
    packingTips.push("Roll clothes instead of folding to save space");
    packingTips.push("Use packing cubes for organization");
  }
  if (tripContext.luggageSize === "carry-on") {
    packingTips.push("Keep liquids under 100ml in clear bag");
    packingTips.push("Wear heaviest shoes and jacket while traveling");
  }
  
  const alternatives = [];
  if (spaceUtilization > 90) {
    alternatives.push("Consider checking a bag for more space");
    alternatives.push("Leave some items to buy at destination");
  }
  
  return {
    spaceUtilization,
    packingTips,
    alternatives
  };
}

function generatePackingSummary(packingList: any, tripContext: TripContext, activities: string[]): string {
  const totalItems = Object.values(packingList).flat().length;
  const hasSpecialActivities = activities.some(a => 
    a.toLowerCase().includes("swim") || 
    a.toLowerCase().includes("business") || 
    a.toLowerCase().includes("hik")
  );
  
  return `Optimized ${totalItems}-item packing list for your ${tripContext.duration}-day ${tripContext.tripTypes.join("/")} trip to ${tripContext.destination}. ${hasSpecialActivities ? "Includes specialized gear for your planned activities." : "Focused on versatile, weather-appropriate essentials."} Tailored for ${tripContext.luggageSize} luggage constraints.`;
}