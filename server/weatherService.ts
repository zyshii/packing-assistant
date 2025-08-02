import { type WeatherForecast, type InsertWeather } from "@shared/schema";
import { storage } from "./storage";

// Weather code mapping for Open-Meteo API with precipitation context
const getWeatherCondition = (weatherCode: number, precipitationSum: number = 0): string => {
  // Clear sky
  if (weatherCode === 0) return 'sunny';
  
  // Partly cloudy, overcast
  if (weatherCode >= 1 && weatherCode <= 3) return 'cloudy';
  
  // Fog and depositing rime fog
  if (weatherCode >= 45 && weatherCode <= 48) return 'cloudy';
  
  // Light drizzle/rain - consider precipitation amount
  if (weatherCode === 51 || weatherCode === 53) {
    // If very light precipitation (<= 1mm), treat as sunny/mixed
    return precipitationSum <= 1.0 ? 'sunny' : 'mixed';
  }
  
  // Moderate to heavy drizzle/rain
  if (weatherCode >= 55 && weatherCode <= 67) return 'rainy';
  
  // Snow
  if (weatherCode >= 71 && weatherCode <= 77) return 'snowy';
  
  // Rain showers
  if (weatherCode >= 80 && weatherCode <= 82) return 'rainy';
  
  // Thunderstorm
  if (weatherCode >= 95 && weatherCode <= 99) return 'rainy';
  
  return 'mixed';
};

// Location normalization - remove country suffixes and state abbreviations for geocoding
const normalizeLocationName = (location: string): string => {
  return location
    // Remove country suffixes
    .replace(/, USA$/, '')
    .replace(/, United States$/, '')
    .replace(/, UK$/, '')
    .replace(/, England$/, '')
    .replace(/, France$/, '')
    .replace(/, Germany$/, '')
    .replace(/, Japan$/, '')
    .replace(/, Italy$/, '')
    .replace(/, Spain$/, '')
    .replace(/, Canada$/, '')
    .replace(/, Australia$/, '')
    .replace(/, Netherlands$/, '')
    .replace(/, Switzerland$/, '')
    .replace(/, Austria$/, '')
    .replace(/, Belgium$/, '')
    .replace(/, Norway$/, '')
    .replace(/, Sweden$/, '')
    .replace(/, Denmark$/, '')
    .replace(/, Finland$/, '')
    .replace(/, Poland$/, '')
    .replace(/, Czech Republic$/, '')
    .replace(/, Hungary$/, '')
    .replace(/, Portugal$/, '')
    .replace(/, Greece$/, '')
    .replace(/, Turkey$/, '')
    .replace(/, UAE$/, '')
    .replace(/, Thailand$/, '')
    .replace(/, Indonesia$/, '')
    .replace(/, South Korea$/, '')
    .replace(/, Mexico$/, '')
    .replace(/, Brazil$/, '')
    .replace(/, Argentina$/, '')
    .replace(/, South Africa$/, '')
    .replace(/, Morocco$/, '')
    .replace(/, Egypt$/, '')
    .replace(/, India$/, '')
    .replace(/, China$/, '')
    .replace(/, Iceland$/, '')
    .replace(/, Croatia$/, '')
    // Remove US state abbreviations for geocoding (but keep for display)
    .replace(/, [A-Z]{2}$/, '')
    .trim();
};

// Special location mappings for common destinations that need specific search terms
const locationMappings: Record<string, string> = {
  'New York': 'New York City',
  'San Francisco': 'San Francisco',
  'Los Angeles': 'Los Angeles',
  'Washington DC': 'Washington',
  'Key West': 'Key West Florida',
  'Napa Valley': 'Napa California',
  'Grand Canyon': 'Grand Canyon Village Arizona',
  'Yellowstone': 'Yellowstone National Park Wyoming',
  'Maldives': 'Male Maldives',
  'Fiji': 'Suva Fiji',
  'Bali': 'Denpasar Bali',
  'Phuket': 'Phuket Thailand',
  'Santorini': 'Thira Greece',
  'Dubrovnik': 'Dubrovnik Croatia',
  'Reykjavik': 'Reykjavik Iceland'
};

