import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react";

interface WeatherInfoProps {
  destination: string;
  forecast: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'mixed';
    temp: { high: number; low: number };
    humidity: number;
  };
}

export default function WeatherInfo({ destination, forecast }: WeatherInfoProps) {
  const getWeatherIcon = () => {
    switch (forecast.condition) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-travel-yellow" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-muted-foreground" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-travel-blue" />;
      case 'mixed':
        return <Cloud className="h-5 w-5 text-travel-purple" />;
      default:
        return <Sun className="h-5 w-5 text-travel-yellow" />;
    }
  };

  const getConditionText = () => {
    switch (forecast.condition) {
      case 'sunny':
        return 'Mostly sunny';
      case 'cloudy':
        return 'Partly cloudy';
      case 'rainy':
        return 'Expect rain';
      case 'mixed':
        return 'Mixed conditions';
      default:
        return 'Pleasant weather';
    }
  };

  return (
    <Card className="p-4 shadow-card border-0 bg-card">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Weather Forecast</h3>
          <div className="flex items-center gap-2">
            {getWeatherIcon()}
            <span className="text-sm font-medium text-foreground">
              {getConditionText()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-travel-orange" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-sm font-medium text-foreground">
                {forecast.temp.high}°F / {forecast.temp.low}°F
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-medium text-foreground">{forecast.humidity}%</p>
          </div>
        </div>
        
        <div className="p-2 bg-travel-blue/10 rounded-lg">
          <p className="text-xs text-travel-blue">
            💡 Based on the weather, we've adjusted your packing recommendations
          </p>
        </div>
      </div>
    </Card>
  );
}