import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Shirt } from "lucide-react";

interface DailyClothingData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
  temp: { high: number; low: number };
  timeOfDay: any[];
}

interface DailyClothingSuggestionsProps {
  dailyData: DailyClothingData[];
}

const getTimeTemperature = (period: string, temp: { high: number; low: number }) => {
  switch (period) {
    case 'morning':
      const morningLow = temp.low;
      const morningHigh = temp.low + 7;
      return { 
        fahrenheit: `${morningLow}–${morningHigh} °F`,
        celsius: `${Math.round((morningLow - 32) * 5/9)}–${Math.round((morningHigh - 32) * 5/9)} °C`
      };
    case 'daytime':
      const daytimeLow = temp.high - 5;
      const daytimeHigh = temp.high;
      return { 
        fahrenheit: `${daytimeLow}–${daytimeHigh} °F`,
        celsius: `${Math.round((daytimeLow - 32) * 5/9)}–${Math.round((daytimeHigh - 32) * 5/9)} °C`
      };
    case 'evening':
      const eveningLow = temp.low + 2;
      const eveningHigh = temp.low + 7;
      return { 
        fahrenheit: `${eveningLow}–${eveningHigh} °F`,
        celsius: `${Math.round((eveningLow - 32) * 5/9)}–${Math.round((eveningHigh - 32) * 5/9)} °C`
      };
    default:
      return { fahrenheit: '', celsius: '' };
  }
};

const getDetailedClothingSuggestions = (condition: string, temp: { high: number; low: number }, period: string) => {
  const suggestions: string[] = [];
  
  if (period === 'morning') {
    if (temp.low < 60) {
      suggestions.push("Light long-sleeve shirt or T-shirt with a thin sweater or hoodie");
      suggestions.push("Comfortable pants or jeans");
      suggestions.push("Closed shoes or lightweight sneakers");
    } else {
      suggestions.push("Light T-shirt or thin long-sleeve shirt");
      suggestions.push("Comfortable pants or light trousers");
      suggestions.push("Comfortable walking shoes");
    }
  } else if (period === 'daytime') {
    if (temp.high >= 75) {
      suggestions.push("Short-sleeve shirts or breathable T-shirts");
      suggestions.push("Shorts, skirts, or lightweight trousers");
      suggestions.push("Light socks and comfortable walking shoes or sandals");
      suggestions.push("Sunglasses, hat, and sunscreen recommended due to strong summer sun");
    } else if (temp.high >= 65) {
      suggestions.push("Comfortable T-shirts or light sweaters");
      suggestions.push("Pants or jeans");
      suggestions.push("Comfortable walking shoes");
      suggestions.push("Light jacket for temperature variations");
    } else {
      suggestions.push("Warm layers - sweater or light jacket");
      suggestions.push("Long pants or jeans");
      suggestions.push("Closed shoes or boots");
      suggestions.push("Consider gloves if very cold");
    }
    
    if (condition === 'rainy' || condition === 'mixed') {
      suggestions.push("Light rain jacket or umbrella");
      suggestions.push("Waterproof shoes recommended");
    }
  } else if (period === 'evening') {
    if (temp.low < 65) {
      suggestions.push("Carry a light jacket or cardigan");
      suggestions.push("Jeans or long pants again, if going out or staying into the evening");
      suggestions.push("Comfortable closed shoes");
    } else {
      suggestions.push("Light layers for comfort");
      suggestions.push("Comfortable pants or evening wear");
      suggestions.push("Comfortable shoes for walking");
    }
    
    if (condition === 'rainy') {
      suggestions.push("Keep umbrella or rain jacket handy");
    }
  }
  
  return suggestions;
};

export default function DailyClothingSuggestions({ dailyData }: DailyClothingSuggestionsProps) {
  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Clothing Suggestions</h3>
        </div>
        
        {dailyData.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <h4 className="text-lg font-medium text-foreground">{day.date}</h4>
              <Badge variant="secondary" className="text-xs">
                {day.temp.high}°F / {day.temp.low}°F
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {day.condition}
              </Badge>
            </div>
            
            <div className="space-y-6">
              {/* Morning */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-600" />
                  <h5 className="font-medium text-foreground">Morning (dawn to ~9 AM):</h5>
                  <span className="text-sm font-medium text-muted-foreground">
                    ~{getTimeTemperature('morning', day.temp).fahrenheit} / ~{getTimeTemperature('morning', day.temp).celsius}
                  </span>
                </div>
                <div className="ml-6 space-y-1">
                  {getDetailedClothingSuggestions(day.condition, day.temp, 'morning').map((suggestion, index) => (
                    <p key={index} className="text-sm text-foreground">• {suggestion}</p>
                  ))}
                </div>
              </div>

              {/* Daytime */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-blue-600" />
                  <h5 className="font-medium text-foreground">Daytime (~9 AM–6 PM):</h5>
                  <span className="text-sm font-medium text-muted-foreground">
                    ~{getTimeTemperature('daytime', day.temp).fahrenheit} / ~{getTimeTemperature('daytime', day.temp).celsius}
                  </span>
                </div>
                <div className="ml-6 space-y-1">
                  {getDetailedClothingSuggestions(day.condition, day.temp, 'daytime').map((suggestion, index) => (
                    <p key={index} className="text-sm text-foreground">• {suggestion}</p>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-purple-600" />
                  <h5 className="font-medium text-foreground">Evening (after ~6 PM):</h5>
                  <span className="text-sm font-medium text-muted-foreground">
                    ~{getTimeTemperature('evening', day.temp).fahrenheit} / ~{getTimeTemperature('evening', day.temp).celsius}
                  </span>
                </div>
                <div className="ml-6 space-y-1">
                  {getDetailedClothingSuggestions(day.condition, day.temp, 'evening').map((suggestion, index) => (
                    <p key={index} className="text-sm text-foreground">• {suggestion}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-travel-blue/10 rounded-lg border border-travel-blue/20">
          <p className="text-sm text-travel-blue">
            💡 These suggestions are based on weather conditions and time of day. Adjust based on your personal preferences and planned activities.
          </p>
        </div>
      </div>
    </Card>
  );
}