// Geocoding service to get coordinates from location name
const getCoordinates = async (location: string): Promise<{ latitude: number; longitude: number }> => {
  try {
    // Normalize the location name
    const normalizedLocation = normalizeLocationName(location);
    
    // Check if we have a special mapping for this location
    const searchTerm = locationMappings[normalizedLocation] || normalizedLocation;
    
    console.log(`Geocoding location: "${location}" -> normalized: "${normalizedLocation}" -> search: "${searchTerm}"`);
    
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=1&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      // If first attempt fails, try multiple fallback strategies
      const fallbackAttempts = [];
      
      // Strategy 1: Try with just the city name (remove state/province)
      const cityOnly = searchTerm.split(',')[0].trim();
      if (cityOnly !== searchTerm) {
        fallbackAttempts.push(cityOnly);
      }
      
      // Strategy 2: For national parks and special locations, try alternative search terms
      const locationLower = normalizedLocation.toLowerCase();
      if (locationLower.includes('yellowstone')) {
        fallbackAttempts.push('Yellowstone National Park', 'West Yellowstone Montana', 'Mammoth Hot Springs Wyoming');
      } else if (locationLower.includes('grand canyon')) {
        fallbackAttempts.push('Grand Canyon Village', 'Grand Canyon Arizona');
      } else if (locationLower.includes('yosemite')) {
        fallbackAttempts.push('Yosemite National Park', 'Yosemite Valley California');
      } else if (locationLower.includes('zion')) {
        fallbackAttempts.push('Zion National Park', 'Springdale Utah');
      }
      
      // Try each fallback attempt
      for (const attempt of fallbackAttempts) {
        console.log(`Retrying geocoding with: "${attempt}"`);
        
        try {
          const retryResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(attempt)}&count=1&language=en&format=json`
          );
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            if (retryData.results && retryData.results.length > 0) {
              console.log(`Successfully found coordinates for "${attempt}"`);
              return {
                latitude: retryData.results[0].latitude,
                longitude: retryData.results[0].longitude
              };
            }
          }
        } catch (retryError) {
          console.log(`Retry attempt "${attempt}" failed:`, retryError);
          continue;
        }
      }
      
      throw new Error(`Location not found: ${location}`);
    }
    
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to get coordinates for ${location}`);
  }
};

// Fetch weather data from Open-Meteo API
const fetchWeatherFromAPI = async (
  latitude: number, 
  longitude: number, 
  startDate: string, 
  endDate: string
): Promise<any> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,weather_code&start_date=${startDate}&end_date=${endDate}&timezone=auto`;
    
    console.log(`Weather API call: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Weather API error: ${response.status} - ${errorText}`);
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data from API');
  }
};

// Convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const getWeatherForecast = async (
  location: string,
  startDate: string,
  endDate: string,
  useCache = true
): Promise<WeatherForecast> => {
  try {
    // Check cache first if enabled
    if (useCache) {
      const cachedWeather = await storage.getCachedWeatherData(location, startDate, endDate);
      
      // Check if we have complete cached data for the date range
      const requestedDates = generateDateRange(startDate, endDate);
      const cachedDates = cachedWeather.map(w => w.date);
      const hasAllDates = requestedDates.every(date => cachedDates.includes(date));
      
      if (hasAllDates && cachedWeather.length > 0) {
        // Check if cache is still fresh (less than 6 hours old)
        const latestCache = cachedWeather.reduce((latest, current) => {
          return new Date(current.cached_at!) > new Date(latest.cached_at!) ? current : latest;
        });
        
        const cacheAge = Date.now() - new Date(latestCache.cached_at!).getTime();
        const sixHours = 6 * 60 * 60 * 1000;
        
        if (cacheAge < sixHours) {
          return {
            location,
            latitude: cachedWeather[0].latitude,
            longitude: cachedWeather[0].longitude,
            daily: cachedWeather.map(w => ({
              date: w.date,
              temperatureHigh: w.temperatureHigh,
              temperatureLow: w.temperatureLow,
              uvIndex: w.uvIndex || 0,
              precipitationSum: w.precipitationSum,
              weatherCode: w.weatherCode,
              condition: w.condition
            }))
          };
        }
      }
    }

    // Get coordinates for the location
    const { latitude, longitude } = await getCoordinates(location);
    
    // Fetch fresh weather data from API
    const weatherData = await fetchWeatherFromAPI(latitude, longitude, startDate, endDate);
    
    if (!weatherData.daily) {
      throw new Error('Invalid weather data received from API');
    }
    
    // Process and convert the data
    const dailyWeather = weatherData.daily.time.map((date: string, index: number) => {
      const tempHigh = celsiusToFahrenheit(weatherData.daily.temperature_2m_max[index]);
      const tempLow = celsiusToFahrenheit(weatherData.daily.temperature_2m_min[index]);
      const precipitation = weatherData.daily.precipitation_sum[index] || 0;
      const uvIndex = weatherData.daily.uv_index_max[index] || 0;
      const weatherCode = weatherData.daily.weather_code[index];
      const condition = getWeatherCondition(weatherCode, precipitation);
      
      return {
        date,
        temperatureHigh: Math.round(tempHigh),
        temperatureLow: Math.round(tempLow),
        uvIndex,
        precipitationSum: precipitation,
        weatherCode,
        condition
      };
    });
    
    // Save to cache
    const weatherToCache: InsertWeather[] = dailyWeather.map((day: any) => ({
      location,
      latitude,
      longitude,
      date: day.date,
      temperatureHigh: day.temperatureHigh,
      temperatureLow: day.temperatureLow,
      uvIndex: day.uvIndex,
      precipitationSum: day.precipitationSum,
      weatherCode: day.weatherCode,
      condition: day.condition
    }));
    
    try {
      await storage.saveMultipleWeatherData(weatherToCache);
    } catch (cacheError) {
      console.warn('Failed to cache weather data:', cacheError);
      // Continue without caching - don't fail the whole request
    }
    
    return {
      location,
      latitude,
      longitude,
      daily: dailyWeather
    };
    
  } catch (error) {
    console.error('Weather service error:', error);
    throw new Error(`Failed to get weather forecast: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to generate date range
const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};