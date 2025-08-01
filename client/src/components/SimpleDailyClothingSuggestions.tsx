import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt } from "lucide-react";

interface DailyData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'mixed' | 'rainy' | 'snowy';
  temp: {
    high: number;
    low: number;
  };
  uvIndex?: number;
  precipitation?: number;
  activities: string[];
}

interface TripDetails {
  destination: string;
  duration: number;
  luggageSize?: string;
  tripTypes?: string[];
}

interface SimpleDailyClothingSuggestionsProps {
  dailyData: DailyData[];
  tripDetails: TripDetails;
  isWeatherDataReal: boolean;
}

export default function SimpleDailyClothingSuggestions({ dailyData, tripDetails, isWeatherDataReal }: SimpleDailyClothingSuggestionsProps) {
  console.log('🔧 SimpleDailyClothingSuggestions RENDER:', { 
    id: Math.random().toString(36).substring(7),
    dailyDataLength: dailyData.length, 
    firstDate: dailyData[0]?.date, 
    conditions: dailyData.map(d => d.condition),
    timestamp: new Date().toISOString()
  });

  if (!dailyData || dailyData.length === 0) {
    return <div>Loading simple suggestions...</div>;
  }

  return (
    <div style={{ border: '3px solid red', margin: '20px', padding: '20px', backgroundColor: 'yellow' }}>
      <h1 style={{ fontSize: '24px', color: 'black', fontWeight: 'bold' }}>
        TEST COMPONENT - SHOULD APPEAR ONLY ONCE
      </h1>
      <p style={{ fontSize: '16px', color: 'black', margin: '10px 0' }}>
        Component ID: {Math.random().toString(36).substring(7)}
      </p>
      <p style={{ fontSize: '16px', color: 'black', margin: '10px 0' }}>
        Render Time: {new Date().toISOString()}
      </p>
      <p style={{ fontSize: '16px', color: 'black', margin: '10px 0' }}>
        Daily Data Length: {dailyData.length}
      </p>
      <p style={{ fontSize: '16px', color: 'black', margin: '10px 0' }}>
        First Date: {dailyData[0]?.date || 'No date'}
      </p>
      <p style={{ fontSize: '16px', color: 'black', margin: '10px 0' }}>
        Weather Data Real: {isWeatherDataReal ? 'YES' : 'NO'}
      </p>
      {dailyData.map((day, index) => (
        <div key={index} style={{ border: '1px solid black', margin: '5px', padding: '10px', backgroundColor: 'white' }}>
          <strong>{day.date}</strong> - {day.condition} - {day.temp.high}°F/{day.temp.low}°F
        </div>
      ))}
    </div>
  );
}