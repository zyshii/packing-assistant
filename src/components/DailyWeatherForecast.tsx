import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Thermometer, Shirt, Umbrella, Snowflake } from "lucide-react";

interface DailyForecast {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
  temp: { high: number; low: number };
  humidity: number;
}

interface DailyWeatherProps {
  destination: string;
  forecasts: DailyForecast[];
}

const getWeatherIcon = (condition: string, size = 20) => {
  const iconProps = { className: `h-${size/4} w-${size/4}` };
  
  switch (condition) {
    case 'sunny':
      return <Sun {...iconProps} className={`h-5 w-5 text-yellow-500`} />;
    case 'cloudy':
      return <Cloud {...iconProps} className={`h-5 w-5 text-gray-500`} />;
    case 'rainy':
      return <CloudRain {...iconProps} className={`h-5 w-5 text-blue-500`} />;
    case 'snowy':
      return <CloudSnow {...iconProps} className={`h-5 w-5 text-blue-200`} />;
    case 'mixed':
      return <Wind {...iconProps} className={`h-5 w-5 text-gray-600`} />;
    default:
      return <Cloud {...iconProps} className={`h-5 w-5 text-gray-500`} />;
  }
};

const getClothingRecommendations = (forecast: DailyForecast) => {
  const recommendations = [];
  
  // Temperature-based recommendations
  if (forecast.temp.high >= 75) {
    recommendations.push({ item: "Light clothing", icon: <Shirt className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" });
    recommendations.push({ item: "Sunscreen", icon: <Sun className="h-4 w-4" />, color: "bg-orange-100 text-orange-800" });
  } else if (forecast.temp.high >= 60) {
    recommendations.push({ item: "Layers", icon: <Shirt className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" });
  } else {
    recommendations.push({ item: "Warm clothing", icon: <Shirt className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" });
  }
  
  // Condition-based recommendations
  if (forecast.condition === 'rainy' || (forecast.condition === 'mixed' && forecast.humidity > 70)) {
    recommendations.push({ item: "Rain jacket", icon: <Umbrella className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" });
    recommendations.push({ item: "Waterproof shoes", icon: <Umbrella className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" });
  }
  
  if (forecast.condition === 'snowy') {
    recommendations.push({ item: "Winter coat", icon: <Snowflake className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" });
    recommendations.push({ item: "Warm boots", icon: <Snowflake className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" });
  }
  
  return recommendations;
};

export default function DailyWeatherForecast({ destination, forecasts }: DailyWeatherProps) {
  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Weather & Clothing Guide</h3>
        </div>
        
        <div className="space-y-4">
          {forecasts.map((forecast, index) => (
            <div key={index} className="p-4 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getWeatherIcon(forecast.condition)}
                  <div>
                    <p className="font-medium text-foreground">{forecast.date}</p>
                    <p className="text-sm text-muted-foreground capitalize">{forecast.condition}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {forecast.temp.high}°F
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Low: {forecast.temp.low}°F
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Recommended items:</p>
                <div className="flex flex-wrap gap-2">
                  {getClothingRecommendations(forecast).map((rec, recIndex) => (
                    <Badge 
                      key={recIndex} 
                      variant="secondary" 
                      className={`${rec.color} text-xs flex items-center gap-1`}
                    >
                      {rec.icon}
                      {rec.item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-travel-blue/10 rounded-lg border border-travel-blue/20">
          <p className="text-sm text-travel-blue">
            💡 Weather can change unexpectedly. Pack one extra layer and check forecasts before departure.
          </p>
        </div>
      </div>
    </Card>
  );
}