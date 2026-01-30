import OpenAI from "openai";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Lazy initialize OpenAI client to allow server to start without API key
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is required to use AI-powered recommendations. Please set it in your environment variables."
      );
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

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
    const prompt = `Analyze this travel itinerary and provide detailed daily clothing recommendations:

Trip Details:
- Destination: ${tripContext.destination}
- Duration: ${tripContext.duration} days
- Trip Types: ${tripContext.tripTypes.join(', ')}
- Luggage Size: ${tripContext.luggageSize}

Daily Weather & Activities:
${tripContext.dailyData.map(day => `
Date: ${day.date}
Weather: ${day.condition}, High: ${day.temp.high}°F, Low: ${day.temp.low}°F${day.uvIndex ? `, UV: ${day.uvIndex}` : ''}, Precipitation: ${day.precipitation}mm
Activities: ${day.activities.length > 0 ? day.activities.join(', ') : 'No specific activities planned'}
`).join('')}

For each day, provide:
1. Morning clothing recommendations (consider temperature and planned activities)
2. Daytime clothing recommendations (peak temperature and main activities)
3. Evening clothing recommendations (temperature drop and evening activities)
4. Activity-specific gear (swimming gear for beach days, formal wear for business, hiking gear for outdoor activities)
5. Priority items that are absolutely essential for that day

Focus on practical, weather-appropriate clothing that matches the specific activities planned for each day. Be specific about items (e.g., "waterproof hiking boots" not just "shoes").

Respond with a JSON array containing one object per day.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional travel packing consultant with expertise in weather-appropriate clothing and activity-specific gear. Provide practical, detailed recommendations in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{"days": []}');
    
    // Validate and return the recommendations
    if (result.days && Array.isArray(result.days)) {
      return result.days.map((day: any) => dailyClothingRecommendationSchema.parse(day));
    }
    
    return [];
  } catch (error) {
    console.error("Error generating daily clothing recommendations:", error);
    throw new Error("Failed to generate agent-powered clothing recommendations");
  }
}

export async function optimizePackingList(
  tripContext: TripContext,
  dailyRecommendations: DailyClothingRecommendation[]
): Promise<PackingListOptimization> {
  try {
    const prompt = `Optimize a packing list for this trip based on daily clothing recommendations:

Trip Context:
- Destination: ${tripContext.destination}
- Duration: ${tripContext.duration} days
- Trip Types: ${tripContext.tripTypes.join(', ')}
- Luggage Size: ${tripContext.luggageSize}

Daily Recommendations Summary:
${dailyRecommendations.map(day => `
${day.date}: Activities: ${day.activities.join(', ')}
Weather: ${day.weather.condition} (${day.weather.temperatureLow}-${day.weather.temperatureHigh}°F)
Key Items: ${day.priorities.join(', ')}
`).join('')}

Create an optimized packing list that:
1. Consolidates similar items across days to minimize redundancy
2. Prioritizes items based on weather conditions and activities
3. Considers luggage size constraints (${tripContext.luggageSize})
4. Includes quantity recommendations based on trip duration
5. Provides space-saving alternatives where applicable

For each category (tops, bottoms, outerwear, footwear, accessories, essentials):
- List specific items with quantities
- Mark priority level (essential, recommended, optional)
- Explain why each item is needed

Also provide:
- Estimated luggage space utilization (0-100%)
- Packing tips for the specific luggage size
- Alternative items to save space if needed

Focus on versatile items that work for multiple activities and weather conditions.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional travel packing optimization expert. Create efficient, luggage-size-appropriate packing lists with detailed reasoning for each recommendation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return packingListOptimizationSchema.parse(result);
  } catch (error) {
    console.error("Error optimizing packing list:", error);
    throw new Error("Failed to generate agent-optimized packing list");
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

    const prompt = `Provide specific clothing and gear recommendations for these activities:

Activities: ${activities.join(', ')}
Weather: ${weather.condition}, ${weather.temperatureLow}-${weather.temperatureHigh}°F${weather.uvIndex ? `, UV: ${weather.uvIndex}` : ''}, ${weather.precipitation}mm precipitation
Location: ${destination}

For each activity, consider:
1. Safety requirements (UV protection, waterproofing, etc.)
2. Performance needs (breathability, flexibility, durability)
3. Weather conditions
4. Local customs or dress codes

Provide a list of specific items needed for optimal comfort and performance. Be practical and specific (e.g., "quick-dry swim shorts" not just "swimwear").

Respond with a JSON object containing an array of recommended items.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sports and activity gear specialist. Provide specific, practical recommendations for activity-appropriate clothing and equipment."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return Array.isArray(result.recommendations) ? result.recommendations : [];
  } catch (error) {
    console.error("Error getting activity-specific recommendations:", error);
    return [];
  }
}