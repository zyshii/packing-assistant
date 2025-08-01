import { type TripContext } from "@shared/schema";

export interface DailyClothingRecommendation {
  date: string;
  activities: string[];
  weather: {
    condition: string;
    temperatureHigh: number;
    temperatureLow: number;
    uvIndex?: number;
    precipitation: number;
  };
  recommendations: {
    morning: string[];
    daytime: string[];
    evening: string[];
    activitySpecific: string[];
  };
  priorities: string[];
}

export interface PackingListOptimization {
  optimizedList: {
    tops: PackingItem[];
    bottoms: PackingItem[];
    outerwear: PackingItem[];
    footwear: PackingItem[];
    accessories: PackingItem[];
    essentials: PackingItem[];
  };
  luggageOptimization: {
    spaceUtilization: number;
    packingTips: string[];
    alternatives: string[];
  };
  summary: string;
}

export interface PackingItem {
  item: string;
  quantity: number;
  priority: "essential" | "recommended" | "optional";
  reason: string;
}

class AiRecommendationApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AiRecommendationApiError';
  }
}

async function makeApiRequest<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AiRecommendationApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AiRecommendationApiError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new AiRecommendationApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

export async function fetchDailyRecommendations(
  tripContext: TripContext,
  includeActivitySpecific: boolean = true
): Promise<DailyClothingRecommendation[]> {
  const response = await makeApiRequest<{ dailyRecommendations: DailyClothingRecommendation[] }>(
    '/api/recommendations/daily',
    {
      tripContext,
      includeActivitySpecific
    }
  );
  
  return response.dailyRecommendations;
}

export async function fetchPackingOptimization(
  tripContext: TripContext,
  dailyRecommendations: DailyClothingRecommendation[]
): Promise<PackingListOptimization> {
  const response = await makeApiRequest<{ packingOptimization: PackingListOptimization }>(
    '/api/recommendations/packing',
    {
      tripContext,
      dailyRecommendations
    }
  );
  
  return response.packingOptimization;
}

export async function fetchActivityRecommendations(
  activities: string[],
  weather: {
    condition: string;
    temperatureHigh: number;
    temperatureLow: number;
    uvIndex?: number;
    precipitation: number;
  },
  destination: string
): Promise<string[]> {
  const response = await makeApiRequest<{ activityRecommendations: string[] }>(
    '/api/recommendations/activity',
    {
      activities,
      weather,
      destination
    }
  );
  
  return response.activityRecommendations;
}

export { AiRecommendationApiError };