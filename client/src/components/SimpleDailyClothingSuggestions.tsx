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
    <div className="space-y-6">
      <Card className="p-6 shadow-card border-0 bg-card">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Simple Daily Clothing Test
            </h3>
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
          
          <div className="space-y-4">
            {dailyData.map((day, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-medium text-foreground">{day.date}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {day.temp.high}°F / {day.temp.low}°F
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {day.condition}
                  </Badge>
                  {day.activities && day.activities.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-success-light text-success border-success/30">
                      {day.activities.length} activities
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Weather: {day.condition}, UV: {day.uvIndex?.toFixed(1) || 'N/A'}, 
                  Rain: {day.precipitation?.toFixed(1) || '0'}mm
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}