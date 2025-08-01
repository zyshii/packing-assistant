import { type WeatherForecast } from "@shared/schema";

export class WeatherApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

// Fetch weather data for a location and date range
export const fetchWeatherForecast = async (
  location: string,
  startDate: string,
  endDate: string,
  useCache = true
): Promise<WeatherForecast> => {
  try {
    const params = new URLSearchParams({
      location,
      startDate,
      endDate,
      useCache: useCache.toString()
    });
    
    const response = await fetch(`/api/weather?${params}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new WeatherApiError(
        errorData.error || `Weather API request failed with status ${response.status}`,
        response.status
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    
    console.error('Weather API error:', error);
    throw new WeatherApiError('Failed to fetch weather data');
  }
};

// Get cached weather data for a location
export const getCachedWeatherData = async (
  location: string,
  startDate: string,
  endDate: string
) => {
  try {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await fetch(`/api/weather/cache/${encodeURIComponent(location)}?${params}`);
    
    if (!response.ok) {
      throw new WeatherApiError(`Cache API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch cached weather data:', error);
    return { cached: [] };
  }
};

// Convert dates to YYYY-MM-DD format
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate date range from start to end date
export const generateDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(formatDateForApi(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};